import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient();
    const coinflipId = params.id;

    // Get coinflip
    const { data: coinflip, error: coinflipError } = await supabase
      .from('coinflips')
      .select('*')
      .eq('id', coinflipId)
      .single();

    if (coinflipError) {
      return NextResponse.json({ error: 'Coinflip not found', details: coinflipError }, { status: 404 });
    }

    // Get creator prompt
    const { data: creatorPrompt, error: creatorPromptError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', coinflip.creator_prompt_id)
      .single();

    // Get all prompts for creator
    const { data: allCreatorPrompts } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', coinflip.creator_id);

    return NextResponse.json({
      coinflip,
      creatorPrompt: creatorPrompt || null,
      creatorPromptError: creatorPromptError || null,
      allCreatorPrompts: allCreatorPrompts || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
