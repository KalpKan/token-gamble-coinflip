import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, requireAuth } from '@/lib/supabase/server';
import { getCoinflipById, joinCoinflip, updateCoinflipResult } from '@/lib/coinflips/queries';
import { getPromptById, lockPrompt, unlockPrompt, settlePrompt } from '@/lib/prompts/queries';
import type { JoinCoinflipRequest, JoinCoinflipResponse, CoinflipResult } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Parse request body
    const body: JoinCoinflipRequest = await request.json();
    const { coinflipId, promptId } = body;

    // Validate request body (coinflipId, promptId)
    if (!coinflipId || typeof coinflipId !== 'string') {
      return NextResponse.json(
        { error: 'coinflipId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!promptId || typeof promptId !== 'string') {
      return NextResponse.json(
        { error: 'promptId is required and must be a string' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createServerClient();

    // Verify user owns the prompt
    const joinerPrompt = await getPromptById(supabase, promptId);
    
    if (!joinerPrompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    if (joinerPrompt.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not own this prompt' },
        { status: 403 }
      );
    }

    // Verify prompt is in 'loaded' status
    if (joinerPrompt.status !== 'loaded') {
      return NextResponse.json(
        { error: `Prompt must be in 'loaded' status. Current status: ${joinerPrompt.status}` },
        { status: 400 }
      );
    }

    // Verify coinflip is still open
    const coinflip = await getCoinflipById(supabase, coinflipId);

    if (!coinflip) {
      return NextResponse.json(
        { error: 'Coinflip not found' },
        { status: 404 }
      );
    }

    if (coinflip.status !== 'open') {
      return NextResponse.json(
        { error: `Coinflip is not open. Current status: ${coinflip.status}` },
        { status: 400 }
      );
    }

    // Prevent user from joining their own coinflip
    if (coinflip.creator_id === user.id) {
      return NextResponse.json(
        { error: 'You cannot join your own coinflip' },
        { status: 400 }
      );
    }

    // Verify creator's prompt still exists
    const creatorPrompt = await getPromptById(supabase, coinflip.creator_prompt_id);
    
    if (!creatorPrompt) {
      console.error('Creator prompt not found:', { 
        coinflipId, 
        creatorPromptId: coinflip.creator_prompt_id,
        creatorId: coinflip.creator_id
      });
      
      return NextResponse.json(
        { error: 'This coinflip is invalid (creator prompt not found). Please try another one.' },
        { status: 400 }
      );
    }

    // Update coinflip with joiner information
    const joinSuccess = await joinCoinflip(supabase, coinflipId, user.id, promptId);

    if (!joinSuccess) {
      return NextResponse.json(
        { error: 'Failed to join coinflip' },
        { status: 500 }
      );
    }

    // Update joiner's prompt status to 'locked'
    const lockJoinerPromptSuccess = await lockPrompt(supabase, promptId);

    if (!lockJoinerPromptSuccess) {
      // Rollback: revert coinflip to open status
      await (supabase as any)
        .from('coinflips')
        .update({
          joiner_id: null,
          joiner_prompt_id: null,
          status: 'open',
        })
        .eq('id', coinflipId);

      return NextResponse.json(
        { error: 'Failed to lock joiner prompt' },
        { status: 500 }
      );
    }

    // Call /api/random/coinflip to get result
    const randomResponse = await fetch(
      `${request.nextUrl.origin}/api/random/coinflip`,
      { method: 'GET' }
    );

    if (!randomResponse.ok) {
      // Rollback: unlock joiner prompt and revert coinflip
      await unlockPrompt(supabase, promptId);
      await (supabase as any)
        .from('coinflips')
        .update({
          joiner_id: null,
          joiner_prompt_id: null,
          status: 'open',
        })
        .eq('id', coinflipId);

      return NextResponse.json(
        { error: 'Failed to generate random result' },
        { status: 500 }
      );
    }

    const { result } = await randomResponse.json();

    console.log('Coinflip result:', {
      result,
      creatorCoinSide: coinflip.creator_coin_side,
      creatorId: coinflip.creator_id,
      joinerId: user.id
    });

    // Determine winner based on coin sides and result
    const winnerId = result === coinflip.creator_coin_side ? coinflip.creator_id : user.id;
    const loserId = winnerId === coinflip.creator_id ? user.id : coinflip.creator_id;
    const winnerPromptId = winnerId === coinflip.creator_id ? coinflip.creator_prompt_id : promptId;
    const loserPromptId = winnerId === coinflip.creator_id ? promptId : coinflip.creator_prompt_id;
    const isWinner = winnerId === user.id;

    console.log('Winner determination:', {
      winnerId,
      loserId,
      isWinner,
      joinerIsWinner: isWinner
    });

    // Update coinflip with result and winner_id
    const updateResultSuccess = await updateCoinflipResult(supabase, coinflipId, result, winnerId);

    if (!updateResultSuccess) {
      // Rollback: unlock joiner prompt and revert coinflip
      await unlockPrompt(supabase, promptId);
      await (supabase as any)
        .from('coinflips')
        .update({
          joiner_id: null,
          joiner_prompt_id: null,
          status: 'open',
        })
        .eq('id', coinflipId);

      return NextResponse.json(
        { error: 'Failed to update coinflip result' },
        { status: 500 }
      );
    }

    // Fetch loser's API key from database
    const { data: loserData, error: loserError } = await supabase
      .from('users')
      .select('openai_api_key')
      .eq('id', loserId)
      .single();

    const loserApiKey = (loserData as any)?.openai_api_key;

    if (loserError || !loserApiKey) {
      // Rollback: unlock both prompts
      await unlockPrompt(supabase, promptId);
      await unlockPrompt(supabase, coinflip.creator_prompt_id);

      return NextResponse.json(
        { error: 'Loser does not have an API key configured' },
        { status: 400 }
      );
    }

    // Get winner's prompt to retrieve the text
    console.log('Fetching winner prompt:', { winnerPromptId, winnerId, creatorPromptId: coinflip.creator_prompt_id, joinerPromptId: promptId });
    const winnerPrompt = await getPromptById(supabase, winnerPromptId);

    if (!winnerPrompt) {
      console.error('Winner prompt not found:', { 
        winnerPromptId, 
        winnerId, 
        coinflipId,
        creatorPromptId: coinflip.creator_prompt_id,
        joinerPromptId: promptId
      });
      
      // Rollback: unlock both prompts
      await unlockPrompt(supabase, promptId);
      await unlockPrompt(supabase, coinflip.creator_prompt_id);

      return NextResponse.json(
        { error: `Winner prompt not found. Winner ID: ${winnerId}, Prompt ID: ${winnerPromptId}` },
        { status: 500 }
      );
    }

    // Call /api/openai/answer with winner's prompt and loser's API key
    const openaiResponse = await fetch(
      `${request.nextUrl.origin}/api/openai/answer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptText: winnerPrompt.text,
          depth: coinflip.depth,
          apiKey: loserApiKey,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      
      // Rollback: unlock both prompts
      await unlockPrompt(supabase, promptId);
      await unlockPrompt(supabase, coinflip.creator_prompt_id);

      return NextResponse.json(
        { error: `OpenAI API error: ${errorData.error || 'Unknown error'}` },
        { status: openaiResponse.status }
      );
    }

    const { answer, tokensUsed } = await openaiResponse.json();

    // Update winner's prompt to 'settled' with response
    const settleSuccess = await settlePrompt(
      supabase,
      winnerPromptId,
      answer,
      coinflip.depth,
      tokensUsed
    );

    if (!settleSuccess) {
      console.error('Failed to settle winner prompt, but coinflip completed');
    }

    // Update loser's prompt back to 'loaded'
    const unlockLoserSuccess = await unlockPrompt(supabase, loserPromptId);

    if (!unlockLoserSuccess) {
      console.error('Failed to unlock loser prompt, but coinflip completed');
    }

    // Get updated coinflip data
    const updatedCoinflip = await getCoinflipById(supabase, coinflipId);

    // Return complete result object with isWinner flag and answer
    const coinflipResult: CoinflipResult = {
      coinflip: updatedCoinflip || coinflip,
      isWinner,
      answer: isWinner ? answer : undefined,
    };

    const response: JoinCoinflipResponse = {
      success: true,
      result: coinflipResult,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error joining coinflip:', error);

    // Handle authentication errors
    if (error?.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: error?.message || 'An error occurred while joining the coinflip' },
      { status: 500 }
    );
  }
}
