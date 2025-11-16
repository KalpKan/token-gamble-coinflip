import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Gambling aesthetic colors
        casino: {
          dark: "#0a0e1a",
          darker: "#050810",
          card: "#1a1f35",
          cardHover: "#252b45",
          gold: "#ffd700",
          goldDark: "#b8860b",
          green: "#00ff88",
          greenDark: "#00cc6a",
          red: "#ff3366",
          redDark: "#cc2952",
          purple: "#9333ea",
          purpleDark: "#7928ca",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "casino-gradient": "linear-gradient(135deg, #1a1f35 0%, #0a0e1a 100%)",
        "gold-gradient": "linear-gradient(135deg, #ffd700 0%, #b8860b 100%)",
        "green-gradient": "linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)",
      },
      boxShadow: {
        "casino": "0 4px 20px rgba(255, 215, 0, 0.15)",
        "casino-hover": "0 8px 30px rgba(255, 215, 0, 0.25)",
        "glow-gold": "0 0 20px rgba(255, 215, 0, 0.5)",
        "glow-green": "0 0 20px rgba(0, 255, 136, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
