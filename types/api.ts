// API request and response type definitions

import { Coinflip, ResponseDepth, CoinSide } from './database';

// Coinflip API types
export interface CreateCoinflipRequest {
  promptId: string;
  depth: ResponseDepth;
  coinSide: CoinSide;
}

export interface CreateCoinflipResponse {
  coinflipId: string;
}

export interface JoinCoinflipRequest {
  coinflipId: string;
  promptId: string;
}

export interface CoinflipResult {
  coinflip: Coinflip;
  isWinner: boolean;
  answer?: string;
}

export interface JoinCoinflipResponse {
  success: boolean;
  result: CoinflipResult;
}

export interface CancelCoinflipRequest {
  coinflipId: string;
}

export interface CancelCoinflipResponse {
  success: boolean;
}

// OpenAI API types
export interface OpenAIAnswerRequest {
  promptText: string;
  depth: ResponseDepth;
  apiKey: string;
}

export interface OpenAIAnswerResponse {
  answer: string;
  tokensUsed: number;
}

// Random coinflip API types
export interface RandomCoinflipResponse {
  result: CoinSide;
}

// Error response type
export interface ApiErrorResponse {
  error: string;
  message: string;
}
