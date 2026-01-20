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
        // Instagram-like dark theme
        primary: "#0095F6", // Instagram blue
        secondary: "#FF3040", // Instagram red/pink for likes
        background: "#000000", // Pure black like Instagram
        card: "#121212", // Dark gray cards
        border: "#262626", // Subtle borders
        accent: "#1A1A1A",
        foreground: "#FAFAFA",
        muted: "#8E8E8E",
        text: {
          primary: "#FAFAFA",
          secondary: "#A8A8A8",
        },
        // Gradient colors for stories
        gradient: {
          start: "#F58529",
          middle: "#DD2A7B",
          end: "#8134AF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Bebas Neue", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 149, 246, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 149, 246, 0.4)",
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        'gradient-instagram': 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)',
        'gradient-story': 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)',
      },
    },
  },
  plugins: [],
};

export default config;
