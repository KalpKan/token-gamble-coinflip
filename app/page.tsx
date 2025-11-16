export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-casino-dark">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gold-gradient bg-clip-text text-transparent">
          Token Gamble
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8">
          Coinflip for API Tokens
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-casino-gold hover:bg-casino-goldDark text-casino-dark font-semibold rounded-lg transition-colors text-center"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-6 py-3 bg-casino-card hover:bg-casino-cardHover text-white font-semibold rounded-lg transition-colors text-center"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
