import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, User, Prompt, Coinflip } from '@/types/database'

type TypedSupabaseClient = SupabaseClient<Database> | any

/**
 * Helper functions for common database operations
 * These can be used with both browser and server clients
 */

// ============================================================================
// User Operations
// ============================================================================

/**
 * Get user profile by ID
 */
export async function getUserById(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}

/**
 * Update user's OpenAI API key
 */
export async function updateUserApiKey(
  supabase: TypedSupabaseClient,
  userId: string,
  apiKey: string
): Promise<boolean> {
  const { error} = await supabase
    .from('users')
    .update({ openai_api_key: apiKey })
    .eq('id', userId)

  if (error) {
    console.error('Error updating API key:', error)
    return false
  }

  return true
}

// ============================================================================
// Prompt Operations
// ============================================================================

/**
 * Get all prompts for a user, optionally filtered by status
 */
export async function getUserPrompts(
  supabase: TypedSupabaseClient,
  userId: string,
  status?: Prompt['status']
): Promise<Prompt[]> {
  let query = supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching prompts:', error)
    return []
  }

  return data || []
}

/**
 * Get a single prompt by ID
 */
export async function getPromptById(
  supabase: TypedSupabaseClient,
  promptId: string
): Promise<Prompt | null> {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', promptId)
    .single()

  if (error) {
    console.error('Error fetching prompt:', error)
    return null
  }

  return data
}

/**
 * Create a new prompt
 */
export async function createPrompt(
  supabase: TypedSupabaseClient,
  userId: string,
  text: string
): Promise<Prompt | null> {
  const { data, error } = await supabase
    .from('prompts')
    .insert({
      user_id: userId,
      text,
      status: 'loaded',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating prompt:', error)
    return null
  }

  return data
}

/**
 * Update prompt text
 */
export async function updatePromptText(
  supabase: TypedSupabaseClient,
  promptId: string,
  text: string
): Promise<boolean> {
  const { error } = await supabase
    .from('prompts')
    .update({ text })
    .eq('id', promptId)

  if (error) {
    console.error('Error updating prompt:', error)
    return false
  }

  return true
}

/**
 * Update prompt status
 */
export async function updatePromptStatus(
  supabase: TypedSupabaseClient,
  promptId: string,
  status: Prompt['status']
): Promise<boolean> {
  const { error } = await supabase
    .from('prompts')
    .update({ status })
    .eq('id', promptId)

  if (error) {
    console.error('Error updating prompt status:', error)
    return false
  }

  return true
}

/**
 * Delete a prompt
 */
export async function deletePrompt(
  supabase: TypedSupabaseClient,
  promptId: string
): Promise<boolean> {
  const { error } = await supabase.from('prompts').delete().eq('id', promptId)

  if (error) {
    console.error('Error deleting prompt:', error)
    return false
  }

  return true
}

/**
 * Settle a prompt with response
 */
export async function settlePrompt(
  supabase: TypedSupabaseClient,
  promptId: string,
  response: string,
  responseDepth: Prompt['response_depth'],
  tokensUsed: number
): Promise<boolean> {
  const { error } = await supabase
    .from('prompts')
    .update({
      status: 'settled',
      response,
      response_depth: responseDepth,
      tokens_used: tokensUsed,
      settled_at: new Date().toISOString(),
    })
    .eq('id', promptId)

  if (error) {
    console.error('Error settling prompt:', error)
    return false
  }

  return true
}

// ============================================================================
// Coinflip Operations
// ============================================================================

/**
 * Get all open coinflips
 */
export async function getOpenCoinflips(
  supabase: TypedSupabaseClient
): Promise<Coinflip[]> {
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
}

/**
 * Get a single coinflip by ID
 */
export async function getCoinflipById(
  supabase: TypedSupabaseClient,
  coinflipId: string
): Promise<Coinflip | null> {
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
}

/**
 * Create a new coinflip
 */
export async function createCoinflip(
  supabase: TypedSupabaseClient,
  creatorId: string,
  creatorPromptId: string,
  creatorCoinSide: Coinflip['creator_coin_side'],
  depth: Coinflip['depth']
): Promise<Coinflip | null> {
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
}

/**
 * Delete a coinflip (for cancellation)
 */
export async function deleteCoinflip(
  supabase: TypedSupabaseClient,
  coinflipId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('coinflips')
    .delete()
    .eq('id', coinflipId)

  if (error) {
    console.error('Error deleting coinflip:', error)
    return false
  }

  return true
}

/**
 * Update coinflip with joiner information
 */
export async function joinCoinflip(
  supabase: TypedSupabaseClient,
  coinflipId: string,
  joinerId: string,
  joinerPromptId: string
): Promise<boolean> {
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
}

/**
 * Update coinflip with result and winner
 */
export async function completeCoinflip(
  supabase: TypedSupabaseClient,
  coinflipId: string,
  result: Coinflip['result'],
  winnerId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('coinflips')
    .update({
      result,
      winner_id: winnerId,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', coinflipId)

  if (error) {
    console.error('Error completing coinflip:', error)
    return false
  }

  return true
}
