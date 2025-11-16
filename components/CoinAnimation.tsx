'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import type { CoinSide } from '@/types/database';

interface CoinAnimationProps {
  result: CoinSide;
  onComplete: () => void;
  duration?: number;
}

export default function CoinAnimation({ 
  result, 
  onComplete, 
  duration = 3000 
}: CoinAnimationProps) {
  const flipDuration = 2.5; // seconds for main flip
  const slowDownDuration = 0.5; // seconds to slow down to result

  useEffect(() => {
    // Call onComplete after total animation duration
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // Calculate final rotation based on result
  // heads = 0 degrees (front face), tails = 180 degrees (back face)
  const finalRotation = result === 'heads' ? 0 : 180;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8">
        {/* Coin container with perspective */}
        <div className="relative" style={{ perspective: '1000px' }}>
          <motion.div
            className="relative w-48 h-48 md:w-64 md:h-64"
            style={{ transformStyle: 'preserve-3d' }}
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: [0, 1800 + finalRotation], // 5 full rotations + final position
            }}
            transition={{
              duration: flipDuration + slowDownDuration,
              times: [0, 1],
              ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for realistic flip
            }}
          >
            {/* Heads side */}
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
                boxShadow: '0 10px 40px rgba(255, 215, 0, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.3), inset 0 -2px 10px rgba(0, 0, 0, 0.2)',
                border: '4px solid #b8860b',
              }}
            >
              <div className="text-6xl md:text-7xl">👑</div>
            </div>

            {/* Tails side */}
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)',
                boxShadow: '0 10px 40px rgba(192, 192, 192, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.3), inset 0 -2px 10px rgba(0, 0, 0, 0.2)',
                border: '4px solid #808080',
              }}
            >
              <div className="text-6xl md:text-7xl">🦅</div>
            </div>

            {/* Coin edge (visible during flip) */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                transform: 'rotateY(90deg)',
                background: 'linear-gradient(to bottom, #333333 0%, #666666 50%, #333333 100%)',
                width: '8px',
                left: '50%',
                marginLeft: '-4px',
              }}
            />
          </motion.div>
        </div>

        {/* Flipping text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: flipDuration + slowDownDuration,
            times: [0, 0.1, 0.8, 1],
          }}
          className="text-2xl md:text-3xl font-bold text-white"
        >
          Flipping...
        </motion.div>

        {/* Result text - appears at the end */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0, 1], scale: [0.8, 0.8, 1.2] }}
          transition={{
            duration: flipDuration + slowDownDuration,
            times: [0, 0.85, 1],
            ease: 'easeOut',
          }}
          className="text-3xl md:text-4xl font-bold text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]"
        >
          {result.toUpperCase()}!
        </motion.div>
      </div>
    </div>
  );
}
