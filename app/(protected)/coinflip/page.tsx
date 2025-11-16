'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { getPromptsByUser } from '@/lib/prompts/queries'
import type { Prompt } from '@/types/database'
import type { CreateCoinflipRequest } from '@/types/api'
import Toast from '@/components/Toast'

export default function CoinflipPage() {
  const [loadedPrompts, setLoadedPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedPromptId, setSelectedPromptId] = useState<string>('')
  const [selectedDepth, setSelectedDepth] = useState<'short' | 'medium' | 'long'>('medium')
  const [selectedCoinSide, setSelectedCoinSide] = useState<'heads' | 'tails'>('heads')
  const [isCreating, setIsCreating] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)
      await fetchPrompts(user.id)
      setLoading(false)
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPrompts = async (uid: string) => {
    const loaded = await getPromptsByUser(supabase, uid, 'loaded')
    setLoadedPrompts(loaded)
    
    // Auto-select first prompt if available
    if (loaded.length > 0 && !selectedPromptId) {
      setSelectedPromptId(loaded[0].id)
    }
  }

  const handleCreateCoinflip = async () => {
    if (!selectedPromptId) {
      showToast('Please select a prompt', 'error')
      return
    }

    setIsCreating(true)

    try {
      const requestBody: CreateCoinflipRequest = {
        promptId: selectedPromptId,
        depth: selectedDepth,
        coinSide: selectedCoinSide,
      }

      const response = await fetch('/api/coinflip/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create coinflip')
      }

      showToast('Coinflip created successfully!', 'success')
      
      // Refresh prompts to show updated status
      if (userId) {
        await fetchPrompts(userId)
      }
      
      // Reset selection
      setSelectedPromptId('')
      setSelectedDepth('medium')
      setSelectedCoinSide('heads')
    } catch (error: any) {
      console.error('Error creating coinflip:', error)
      showToast(error.message || 'Failed to create coinflip', 'error')
    } finally {
      setIsCreating(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const selectedPrompt = loadedPrompts.find(p => p.id === selectedPromptId)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Coinflip</h1>
          <p className="text-gray-400">Wager a prompt and challenge others to a coinflip</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent"></div>
            <p className="text-gray-400 mt-4">Loading prompts...</p>
          </div>
        ) : loadedPrompts.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No Loaded Prompts</h3>
            <p className="text-gray-400 mb-6">You need at least one loaded prompt to create a coinflip</p>
            <a
              href="/prompts"
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200"
            >
              Go to Prompts
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Prompt Selection */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Select Prompt to Wager</h2>
              <div className="space-y-3">
                {loadedPrompts.map((prompt) => (
                  <motion.button
                    key={prompt.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedPromptId(prompt.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedPromptId === prompt.id
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                    }`}
                  >
                    <p className="text-white leading-relaxed">{prompt.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created {new Date(prompt.created_at).toLocaleDateString()}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Depth Selection */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Response Depth</h2>
              <p className="text-gray-400 text-sm mb-4">
                Choose how detailed the AI response should be
              </p>
              <div className="grid grid-cols-3 gap-4">
                {(['short', 'medium', 'long'] as const).map((depth) => (
                  <motion.button
                    key={depth}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDepth(depth)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedDepth === depth
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-white font-semibold capitalize mb-1">{depth}</p>
                      <p className="text-xs text-gray-400">
                        {depth === 'short' && '~200 words'}
                        {depth === 'medium' && '~500 words'}
                        {depth === 'long' && '~1000 words'}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Coin Side Selection */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Choose Your Side</h2>
              <p className="text-gray-400 text-sm mb-4">
                Pick heads or tails for the coinflip
              </p>
              <div className="grid grid-cols-2 gap-4">
                {(['heads', 'tails'] as const).map((side) => (
                  <motion.button
                    key={side}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCoinSide(side)}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                      selectedCoinSide === side
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {side === 'heads' ? '👤' : '🔢'}
                      </div>
                      <p className="text-white font-semibold capitalize">{side}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Summary and Create Button */}
            {selectedPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-6 border border-yellow-500/30"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Coinflip Summary</h3>
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Prompt:</span>
                    <span className="text-white font-medium max-w-md text-right truncate">
                      {selectedPrompt.text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Depth:</span>
                    <span className="text-white font-medium capitalize">{selectedDepth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Your Side:</span>
                    <span className="text-white font-medium capitalize">{selectedCoinSide}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateCoinflip}
                  disabled={isCreating || !selectedPromptId}
                  className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg rounded-lg hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {isCreating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-3 border-solid border-black border-r-transparent"></div>
                      Creating Coinflip...
                    </span>
                  ) : (
                    'Create Coinflip'
                  )}
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
