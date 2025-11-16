// Database type definitions for Token Gamble

export interface User {
  id: string;
  email: string;
  openai_api_key?: string;
  created_at: string;
}

export interface Prompt {
  id: string;
  user_id: string;
  text: string;
  status: 'loaded' | 'locked' | 'settled';
  response?: string;
  response_depth?: 'short' | 'medium' | 'long';
  tokens_used?: number;
  created_at: string;
  settled_at?: string;
}

export interface Coinflip {
  id: string;
  creator_id: string;
  creator_prompt_id: string;
  creator_coin_side: 'heads' | 'tails';
  joiner_id?: string;
  joiner_prompt_id?: string;
  depth: 'short' | 'medium' | 'long';
  status: 'open' | 'active' | 'completed';
  result?: 'heads' | 'tails';
  winner_id?: string;
  created_at: string;
  completed_at?: string;
}

// Type aliases for common use cases
export type PromptStatus = Prompt['status'];
export type ResponseDepth = 'short' | 'medium' | 'long';
export type CoinSide = 'heads' | 'tails';
export type CoinflipStatus = Coinflip['status'];

// Supabase Database type structure
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      prompts: {
        Row: Prompt;
        Insert: Omit<Prompt, 'id' | 'created_at'>;
        Update: Partial<Omit<Prompt, 'id'>>;
      };
      coinflips: {
        Row: Coinflip;
        Insert: Omit<Coinflip, 'id' | 'created_at'>;
        Update: Partial<Omit<Coinflip, 'id'>>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
