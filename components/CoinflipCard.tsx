'use client'

import { motion } from 'framer-motion'
import { listItem, buttonAnimation, cardAnimation } from '@/lib/animations'
import type { CoinflipCardProps } from '@/types/components'

export default function CoinflipCard({
  coinflip,
  onJoin,
  onCancel,
  isOwner,
}: CoinflipCardProps) {
  // Depth display configuration
  const depthConfig = {
    short: {
      label: 'Short',
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/20',
      tokens: '~150 tokens',
    },
    medium: {
      label: 'Medium',
      color: 'from-yellow-500 to-orange-600',
      textColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      tokens: '~400 tokens',
    },
    long: {
      label: 'Long',
      color: 'from-red-500 to-pink-600',
      textColor: 'text-red-400',
      bgColor: 'bg-red-500/20',
      tokens: '~800 tokens',
    },
  }

  const config = depthConfig[coinflip.depth]

  // Coin side display
  const coinSideEmoji = coinflip.creator_coin_side === 'heads' ? '👑' : '🦅'
  const coinSideLabel = coinflip.creator_coin_side === 'heads' ? 'Heads' : 'Tails'

  return (
    <motion.div
      variants={listItem}
      whileHover={cardAnimation.hover}
      className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Depth Badge - Prominent Display */}
      <div className="mb-4">
        <div
          className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${config.color} rounded-xl shadow-lg`}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white font-bold text-base sm:text-lg uppercase tracking-wide">
            {config.label}
          </span>
        </div>
        <p className={`mt-2 text-xs sm:text-sm ${config.textColor} font-medium`}>
          {config.tokens}
        </p>
      </div>

      {/* Coin Side Display */}
      <div className="mb-4 sm:mb-6">
        <p className="text-gray-400 text-xs sm:text-sm mb-2">Creator chose:</p>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-3xl sm:text-4xl">{coinSideEmoji}</div>
          <div>
            <p className="text-white font-bold text-lg sm:text-xl">{coinSideLabel}</p>
            <p className="text-gray-500 text-xs">
              You&apos;ll get {coinflip.creator_coin_side === 'heads' ? 'Tails' : 'Heads'}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Line */}
      <div className={`h-1 w-full bg-gradient-to-r ${config.color} rounded-full mb-6 opacity-50`} />

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          <p>Created {new Date(coinflip.created_at).toLocaleDateString()}</p>
          <p className="mt-1">
            {new Date(coinflip.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {isOwner ? (
          <motion.button
            whileHover={buttonAnimation.hover}
            whileTap={buttonAnimation.tap}
            onClick={() => onCancel?.(coinflip.id)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/50 transition-colors duration-200 text-sm sm:text-base"
          >
            Cancel
          </motion.button>
        ) : (
          <motion.button
            whileHover={buttonAnimation.hover}
            whileTap={buttonAnimation.tap}
            onClick={() => onJoin?.(coinflip.id)}
            className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r ${config.color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-colors duration-200 relative overflow-hidden group text-sm sm:text-base`}
          >
            {/* Shine effect on hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Join
            </span>
          </motion.button>
        )}
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full" />
    </motion.div>
  )
}
