'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { listItem, buttonAnimation, fadeIn } from '@/lib/animations'
import type { PromptCardProps } from '@/types/components'

export default function PromptCard({
  prompt,
  onEdit,
  onDelete,
  isLocked,
  showResponse = false,
}: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Truncate long prompts (over 200 characters)
  const shouldTruncate = prompt.text.length > 200
  const displayText = shouldTruncate && !isExpanded 
    ? prompt.text.slice(0, 200) + '...' 
    : prompt.text

  // Truncate long responses (over 300 characters)
  const shouldTruncateResponse = prompt.response && prompt.response.length > 300
  const displayResponse = shouldTruncateResponse && !isExpanded
    ? prompt.response!.slice(0, 300) + '...'
    : prompt.response

  const isSettled = prompt.status === 'settled'
  const canEdit = !isLocked && !isSettled && onEdit
  const canDelete = !isLocked && !isSettled && onDelete

  return (
    <motion.div
      variants={listItem}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 hover:shadow-xl transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        {/* Prompt Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-base sm:text-lg leading-relaxed break-words">
            {displayText}
          </p>
          
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm text-yellow-500 hover:text-yellow-400 transition-colors duration-200"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {/* Lock Badge */}
          {isLocked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Locked in coinflip
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        {(canEdit || canDelete) && (
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            {canEdit && (
              <motion.button
                whileHover={isLocked ? {} : buttonAnimation.hover}
                whileTap={isLocked ? {} : buttonAnimation.tap}
                onClick={() => onEdit(prompt.id)}
                disabled={isLocked}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                  isLocked
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-700'
                }`}
                title={isLocked ? 'Cannot edit locked prompt' : 'Edit prompt'}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </motion.button>
            )}
            
            {canDelete && (
              <motion.button
                whileHover={isLocked ? {} : buttonAnimation.hover}
                whileTap={isLocked ? {} : buttonAnimation.tap}
                onClick={() => onDelete(prompt.id)}
                disabled={isLocked}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                  isLocked
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-700'
                }`}
                title={isLocked ? 'Cannot delete locked prompt' : 'Delete prompt'}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Response Section (for settled prompts) */}
      {showResponse && isSettled && prompt.response && (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mt-4 pt-4 border-t border-gray-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-green-400 uppercase tracking-wide">
              Answer
            </span>
            {prompt.response_depth && (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                {prompt.response_depth}
              </span>
            )}
            {prompt.tokens_used && (
              <span className="text-xs text-gray-500">
                • {prompt.tokens_used} tokens used
              </span>
            )}
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {displayResponse}
            </p>
            
            {shouldTruncateResponse && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 text-sm text-green-400 hover:text-green-300 transition-colors duration-200"
              >
                {isExpanded ? 'Show less' : 'Show full response'}
              </button>
            )}
          </div>

          {prompt.settled_at && (
            <p className="text-xs text-gray-500 mt-3">
              Settled on {new Date(prompt.settled_at).toLocaleDateString()} at{' '}
              {new Date(prompt.settled_at).toLocaleTimeString()}
            </p>
          )}
        </motion.div>
      )}

      {/* Metadata Footer */}
      <div className="mt-4 pt-3 border-t border-gray-700/50 flex items-center justify-between text-xs text-gray-500">
        <span>
          Created {new Date(prompt.created_at).toLocaleDateString()}
        </span>
        {prompt.status === 'settled' && (
          <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full font-semibold">
            Settled
          </span>
        )}
      </div>
    </motion.div>
  )
}
