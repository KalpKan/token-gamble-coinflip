# Design Document

## Overview

Token Gamble is a Next.js web application that enables users to wager OpenAI API usage through an animated coinflip system. The application uses Supabase for authentication, real-time data synchronization, and storage. The frontend leverages React with Framer Motion for smooth animations and Tailwind CSS for styling. The architecture follows a client-server model where the Next.js API routes handle secure operations like OpenAI API calls, while the client handles UI interactions and real-time updates.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js + React + Framer Motion + Tailwind CSS)           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth UI    │  │  Lobby UI    │  │  Prompts UI  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Supabase Client (Real-time + Auth)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ /api/coinflip│  │ /api/openai  │  │ /api/random  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│                                                              │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │    Supabase      │              │   OpenAI API     │    │
│  │  - Auth          │              │                  │    │
│  │  - Database      │              │                  │    │
│  │  - Real-time     │              │                  │    │
│  └──────────────────┘              └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Animation Library**: Framer Motion
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **External API**: OpenAI API
- **Deployment**: Vercel

### Key Architectural Decisions

1. **Next.js API Routes for Sensitive Operations**: OpenAI API calls are made server-side to avoid exposing API keys in client code, even though security is not critical for this MVP
2. **Supabase Real-time for Lobby Updates**: Leverages Supabase's built-in real-time subscriptions to automatically sync lobby state across multiple browser sessions
3. **Client-side State Management**: Uses React hooks and context for local state, with Supabase handling persistence
4. **Optimistic UI Updates**: UI updates immediately on user actions, with Supabase syncing in the background

## Components and Interfaces

### Page Components

#### 1. Authentication Pages (`/login`, `/signup`)
- **Purpose**: Handle user registration and login
- **Key Features**:
  - Email/password authentication forms
  - Integration with Supabase Auth
  - Redirect to lobby after successful auth
  - Form validation and error display

#### 2. Lobby Page (`/lobby`)
- **Purpose**: Main hub for viewing and creating coinflips
- **Key Features**:
  - Grid display of open coinflips
  - "Create Coinflip" button
  - Real-time updates via Supabase subscription
  - Filter/sort options for coinflips
  - Navigation to prompts page

#### 3. Prompts Page (`/prompts`)
- **Purpose**: Manage loaded and settled prompts
- **Key Features**:
  - Tabbed interface (Loaded / Settled)
  - Add new prompt form
  - List of prompts with edit/delete actions
  - Display of answered prompts with responses
  - Locked prompt indicators

#### 4. Profile Page (`/profile`)
- **Purpose**: Manage user settings and API key
- **Key Features**:
  - API key input field
  - Save/update functionality
  - User information display
  - Logout button

### UI Components

#### CoinflipCard
```typescript
interface CoinflipCardProps {
  coinflip: Coinflip;
  onJoin?: (coinflipId: string) => void;
  onCancel?: (coinflipId: string) => void;
  isOwner: boolean;
}
```
- Displays coinflip information (depth, coin side, creator)
- Shows join button for non-owners or cancel button for owners
- Animated entrance/exit

#### CoinflipModal
```typescript
interface CoinflipModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'join';
  coinflip?: Coinflip;
}
```
- Modal for creating or joining coinflips
- Prompt selection dropdown
- Depth selection (short/medium/long)
- Coin side selection (create mode only)
- Confirmation button

#### CoinAnimation
```typescript
interface CoinAnimationProps {
  result: 'heads' | 'tails';
  onComplete: () => void;
  duration?: number;
}
```
- 3D coin flip animation using Framer Motion
- Configurable duration (default 3 seconds)
- Callback when animation completes
- Realistic physics simulation

#### ConfettiEffect
```typescript
interface ConfettiEffectProps {
  trigger: boolean;
  duration?: number;
}
```
- Confetti particle animation for winners
- Auto-cleanup after duration
- Uses canvas or CSS animations

#### PromptCard
```typescript
interface PromptCardProps {
  prompt: Prompt;
  onEdit?: (promptId: string) => void;
  onDelete?: (promptId: string) => void;
  isLocked: boolean;
  showResponse?: boolean;
}
```
- Displays prompt text and metadata
- Edit/delete buttons (if not locked)
- Response display for settled prompts
- Lock indicator for prompts in active coinflips

#### PromptForm
```typescript
interface PromptFormProps {
  onSubmit: (text: string) => void;
  initialValue?: string;
  mode: 'create' | 'edit';
}
```
- Textarea for prompt input
- Character count display
- Submit button with loading state
- Validation feedback

### API Routes

#### `/api/coinflip/create`
- **Method**: POST
- **Body**: `{ promptId: string, depth: string, coinSide: string }`
- **Response**: `{ coinflipId: string }`
- **Logic**: Creates coinflip record in Supabase, marks prompt as locked

#### `/api/coinflip/join`
- **Method**: POST
- **Body**: `{ coinflipId: string, promptId: string }`
- **Response**: `{ success: boolean, result: CoinflipResult }`
- **Logic**: 
  1. Updates coinflip with joiner info
  2. Generates random result (heads/tails)
  3. Determines winner
  4. Triggers OpenAI API call
  5. Returns result

#### `/api/coinflip/cancel`
- **Method**: POST
- **Body**: `{ coinflipId: string }`
- **Response**: `{ success: boolean }`
- **Logic**: Deletes coinflip, unlocks prompt

#### `/api/openai/answer`
- **Method**: POST
- **Body**: `{ promptText: string, depth: string, apiKey: string }`
- **Response**: `{ answer: string, tokensUsed: number }`
- **Logic**:
  1. Validates API key format
  2. Constructs OpenAI API call with depth-based max_tokens
  3. Makes API request
  4. Returns response and token count
  5. Handles errors gracefully

#### `/api/random/coinflip`
- **Method**: GET
- **Response**: `{ result: 'heads' | 'tails' }`
- **Logic**: Generates cryptographically random result using Node.js crypto module

## Data Models

### Supabase Database Schema

#### users table (managed by Supabase Auth)
```sql
-- Extended with custom fields
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  openai_api_key TEXT -- Stored in plain text (MVP only)
);
```

#### prompts table
```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('loaded', 'locked', 'settled')),
  response TEXT, -- NULL until answered
  response_depth TEXT CHECK (response_depth IN ('short', 'medium', 'long')),
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  settled_at TIMESTAMP
);

CREATE INDEX idx_prompts_user_status ON prompts(user_id, status);
```

#### coinflips table
```sql
CREATE TABLE coinflips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  creator_coin_side TEXT NOT NULL CHECK (creator_coin_side IN ('heads', 'tails')),
  joiner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joiner_prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  depth TEXT NOT NULL CHECK (depth IN ('short', 'medium', 'long')),
  status TEXT NOT NULL CHECK (status IN ('open', 'active', 'completed')),
  result TEXT CHECK (result IN ('heads', 'tails')),
  winner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_coinflips_status ON coinflips(status);
CREATE INDEX idx_coinflips_creator ON coinflips(creator_id);
```

### TypeScript Interfaces

```typescript
interface User {
  id: string;
  email: string;
  openai_api_key?: string;
  created_at: string;
}

interface Prompt {
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

interface Coinflip {
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

interface CoinflipResult {
  coinflip: Coinflip;
  isWinner: boolean;
  answer?: string;
}
```

## Error Handling

### Client-Side Error Handling

1. **Network Errors**: Display toast notifications for failed API calls
2. **Validation Errors**: Inline form validation with error messages
3. **Authentication Errors**: Redirect to login with error message
4. **Real-time Connection Errors**: Show reconnection indicator

### Server-Side Error Handling

1. **OpenAI API Errors**:
   - Invalid API key: Return 401 with message "Invalid API key"
   - Rate limit: Return 429 with message "Rate limit exceeded, try again later"
   - Timeout: Return 504 with message "Request timeout"
   - Other errors: Return 500 with generic message

2. **Database Errors**:
   - Constraint violations: Return 400 with specific message
   - Connection errors: Return 503 with message "Service temporarily unavailable"

3. **Authorization Errors**:
   - Unauthorized actions: Return 403 with message "Not authorized"

### Error Recovery Strategies

1. **Failed Coinflip**: Unlock both prompts, allow users to retry
2. **Failed API Call**: Store error in database, notify both users
3. **Lost Real-time Connection**: Auto-reconnect with exponential backoff
4. **Partial State Updates**: Use database transactions to ensure consistency

## Testing Strategy

### Unit Testing

**Tools**: Jest + React Testing Library

**Coverage Areas**:
1. **Utility Functions**:
   - Token depth to max_tokens conversion
   - Coin flip result determination
   - Prompt validation

2. **React Components**:
   - CoinflipCard rendering with different props
   - PromptForm validation logic
   - Modal open/close behavior

3. **API Route Handlers**:
   - Request validation
   - Error handling paths
   - Response formatting

### Integration Testing

**Tools**: Playwright or Cypress

**Test Scenarios**:
1. **Complete Coinflip Flow**:
   - User A creates coinflip
   - User B joins coinflip
   - Coin flips and winner determined
   - Winner sees response in settled tab

2. **Prompt Management**:
   - Create multiple prompts
   - Edit prompt text
   - Delete unused prompt
   - Verify locked prompt cannot be deleted

3. **Real-time Updates**:
   - Create coinflip in one browser
   - Verify it appears in another browser's lobby
   - Join coinflip and verify it disappears from lobby

### Manual Testing Checklist

1. **Authentication Flow**:
   - [ ] Sign up new user
   - [ ] Log in existing user
   - [ ] Save API key to profile
   - [ ] Log out and log back in

2. **Prompt Management**:
   - [ ] Create new prompt
   - [ ] Edit prompt text
   - [ ] Delete prompt
   - [ ] Verify settled prompts cannot be edited

3. **Coinflip Creation**:
   - [ ] Create coinflip with each depth level
   - [ ] Verify coinflip appears in lobby
   - [ ] Cancel own coinflip
   - [ ] Verify cancelled coinflip disappears

4. **Coinflip Joining**:
   - [ ] Join coinflip from lobby
   - [ ] Verify coin animation plays
   - [ ] Verify winner sees confetti
   - [ ] Verify loser does not see confetti
   - [ ] Verify winner's prompt moves to settled tab

5. **API Integration**:
   - [ ] Test with valid API key
   - [ ] Test with invalid API key
   - [ ] Verify response matches selected depth
   - [ ] Verify loser's API key was used

6. **Animations**:
   - [ ] Coin flip animation is smooth
   - [ ] Confetti animation plays for winner
   - [ ] Page transitions are smooth
   - [ ] Button hover effects work

7. **Responsive Design**:
   - [ ] Test on desktop (1920x1080)
   - [ ] Test on tablet (768x1024)
   - [ ] Test on mobile (375x667)

8. **Multi-User Demo**:
   - [ ] Open two browser windows
   - [ ] Log in as different users
   - [ ] Create coinflip in window 1
   - [ ] Verify it appears in window 2
   - [ ] Join from window 2
   - [ ] Verify both see coin flip
   - [ ] Verify winner/loser states are correct

## Animation Specifications

### Coin Flip Animation

**Implementation**: Framer Motion with 3D transforms

**Sequence**:
1. Initial state: Coin shows creator's chosen side
2. Flip phase (2.5s): Coin rotates on Y-axis with easing
3. Slow down phase (0.5s): Rotation decelerates
4. Final state: Coin shows result side

**CSS/Motion Values**:
```typescript
const coinFlipVariants = {
  initial: { rotateY: 0 },
  flipping: {
    rotateY: 1800, // 5 full rotations
    transition: {
      duration: 2.5,
      ease: "easeInOut"
    }
  },
  result: {
    rotateY: result === 'heads' ? 0 : 180,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};
```

### Confetti Animation

**Implementation**: Canvas-based particle system or react-confetti library

**Specifications**:
- Duration: 3 seconds
- Particle count: 150-200
- Colors: Gold, silver, primary brand colors
- Physics: Gravity + random horizontal drift
- Auto-cleanup after completion

### Page Transitions

**Implementation**: Framer Motion layout animations

**Specifications**:
- Fade + slide transitions (200ms)
- Shared element transitions for modals
- Stagger animations for lists (50ms delay between items)

### Button Interactions

**Hover Effects**:
- Scale: 1.05
- Transition: 150ms ease-out
- Shadow increase

**Click Effects**:
- Scale: 0.95
- Transition: 100ms ease-in

## Deployment Configuration

### Vercel Deployment

**Environment Variables**:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

**Build Settings**:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Supabase Configuration

**Row Level Security (RLS) Policies**:

```sql
-- Users can only read their own API key
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can manage their own prompts
CREATE POLICY "Users can manage own prompts"
  ON prompts FOR ALL
  USING (auth.uid() = user_id);

-- Users can read all open coinflips
CREATE POLICY "Users can read open coinflips"
  ON coinflips FOR SELECT
  USING (status = 'open' OR creator_id = auth.uid() OR joiner_id = auth.uid());

-- Users can create coinflips
CREATE POLICY "Users can create coinflips"
  ON coinflips FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Users can update coinflips they're part of
CREATE POLICY "Users can update own coinflips"
  ON coinflips FOR UPDATE
  USING (creator_id = auth.uid() OR joiner_id = auth.uid());
```

**Real-time Configuration**:
Enable real-time for `coinflips` table to broadcast INSERT, UPDATE, DELETE events.

## Security Considerations (MVP Scope)

While security is not critical for this hackathon MVP, basic measures include:

1. **API Keys**: Stored in Supabase (plain text acceptable for MVP)
2. **Authentication**: Handled by Supabase Auth
3. **RLS Policies**: Prevent users from accessing others' data
4. **API Routes**: Server-side execution prevents client-side key exposure
5. **Input Validation**: Basic sanitization of user inputs

**Note**: For production use, API keys should be encrypted at rest and additional security measures implemented.

## Performance Optimizations

1. **Database Indexing**: Indexes on frequently queried columns (user_id, status)
2. **Real-time Subscriptions**: Only subscribe to open coinflips, not all data
3. **Image Optimization**: Use Next.js Image component for any images
4. **Code Splitting**: Automatic with Next.js App Router
5. **Caching**: Leverage Vercel's edge caching for static assets

## Future Enhancements (Out of Scope for MVP)

1. Leaderboard showing most wins
2. Prompt templates library
3. Multiple coin flip types (best of 3, etc.)
4. Chat between coinflip participants
5. Spectator mode for watching coinflips
6. Token usage analytics dashboard
7. Support for other AI providers (Anthropic, etc.)
