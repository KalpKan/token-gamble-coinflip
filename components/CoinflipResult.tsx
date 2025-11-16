'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfettiEffect from './ConfettiEffect';

interface CoinflipResultProps {
  isWinner: boolean;
  answer?: string;
}

export default function CoinflipResult({ isWinner, answer }: CoinflipResultProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewInPrompts = () => {
    router.push('/prompts?tab=settled');
  };

  return (
    <>
      {/* Confetti effect for winners only */}
      {isWinner && <ConfettiEffect trigger={true} duration={3000} />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl ${
            isWinner
              ? 'bg-gradient-to-br from-green-900 to-green-800 border-2 border-green-500'
              : 'bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-500'
          }`}
        >
          {/* Result Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: 'spring', bounce: 0.5 }}
            className="text-center mb-6"
          >
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 ${
                isWinner ? 'text-green-100' : 'text-red-100'
              }`}
            >
              {isWinner ? '🎉 YOU WIN! 🎉' : '😔 YOU LOSE'}
            </h2>
            <p className="text-base sm:text-lg text-white/80">
              {isWinner
                ? 'Congratulations! Your prompt has been answered!'
                : 'Better luck next time. Your prompt has been unlocked.'}
            </p>
          </motion.div>

          {/* Answer Section - Only for winners */}
          {isWinner && answer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-6"
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors rounded-lg p-4 mb-2"
              >
                <span className="text-white font-semibold">
                  {isExpanded ? '▼' : '▶'} View Answer
                </span>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 rounded-lg p-4 max-h-48 sm:max-h-64 overflow-y-auto"
                >
                  <p className="text-sm sm:text-base text-white whitespace-pre-wrap">{answer}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {isWinner && (
              <button
                onClick={handleViewInPrompts}
                className="flex-1 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                View in Prompts
              </button>
            )}
            <button
              onClick={() => router.push('/lobby')}
              className={`flex-1 font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base ${
                isWinner
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Back to Lobby
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
