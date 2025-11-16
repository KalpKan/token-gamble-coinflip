'use client';

import { useState } from 'react';
import CoinAnimation from '@/components/CoinAnimation';
import type { CoinSide } from '@/types/database';

export default function CoinDemoPage() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [result, setResult] = useState<CoinSide>('heads');
  const [animationComplete, setAnimationComplete] = useState(false);

  const startAnimation = (selectedResult: CoinSide) => {
    setResult(selectedResult);
    setAnimationComplete(false);
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
    // Auto-hide after 2 seconds to allow viewing the result
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Coin Animation Demo
          </h1>
          <p className="text-gray-400 mb-8">
            Test the coin flip animation from the joiner&apos;s perspective
          </p>

          <div className="space-y-6">
            {/* Demo Controls */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                Test Animation
              </h2>
              <p className="text-gray-400 mb-4">
                Click a button to see the coin flip animation with the selected result:
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => startAnimation('heads')}
                  disabled={showAnimation}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-500 text-black font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed border border-yellow-700"
                >
                  Test HEADS 👑
                </button>
                <button
                  onClick={() => startAnimation('tails')}
                  disabled={showAnimation}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed border border-gray-600"
                >
                  Test TAILS 🦅
                </button>
              </div>
            </div>

            {/* Animation Info */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                Animation Details
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>5 full rotations over 2.5 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Slows down to final result over 0.5 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>3D coin with heads (👑) and tails (🦅) sides</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Result displayed clearly at the end</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>onComplete callback fires when animation finishes</span>
                </li>
              </ul>
            </div>

            {/* Joiner Perspective Simulation */}
            <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                Joiner&apos;s Perspective
              </h2>
              <p className="text-gray-300 mb-4">
                This simulates what a player sees when they join a coinflip:
              </p>
              <ol className="space-y-2 text-gray-300 list-decimal list-inside">
                <li>Player clicks &quot;Join&quot; on a coinflip in the lobby</li>
                <li>The coin animation starts immediately</li>
                <li>The coin flips dramatically for 3 seconds</li>
                <li>The result is revealed (heads or tails)</li>
                <li>After viewing the result, the player sees the outcome screen</li>
              </ol>
            </div>

            {/* Status */}
            {showAnimation && (
              <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-700">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Animation Status
                </h2>
                <p className="text-gray-300">
                  {animationComplete 
                    ? '✓ Animation complete! Closing in 2 seconds...' 
                    : '⏳ Animation in progress...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coin Animation Overlay */}
      {showAnimation && (
        <CoinAnimation
          result={result}
          onComplete={handleAnimationComplete}
        />
      )}
    </div>
  );
}
