'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { getOpenCoinflipsWithPrompts, getSettledCoinflips } from '@/lib/coinflips/queries'
import CoinflipModal from '@/components/CoinflipModal'
import { pageTransition, staggerContainer, listItem, buttonAnimation } from '@/lib/animations'
import type { RealtimeChannel } from '@supabase/supabase-js'

export default function LobbyPage() {
  const [coinflips, setCoinflips] = useState<any[]>([])
  const [settledCoinflips, setSettledCoinflips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [selectedCoinflip, setSelectedCoinflip] = useState<any | undefined>(undefined)
  const supabase = createClient()

  // Fetch initial data and set up real-time subscription
  useEffect(() => {
    let channel: RealtimeChannel | null = null

    let user: any = null

    async function initialize() {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        user = currentUser
        setCurrentUserId(user?.id || null)

        // Fetch initial open coinflips with prompts
        const openCoinflips = await getOpenCoinflipsWithPrompts(supabase)
        setCoinflips(openCoinflips)

        // Fetch settled coinflips for current user
        if (user?.id) {
          const settled = await getSettledCoinflips(supabase, user.id)
          setSettledCoinflips(settled)
        }
      } catch (error) {
        console.error('Error initializing lobby:', error)
      } finally {
        setLoading(false)
      }

      // Set up real-time subscription for coinflips table
      channel = supabase
        .channel('coinflips-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'coinflips',
            filter: 'status=eq.open'
          },
          (payload) => {
            // Add new coinflip to the list
            setCoinflips((current) => [payload.new as any, ...current])
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'coinflips'
          },
          (payload) => {
            // Remove deleted coinflip from the list
            setCoinflips((current) =>
              current.filter((cf) => cf.id !== payload.old.id)
            )
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'coinflips'
          },
          async (payload) => {
            // Remove coinflip if it's no longer open (joined or completed)
            const updated = payload.new as any
            console.log('Coinflip updated via realtime:', {
              id: updated.id,
              status: updated.status,
              oldStatus: (payload.old as any)?.status
            });
            
            if (updated.status !== 'open') {
              console.log('Removing coinflip from lobby:', updated.id);
              setCoinflips((current) =>
                current.filter((cf) => cf.id !== updated.id)
              )
              
              // If status is completed, refresh settled flips
              if (updated.status === 'completed' && user?.id) {
                console.log('Refreshing settled flips for user:', user.id);
                const settled = await getSettledCoinflips(supabase, user.id)
                setSettledCoinflips(settled)
              }
            }
          }
        )
        .subscribe()
    }

    initialize()

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreateCoinflip = () => {
    setIsCreateModalOpen(true)
  }

  const handleJoinCoinflip = (coinflipId: string) => {
    const coinflip = coinflips.find(cf => cf.id === coinflipId)
    setSelectedCoinflip(coinflip)
    setIsJoinModalOpen(true)
  }

  const handleCancelCoinflip = async (coinflipId: string) => {
    try {
      const response = await fetch('/api/coinflip/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coinflipId }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Failed to cancel coinflip:', data.error)
        alert(`Error: ${data.error}`)
        return
      }

      // Success - the real-time subscription will handle removing it from the UI
    } catch (error) {
      console.error('Error cancelling coinflip:', error)
      alert('Failed to cancel coinflip. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent"></div>
              <p className="text-gray-400 mt-4">Loading coinflips...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Coinflip Lobby
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Join an open coinflip or create your own
            </p>
          </motion.div>
          <motion.button
            onClick={handleCreateCoinflip}
            whileHover={buttonAnimation.hover}
            whileTap={buttonAnimation.tap}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors duration-200 shadow-lg hover:shadow-yellow-500/50"
          >
            Create Coinflip
          </motion.button>
        </div>

        {/* Coinflips Grid */}
        <AnimatePresence mode="wait">
          {coinflips.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center"
            >
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </motion.svg>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Open Coinflips
              </h3>
              <p className="text-gray-400 mb-6">
                Be the first to create a coinflip!
              </p>
              <motion.button
                onClick={handleCreateCoinflip}
                whileHover={buttonAnimation.hover}
                whileTap={buttonAnimation.tap}
                className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors duration-200"
              >
                Create Coinflip
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              <AnimatePresence>
                {coinflips.map((coinflip) => (
                  <motion.div
                    key={coinflip.id}
                    variants={listItem}
                    layout
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6 hover:border-yellow-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/20"
                  >
                    {/* Depth Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          coinflip.depth === 'short'
                            ? 'bg-green-500/20 text-green-400'
                            : coinflip.depth === 'medium'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}
                      >
                        {coinflip.depth.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(coinflip.created_at).toLocaleTimeString()}
                      </span>
                    </div>

                    {/* Creator's Prompt */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs mb-1">Creator&apos;s Prompt:</p>
                      <p className="text-white text-sm line-clamp-2">
                        {(coinflip as any).creator_prompt?.text || 'Loading...'}
                      </p>
                    </div>

                    {/* Coin Side */}
                    <div className="mb-6">
                      <p className="text-gray-400 text-sm mb-2">Creator chose:</p>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                          <span className="text-black font-bold text-sm">
                            {coinflip.creator_coin_side === 'heads' ? 'H' : 'T'}
                          </span>
                        </div>
                        <span className="text-white font-semibold capitalize">
                          {coinflip.creator_coin_side}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {currentUserId === coinflip.creator_id ? (
                      <motion.button
                        onClick={() => handleCancelCoinflip(coinflip.id)}
                        whileHover={buttonAnimation.hover}
                        whileTap={buttonAnimation.tap}
                        className="w-full px-4 py-2 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/50"
                      >
                        Cancel
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => handleJoinCoinflip(coinflip.id)}
                        whileHover={buttonAnimation.hover}
                        whileTap={buttonAnimation.tap}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-400 hover:to-green-500 transition-colors duration-200 shadow-lg"
                      >
                        Join Coinflip
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settled Flips Section */}
        {settledCoinflips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Recent Settled Flips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {settledCoinflips.map((coinflip) => (
                <motion.div
                  key={coinflip.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6"
                >
                  {/* Winner Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400">
                      {coinflip.winner_id === currentUserId ? 'You Won! 🎉' : 'You Lost'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(coinflip.completed_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Result */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs mb-2">Result:</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                        <span className="text-black font-bold text-xs">
                          {coinflip.result === 'heads' ? 'H' : 'T'}
                        </span>
                      </div>
                      <span className="text-white font-semibold capitalize">{coinflip.result}</span>
                    </div>
                  </div>

                  {/* Prompts */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        {coinflip.creator_id === currentUserId ? 'Your' : 'Opponent\'s'} Prompt:
                      </p>
                      <p className="text-white text-sm line-clamp-2">
                        {(coinflip as any).creator_prompt?.text || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        {coinflip.joiner_id === currentUserId ? 'Your' : 'Opponent\'s'} Prompt:
                      </p>
                      <p className="text-white text-sm line-clamp-2">
                        {(coinflip as any).joiner_prompt?.text || 'N/A'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <CoinflipModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />
      <CoinflipModal
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false)
          setSelectedCoinflip(undefined)
        }}
        mode="join"
        coinflip={selectedCoinflip}
      />
    </motion.div>
  )
}
