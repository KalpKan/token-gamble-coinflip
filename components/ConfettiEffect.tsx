'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface ConfettiEffectProps {
  trigger: boolean;
  duration?: number;
}

export default function ConfettiEffect({ 
  trigger, 
  duration = 3000 
}: ConfettiEffectProps) {
  const [isActive, setIsActive] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update window size for confetti to cover full viewport
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    updateSize();

    // Update on resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle trigger and auto-cleanup
  useEffect(() => {
    if (trigger) {
      setIsActive(true);

      // Auto-cleanup after duration
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!isActive || windowSize.width === 0) {
    return null;
  }

  return (
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={200}
      recycle={false}
      colors={[
        '#ffd700', // Gold
        '#b8860b', // Dark gold
        '#c0c0c0', // Silver
        '#a8a8a8', // Dark silver
        '#00ff88', // Brand green
        '#9333ea', // Brand purple
      ]}
      gravity={0.3}
      wind={0.01}
      initialVelocityY={20}
      tweenDuration={duration}
    />
  );
}
