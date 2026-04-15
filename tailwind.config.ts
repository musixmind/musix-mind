import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        electric: "#00A3FF",
        violetneon: "#8B5CF6",
        ink: "#000000",
        panel: "rgba(255,255,255,0.07)"
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 163, 255, 0.24)",
        violet: "0 0 36px rgba(139, 92, 246, 0.2)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
