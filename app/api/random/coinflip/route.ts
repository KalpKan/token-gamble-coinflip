import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    // Generate cryptographically secure random number: 0 or 1
    const randomValue = crypto.randomInt(0, 2);
    
    // Map 0 to 'heads' and 1 to 'tails'
    const result = randomValue === 0 ? 'heads' : 'tails';
    
    console.log('Random coinflip generated:', { randomValue, result });
    
    return NextResponse.json({ result }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Error generating random coinflip result:', error);
    return NextResponse.json(
      { error: 'Failed to generate random result' },
      { status: 500 }
    );
  }
}
