'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { getPromptsByUser } from '@/lib/prompts/queries'
import { modalAnimation, backdropAnimation, buttonAnimation } from '@/lib/animations'
import CoinAnimation from './CoinAnimation'
import CoinflipResult from './CoinflipResult'
import type { CoinflipModalProps } from '@/types/components'
import type { Prompt, ResponseDepth, CoinSide } from '@/types/database'
import type { CreateCoinflipRequest, JoinCoinflipRequest, JoinCoinflipResponse, CoinflipResult as CoinflipResultType } from '@/types/api'

export default function CoinflipModal({
  isOpen,
  onClose,
  mode,
  coinflip,
}: CoinflipModalProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedPromptId, setSelectedPromptId] = useState<string>('')
  const [depth, setDepth] = useState<ResponseDepth>('short')
  const [coinSide, setCoinSide] = useState<CoinSide>('heads')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [fetchingPrompts, setFetchingPrompts] = useState(true)
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [coinflipResult, setCoinflipResult] = useState<CoinflipResultType | null>(null)

  const supabase = createClient()

  // Fetch user's loaded prompts when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLoadedPrompts()
    } else {
      // Reset form when modal closes
      setSelectedPromptId('')
      setDepth('short')
      setCoinSide('heads')
      setError('')
      setLoading(false)
      setShowCoinAnimation(false)
      setShowResult(false)
      setCoinflipResult(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Pre-fill depth from coinflip when in join mode
  useEffect(() => {
    if (mode === 'join' && coinflip) {
      setDepth(coinflip.depth)
    }
  }, [mode, coinflip])

  const fetchLoadedPrompts = async () => {
    setFetchingPrompts(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in')
        return
      }

      const loadedPrompts = await getPromptsByUser(supabase, user.id, 'loaded')
      setPrompts(loadedPrompts)

      if (loadedPrompts.length === 0) {
        setError('You need at least one loaded prompt to create or join a coinflip')
      }
    } catch (err) {
      console.error('Error fetching prompts:', err)
      setError('Failed to load your prompts')
    } finally {
      setFetchingPrompts(false)
    }
  }

  const handleSubmit = async () => {
    // Validate form
    if (!selectedPromptId) {
      setError('Please select a prompt')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (mode === 'create') {
        await handleCreate()
      } else {
        await handleJoin()
      }
    } catch (err: any) {
      console.error('Error submitting coinflip:', err)
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    const requestBody: CreateCoinflipRequest = {
      promptId: selectedPromptId,
      depth,
      coinSide,
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

    // Success - close modal
    onClose()
  }

  const handleJoin = async () => {
    if (!coinflip) {
      throw new Error('No coinflip selected')
    }

    const requestBody: JoinCoinflipRequest = {
      coinflipId: coinflip.id,
      promptId: selectedPromptId,
    }

    const response = await fetch('/api/coinflip/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to join coinflip')
    }

    const joinResponse = data as JoinCoinflipResponse

    // Store the result and show coin animation
    setCoinflipResult(joinResponse.result)
    setShowCoinAnimation(true)
  }

  const handleAnimationComplete = () => {
    // Hide coin animation and show result
    setShowCoinAnimation(false)
    setShowResult(true)
  }

  const handleResultClose = () => {
    // Close everything and reset
    setShowResult(false)
    setCoinflipResult(null)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose()
    }
  }

  const getOpponentCoinSide = (): CoinSide => {
    if (mode === 'join' && coinflip) {
      return coinflip.creator_coin_side === 'heads' ? 'tails' : 'heads'
    }
    return 'heads'
  }

  return (
    <>
      {/* Coin Animation Overlay */}
      {showCoinAnimation && coinflipResult && (
        <CoinAnimation
          result={coinflipResult.coinflip.result || 'heads'}
          onComplete={handleAnimationComplete}
          duration={3000}
        />
      )}

      {/* Result Overlay */}
      {showResult && coinflipResult && (
        <div onClick={handleResultClose}>
          <CoinflipResult
            isWinner={coinflipResult.isWinner}
            answer={coinflipResult.answer}
          />
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && !showCoinAnimation && !showResult && (
          <motion.div
            variants={backdropAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {mode === 'create' ? 'Create Coinflip' : 'Join Coinflip'}
              </h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {fetchingPrompts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent"></div>
                  <span className="ml-3 text-gray-400">Loading prompts...</span>
                </div>
              ) : (
                <>
                  {/* Prompt Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Prompt
                    </label>
                    <select
                      value={selectedPromptId}
                      onChange={(e) => setSelectedPromptId(e.target.value)}
                      disabled={loading || prompts.length === 0}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Choose a prompt...</option>
                      {prompts.map((prompt) => (
                        <option key={prompt.id} value={prompt.id}>
                          {prompt.text.length > 60
                            ? `${prompt.text.substring(0, 60)}...`
                            : prompt.text}
                        </option>
                      ))}
                    </select>
                    {prompts.length === 0 && (
                      <p className="text-sm text-gray-400 mt-2">
                        No loaded prompts available. Create a prompt first.
                      </p>
                    )}
                  </div>

                  {/* Depth Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Response Depth
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['short', 'medium', 'long'] as ResponseDepth[]).map((depthOption) => (
                        <button
                          key={depthOption}
                          type="button"
                          onClick={() => setDepth(depthOption)}
                          disabled={loading || (mode === 'join')}
                          className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            depth === depthOption
                              ? depthOption === 'short'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                                : depthOption === 'medium'
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                                : 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {depthOption.charAt(0).toUpperCase() + depthOption.slice(1)}
                        </button>
                      ))}
                    </div>
                    {mode === 'join' && (
                      <p className="text-sm text-gray-400 mt-2">
                        Depth is set by the creator
                      </p>
                    )}
                  </div>

                  {/* Coin Side Selection - Create Mode Only */}
                  {mode === 'create' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Choose Your Side
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {(['heads', 'tails'] as CoinSide[]).map((side) => (
                          <button
                            key={side}
                            type="button"
                            onClick={() => setCoinSide(side)}
                            disabled={loading}
                            className={`px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                              coinSide === side
                                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/50 scale-105'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-md">
                              <span className="text-black font-bold text-sm">
                                {side === 'heads' ? 'H' : 'T'}
                              </span>
                            </div>
                            <span className="capitalize">{side}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Your Side
                      </label>
                      <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                          <span className="text-black font-bold">
                            {getOpponentCoinSide() === 'heads' ? 'H' : 'T'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold capitalize">
                            {getOpponentCoinSide()}
                          </p>
                          <p className="text-sm text-gray-400">
                            (Opposite of creator&apos;s choice)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-700">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-center"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={!loading && !fetchingPrompts && prompts.length > 0 ? buttonAnimation.hover : undefined}
                  whileTap={!loading && !fetchingPrompts && prompts.length > 0 ? buttonAnimation.tap : undefined}
                  onClick={handleSubmit}
                  disabled={loading || fetchingPrompts || prompts.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/50"
                >
                  {loading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-black border-r-transparent"></div>
                  )}
                  {mode === 'create' ? 'Create Coinflip' : 'Join & Flip'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
