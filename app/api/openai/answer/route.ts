import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Map depth to max_tokens for response generation
// Using conservative limits to prevent excessive costs
// GPT-4o-mini pricing: $0.150 per 1M input tokens, $0.600 per 1M output tokens
const DEPTH_TO_TOKENS: Record<string, number> = {
  short: 150,   // ~100-150 words - very cost effective
  medium: 400,  // ~300-400 words - balanced
  long: 800,    // ~600-800 words - maximum allowed
};

// Maximum tokens per request (safety limit)
const MAX_TOKENS_PER_REQUEST = 800;

// Maximum prompt length (to prevent abuse)
const MAX_PROMPT_LENGTH = 2000; // characters

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { promptText, depth, apiKey } = body;

    // Validate required fields
    if (!promptText || typeof promptText !== 'string') {
      return NextResponse.json(
        { error: 'promptText is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate prompt length to prevent abuse
    if (promptText.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt is too long. Maximum ${MAX_PROMPT_LENGTH} characters allowed.` },
        { status: 400 }
      );
    }

    // Trim and validate prompt is not empty
    const trimmedPrompt = promptText.trim();
    if (trimmedPrompt.length === 0) {
      return NextResponse.json(
        { error: 'Prompt cannot be empty' },
        { status: 400 }
      );
    }

    if (!depth || !DEPTH_TO_TOKENS[depth]) {
      return NextResponse.json(
        { error: 'depth is required and must be one of: short, medium, long' },
        { status: 400 }
      );
    }

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'apiKey is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate API key format (OpenAI keys start with 'sk-')
    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 400 }
      );
    }

    // Get max_tokens for the selected depth
    const maxTokens = Math.min(DEPTH_TO_TOKENS[depth], MAX_TOKENS_PER_REQUEST);

    // Initialize OpenAI client with the provided API key
    const openai = new OpenAI({
      apiKey: apiKey,
      timeout: 30000, // 30 second timeout to prevent hanging requests
      maxRetries: 2,  // Retry failed requests up to 2 times
    });

    // Construct the API call with appropriate parameters
    // Using gpt-4o-mini: Most cost-effective model
    // Pricing: $0.150/1M input tokens, $0.600/1M output tokens
    // This is ~15x cheaper than GPT-4 and ~3x cheaper than GPT-3.5-turbo
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Updated to use GPT-4o-mini (most cost-effective)
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant. Provide a clear, concise response within ${maxTokens} tokens. Be direct and informative.`,
        },
        {
          role: 'user',
          content: trimmedPrompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      // Additional safety parameters
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      // Stop sequences to prevent runaway generation
      stop: null,
    });

    // Extract response text and tokens used
    const responseText = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || 0;
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;

    // Calculate approximate cost (for logging/monitoring)
    // GPT-4o-mini pricing: $0.150/1M input, $0.600/1M output
    const estimatedCost = (inputTokens * 0.150 / 1000000) + (outputTokens * 0.600 / 1000000);

    // Log usage for monitoring (helps track costs)
    console.log(`OpenAI API Call - Model: gpt-4o-mini, Tokens: ${tokensUsed} (in: ${inputTokens}, out: ${outputTokens}), Est. Cost: $${estimatedCost.toFixed(6)}`);

    // Validate response
    if (!responseText || responseText.trim().length === 0) {
      return NextResponse.json(
        { error: 'OpenAI returned an empty response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      answer: responseText,
      tokensUsed: tokensUsed,
      model: 'gpt-4o-mini',
      estimatedCost: estimatedCost,
    });
  } catch (error: any) {
    // Handle OpenAI API errors with specific error messages
    console.error('OpenAI API error:', error);

    // Invalid API key
    if (error?.status === 401 || error?.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Rate limit exceeded
    if (error?.status === 429 || error?.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'Rate limit exceeded, try again later' },
        { status: 429 }
      );
    }

    // Timeout errors
    if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }

    // Insufficient quota
    if (error?.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Insufficient quota on API key' },
        { status: 402 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: error?.message || 'An error occurred while processing your request' },
      { status: error?.status || 500 }
    );
  }
}
