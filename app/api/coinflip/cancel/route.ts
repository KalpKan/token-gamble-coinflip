import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, requireAuth } from '@/lib/supabase/server';
import { getCoinflipById, cancelCoinflip } from '@/lib/coinflips/queries';
import { unlockPrompt } from '@/lib/prompts/queries';
import type { CancelCoinflipRequest, CancelCoinflipResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Parse request body
    const body: CancelCoinflipRequest = await request.json();
    const { coinflipId } = body;

    // Validate coinflipId in request body
    if (!coinflipId || typeof coinflipId !== 'string') {
      return NextResponse.json(
        { error: 'coinflipId is required and must be a string' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createServerClient();

    // Get the coinflip to verify ownership and status
    const coinflip = await getCoinflipById(supabase, coinflipId);

    if (!coinflip) {
      return NextResponse.json(
        { error: 'Coinflip not found' },
        { status: 404 }
      );
    }

    // Verify user is the creator
    if (coinflip.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'You are not the creator of this coinflip' },
        { status: 403 }
      );
    }

    // Verify coinflip is in 'open' status
    if (coinflip.status !== 'open') {
      return NextResponse.json(
        { error: `Cannot cancel coinflip with status '${coinflip.status}'. Only 'open' coinflips can be cancelled.` },
        { status: 400 }
      );
    }

    // Delete coinflip record
    const cancelSuccess = await cancelCoinflip(supabase, coinflipId);

    if (!cancelSuccess) {
      return NextResponse.json(
        { error: 'Failed to cancel coinflip' },
        { status: 500 }
      );
    }

    // Update prompt status back to 'loaded'
    const unlockSuccess = await unlockPrompt(supabase, coinflip.creator_prompt_id);

    if (!unlockSuccess) {
      // Log the error but don't fail the request since the coinflip is already deleted
      console.error('Failed to unlock prompt after cancelling coinflip');
    }

    // Return success response
    const response: CancelCoinflipResponse = {
      success: true,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error cancelling coinflip:', error);

    // Handle authentication errors
    if (error?.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: error?.message || 'An error occurred while cancelling the coinflip' },
      { status: 500 }
    );
  }
}
