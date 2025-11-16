import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Prompt } from '@/types/database'

type TypedSupabaseClient = SupabaseClient<Database> | any

/**
 * Prompt management data layer
 * Provides functions for CRUD operations on prompts
 */

// ============================================================================
// Create Operations
// ============================================================================

/**
 * Create a new prompt for a user
 * @param supabase - Supabase client instance
 * @param userId - ID of the user creating the prompt
 * @param text - The prompt text
 * @returns The created prompt or null if creation failed
 */
export async function createPrompt(
  supabase: TypedSupabaseClient,
  userId: string,
  text: string
): Promise<Prompt | null> {
  try {
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
  } catch (error) {
    console.error('Unexpected error creating prompt:', error)
    return null
  }
}

// ============================================================================
// Read Operations
// ============================================================================

/**
 * Get all prompts for a user, optionally filtered by status
 * @param supabase - Supabase client instance
 * @param userId - ID of the user
 * @param status - Optional status filter ('loaded', 'locked', or 'settled')
 * @returns Array of prompts matching the criteria
 */
export async function getPromptsByUser(
  supabase: TypedSupabaseClient,
  userId: string,
  status?: Prompt['status']
): Promise<Prompt[]> {
  try {
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
  } catch (error) {
    console.error('Unexpected error fetching prompts:', error)
    return []
  }
}

/**
 * Get a single prompt by ID
 * @param supabase - Supabase client instance
 * @param promptId - ID of the prompt
 * @returns The prompt or null if not found
 */
export async function getPromptById(
  supabase: TypedSupabaseClient,
  promptId: string
): Promise<Prompt | null> {
  try {
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
  } catch (error) {
    console.error('Unexpected error fetching prompt:', error)
    return null
  }
}

// ============================================================================
// Update Operations
// ============================================================================

/**
 * Update prompt text
 * @param supabase - Supabase client instance
 * @param promptId - ID of the prompt to update
 * @param text - New prompt text
 * @returns True if update succeeded, false otherwise
 */
export async function updatePrompt(
  supabase: TypedSupabaseClient,
  promptId: string,
  text: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('prompts')
      .update({ text })
      .eq('id', promptId)

    if (error) {
      console.error('Error updating prompt:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error updating prompt:', error)
    return false
  }
}

/**
 * Lock a prompt (mark as locked for a coinflip)
 * @param supabase - Supabase client instance
 * @param promptId - ID of the prompt to lock
 * @returns True if lock succeeded, false otherwise
 */
export async function lockPrompt(
  supabase: TypedSupabaseClient,
  promptId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('prompts')
      .update({ status: 'locked' })
      .eq('id', promptId)

    if (error) {
      console.error('Error locking prompt:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error locking prompt:', error)
    return false
  }
}

/**
 * Unlock a prompt (mark as loaded again)
 * @param supabase - Supabase client instance
 * @param promptId - ID of the prompt to unlock
 * @returns True if unlock succeeded, false otherwise
 */
export async function unlockPrompt(
  supabase: TypedSupabaseClient,
  promptId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('prompts')
      .update({ status: 'loaded' })
      .eq('id', promptId)

    if (error) {
      console.error('Error unlocking prompt:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error unlocking prompt:', error)
    return false
  }
}

/**
 * Settle a prompt with response data (mark as answered)
 * @param supabase - Supabase client instance
 * @param promptId - ID of the prompt to settle
 * @param response - The API response text
 * @param responseDepth - The depth level used ('short', 'medium', or 'long')
 * @param tokensUsed - Number of tokens consumed
 * @returns True if settle succeeded, false otherwise
 */
export async function settlePrompt(
  supabase: TypedSupabaseClient,
  promptId: string,
  response: string,
  responseDepth: Prompt['response_depth'],
  tokensUsed: number
): Promise<boolean> {
  try {
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
  } catch (error) {
    console.error('Unexpected error settling prompt:', error)
    return false
  }
}

// ============================================================================
// Delete Operations
// ============================================================================

/**
 * Delete a prompt
 * @param supabase - Supabase client instance
 * @param promptId - ID of the prompt to delete
 * @returns True if deletion succeeded, false otherwise
 */
export async function deletePrompt(
  supabase: TypedSupabaseClient,
  promptId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', promptId)

    if (error) {
      console.error('Error deleting prompt:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error deleting prompt:', error)
    return false
  }
}
