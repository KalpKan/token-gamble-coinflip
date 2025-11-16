# Token Gamble - Coinflip for API Tokens

A Next.js web application that gamifies OpenAI API usage through an animated coinflip system.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Supabase (Auth, Database, Real-time)
- **External API**: OpenAI API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key (for users)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your Supabase URL and anon key:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components (to be created)
├── lib/                 # Utility functions and configurations (to be created)
├── types/               # TypeScript type definitions (to be created)
├── .env.local          # Environment variables (not in git)
├── .env.example        # Environment variables template
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── next.config.mjs     # Next.js configuration
```

## Features (To Be Implemented)

- User authentication with Supabase
- Prompt management (create, edit, delete)
- Coinflip creation and joining
- Real-time lobby updates
- Animated coin flip with 3D effects
- Winner celebration with confetti
- OpenAI API integration for answering prompts
- Responsive design for all devices

## License

MIT
