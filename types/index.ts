// Central export file for all type definitions

// Database types
export type {
  User,
  Prompt,
  Coinflip,
  PromptStatus,
  ResponseDepth,
  CoinSide,
  CoinflipStatus,
} from './database';

// API types
export type {
  CreateCoinflipRequest,
  CreateCoinflipResponse,
  JoinCoinflipRequest,
  CoinflipResult,
  JoinCoinflipResponse,
  CancelCoinflipRequest,
  CancelCoinflipResponse,
  OpenAIAnswerRequest,
  OpenAIAnswerResponse,
  RandomCoinflipResponse,
  ApiErrorResponse,
} from './api';

// Component types
export type {
  CoinflipCardProps,
  CoinflipModalProps,
  CoinAnimationProps,
  ConfettiEffectProps,
  PromptCardProps,
  PromptFormProps,
  CoinflipResultProps,
  AuthFormProps,
  NavigationProps,
  LoadingSpinnerProps,
  ErrorMessageProps,
  ToastProps,
} from './components';
