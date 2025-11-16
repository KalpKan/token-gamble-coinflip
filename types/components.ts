// Component prop interface definitions

import { Coinflip, Prompt, CoinSide, ResponseDepth } from './database';

// CoinflipCard component props
export interface CoinflipCardProps {
  coinflip: Coinflip;
  onJoin?: (coinflipId: string) => void;
  onCancel?: (coinflipId: string) => void;
  isOwner: boolean;
}

// CoinflipModal component props
export interface CoinflipModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'join';
  coinflip?: Coinflip;
}

// CoinAnimation component props
export interface CoinAnimationProps {
  result: CoinSide;
  onComplete: () => void;
  duration?: number;
}

// ConfettiEffect component props
export interface ConfettiEffectProps {
  trigger: boolean;
  duration?: number;
}

// PromptCard component props
export interface PromptCardProps {
  prompt: Prompt;
  onEdit?: (promptId: string) => void;
  onDelete?: (promptId: string) => void;
  isLocked: boolean;
  showResponse?: boolean;
}

// PromptForm component props
export interface PromptFormProps {
  onSubmit: (text: string) => void;
  initialValue?: string;
  mode: 'create' | 'edit';
}

// CoinflipResult component props
export interface CoinflipResultProps {
  isWinner: boolean;
  answer?: string;
}

// AuthForm component props
export interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (email: string, password: string) => void;
  error?: string;
  loading?: boolean;
}

// Navigation component props
export interface NavigationProps {
  currentPath?: string;
  onLogout?: () => void;
}

// LoadingSpinner component props
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// ErrorMessage component props
export interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

// Toast component props
export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}
