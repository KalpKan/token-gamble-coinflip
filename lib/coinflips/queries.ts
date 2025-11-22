import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Coinflip } from '@/types/database'

type TypedSupabaseClient = SupabaseClient<Database> | any

/**
 * Coinflip management data layer
 * Provides functions for CRUD operations on coinflips
 */

// ============================================================================
// Create Operations
// ============================================================================

/**
 * Create a new coinflip
 * @param supabase - Supabase client instance
 * @param creatorId - ID of the user creating the coinflip
 * @param creatorPromptId - ID of the prompt being wagered
 * @param creatorCoinSide - Coin side chosen by creator ('heads' or 'tails')
 * @param depth - Response depth level ('short', 'medium', or 'long')
 * @returns The created coinflip or null if creation failed
 */
export async function createCoinflip(
  supabase: TypedSupabaseClient,
  creatorId: string,
  creatorPromptId: string,
  creatorCoinSide: 'heads' | 'tails',
  depth: 'short' | 'medium' | 'long'
): Promise<Coinflip | null> {
  try {
    const { data, error } = await supabase
      .from('coinflips')
      .insert({
        creator_id: creatorId,
        creator_prompt_id: creatorPromptId,
        creator_coin_side: creatorCoinSide,
        depth,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating coinflip:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error creating coinflip:', error)
    return null
  }
}

// ============================================================================
// Read Operations
// ============================================================================

/**
 * Get all open coinflips
 * @param supabase - Supabase client instance
 * @returns Array of open coinflips ordered by creation time (newest first)
 */
export async function getOpenCoinflips(
  supabase: TypedSupabaseClient
): Promise<Coinflip[]> {
  try {
    const { data, error } = await supabase
      .from('coinflips')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching open coinflips:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching open coinflips:', error)
    return []
  }
}

/**
 * Get all open coinflips with creator prompt data
 * @param supabase - Supabase client instance
 * @returns Array of open coinflips with prompt text
 */
export async function getOpenCoinflipsWithPrompts(
  supabase: TypedSupabaseClient
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('coinflips')
      .select(`
        *,
        creator_prompt:prompts!creator_prompt_id(id, text, user_id)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching open coinflips with prompts:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching open coinflips with prompts:', error)
    return []
  }
}

/**
 * Get a single coinflip by ID
 * @param supabase - Supabase client instance
 * @param coinflipId - ID of the coinflip
 * @returns The coinflip or null if not found
 */
export async function getCoinflipById(
  supabase: TypedSupabaseClient,
  coinflipId: string
): Promise<Coinflip | null> {
  try {
    const { data, error } = await supabase
      .from('coinflips')
      .select('*')
      .eq('id', coinflipId)
      .single()

    if (error) {
      console.error('Error fetching coinflip:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching coinflip:', error)
    return null
  }
}

/**
 * Get last 10 settled coinflips for current user
 * @param supabase - Supabase client instance
 * @param userId - ID of the current user
 * @returns Array of completed coinflips with prompt data
 */
export async function getSettledCoinflips(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('coinflips')
      .select(`
        *,
        creator_prompt:prompts!creator_prompt_id(id, text, user_id),
        joiner_prompt:prompts!joiner_prompt_id(id, text, user_id)
      `)
      .eq('status', 'completed')
      .or(`creator_id.eq.${userId},joiner_id.eq.${userId}`)
      .order('completed_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching settled coinflips:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching settled coinflips:', error)
    return []
  }
}

// ============================================================================
// Update Operations
// ============================================================================

/**
 * Join an existing coinflip
 * @param supabase - Supabase client instance
 * @param coinflipId - ID of the coinflip to join
 * @param joinerId - ID of the user joining
 * @param joinerPromptId - ID of the prompt being wagered by joiner
 * @returns True if join succeeded, false otherwise
 */
export async function joinCoinflip(
  supabase: TypedSupabaseClient,
  coinflipId: string,
  joinerId: string,
  joinerPromptId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('coinflips')
      .update({
        joiner_id: joinerId,
        joiner_prompt_id: joinerPromptId,
        status: 'active',
      })
      .eq('id', coinflipId)

    if (error) {
      console.error('Error joining coinflip:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error joining coinflip:', error)
    return false
  }
}

/**
 * Update coinflip with result and winner
 * @param supabase - Supabase client instance
 * @param coinflipId - ID of the coinflip
 * @param result - The coin flip result ('heads' or 'tails')
 * @param winnerId - ID of the winning user
 * @returns True if update succeeded, false otherwise
 */
export async function updateCoinflipResult(
  supabase: TypedSupabaseClient,
  coinflipId: string,
  result: 'heads' | 'tails',
  winnerId: string
): Promise<boolean> {
  try {
    console.log('updateCoinflipResult called with:', { coinflipId, result, winnerId });
    
    // Use database function to bypass RLS
    const { data, error } = await supabase
      .rpc('update_coinflip_result', {
        p_coinflip_id: coinflipId,
        p_result: result,
        p_winner_id: winnerId
      })

    console.log('updateCoinflipResult response:', { data, error });

    if (error) {
      console.error('Error updating coinflip result:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error updating coinflip result:', error)
    return false
  }
}

// ============================================================================
// Delete Operations
// ============================================================================

/**
 * Cancel a coinflip (delete it)
 * @param supabase - Supabase client instance
 * @param coinflipId - ID of the coinflip to cancel
 * @returns True if cancellation succeeded, false otherwise
 */
export async function cancelCoinflip(
  supabase: TypedSupabaseClient,
  coinflipId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('coinflips')
      .delete()
      .eq('id', coinflipId)

    if (error) {
      console.error('Error cancelling coinflip:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error cancelling coinflip:', error)
    return false
  }
}
