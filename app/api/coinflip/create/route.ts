import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, requireAuth } from '@/lib/supabase/server';
import { createCoinflip } from '@/lib/coinflips/queries';
import { getPromptById, lockPrompt } from '@/lib/prompts/queries';
import type { CreateCoinflipRequest, CreateCoinflipResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Parse request body
    const body: CreateCoinflipRequest = await request.json();
    const { promptId, depth, coinSide } = body;

    // Validate request body
    if (!promptId || typeof promptId !== 'string') {
      return NextResponse.json(
        { error: 'promptId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!depth || !['short', 'medium', 'long'].includes(depth)) {
      return NextResponse.json(
        { error: 'depth is required and must be one of: short, medium, long' },
        { status: 400 }
      );
    }

    if (!coinSide || !['heads', 'tails'].includes(coinSide)) {
      return NextResponse.json(
        { error: 'coinSide is required and must be one of: heads, tails' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createServerClient();

    // Verify user owns the prompt
    const prompt = await getPromptById(supabase, promptId);
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    if (prompt.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not own this prompt' },
        { status: 403 }
      );
    }

    // Verify prompt is in 'loaded' status
    if (prompt.status !== 'loaded') {
      return NextResponse.json(
        { error: `Prompt must be in 'loaded' status. Current status: ${prompt.status}` },
        { status: 400 }
      );
    }

    // Create the coinflip
    const coinflip = await createCoinflip(
      supabase,
      user.id,
      promptId,
      coinSide,
      depth
    );

    if (!coinflip) {
      return NextResponse.json(
        { error: 'Failed to create coinflip' },
        { status: 500 }
      );
    }

    // Update prompt status to 'locked'
    const lockSuccess = await lockPrompt(supabase, promptId);

    if (!lockSuccess) {
      // Rollback: delete the coinflip if we can't lock the prompt
      await supabase.from('coinflips').delete().eq('id', coinflip.id);
      
      return NextResponse.json(
        { error: 'Failed to lock prompt' },
        { status: 500 }
      );
    }

    // Return coinflip ID
    const response: CreateCoinflipResponse = {
      coinflipId: coinflip.id,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating coinflip:', error);

    // Handle authentication errors
    if (error?.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: error?.message || 'An error occurred while creating the coinflip' },
      { status: 500 }
    );
  }
}
