import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — Kaelo Atelier
        navy: {
          DEFAULT: "#1A2B4C",
          light: "#2C4270",
          dark: "#101B33",
        },
        green: {
          DEFAULT: "#2E6F40",
          light: "#3F9457",
          dark: "#204E2D",
        },
        cream: "#F7F5F1",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(26, 43, 76, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
