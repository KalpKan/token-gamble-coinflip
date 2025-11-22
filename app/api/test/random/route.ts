import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  // Generate 100 random flips to test distribution
  const results = {
    heads: 0,
    tails: 0,
    samples: [] as Array<{ value: number; result: string }>
  };

  for (let i = 0; i < 100; i++) {
    const randomValue = crypto.randomInt(0, 2);
    const result = randomValue === 0 ? 'heads' : 'tails';
    
    results.samples.push({ value: randomValue, result });
    
    if (result === 'heads') {
      results.heads++;
    } else {
      results.tails++;
    }
  }

  return NextResponse.json({
    distribution: {
      heads: results.heads,
      tails: results.tails,
      headsPercentage: (results.heads / 100) * 100,
      tailsPercentage: (results.tails / 100) * 100
    },
    first10Samples: results.samples.slice(0, 10),
    last10Samples: results.samples.slice(-10),
    message: 'This endpoint tests the random generation. A fair coin should show ~50% heads and ~50% tails.'
  });
}
