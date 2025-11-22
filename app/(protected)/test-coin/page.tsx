'use client';

import { useState } from 'react';
import CoinAnimation from '@/components/CoinAnimation';
import type { CoinSide } from '@/types/database';

export default function TestCoinPage() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [result, setResult] = useState<CoinSide>('heads');

  const handleTest = (side: CoinSide) => {
    setResult(side);
    setShowAnimation(true);
  };

  const handleComplete = () => {
    setShowAnimation(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Coin Animation Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <p className="text-white mb-4">Test the coin animation with different results:</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleTest('heads')}
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400"
            >
              Test HEADS (Crown 👑)
            </button>
            <button
              onClick={() => handleTest('tails')}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400"
            >
              Test TAILS (Eagle 🦅)
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Expected Behavior:</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• HEADS button → Coin should land on crown side (gold)</li>
            <li>• TAILS button → Coin should land on eagle side (silver)</li>
            <li>• Animation lasts 3 seconds</li>
            <li>• Check browser console for rotation values</li>
          </ul>
        </div>

        <div className="mt-6 bg-blue-900 rounded-lg p-4">
          <p className="text-blue-200 text-sm">
            <strong>Debug Info:</strong> Open browser console (F12) to see rotation calculations.
            <br />
            • HEADS should show finalRotation: 0, totalRotation: 1800
            <br />
            • TAILS should show finalRotation: 180, totalRotation: 1980
          </p>
        </div>
      </div>

      {showAnimation && (
        <CoinAnimation
          result={result}
          onComplete={handleComplete}
          duration={3000}
        />
      )}
    </div>
  );
}
