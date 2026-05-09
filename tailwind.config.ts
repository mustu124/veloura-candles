import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#090706",
        obsidian: "#11100e",
        cream: "#f6f0e6",
        porcelain: "#fffaf2",
        champagne: "#d9b56f",
        amber: "#c68142",
        moss: "#68715b",
        rosewood: "#7b3f36"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 80px rgba(217,181,111,.24)",
        velvet: "0 24px 80px rgba(9,7,6,.22)"
      },
      keyframes: {
        flame: {
          "0%,100%": { transform: "translateY(0) scale(1)", opacity: ".88" },
          "50%": { transform: "translateY(-7px) scale(1.08)", opacity: "1" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        flame: "flame 3.4s ease-in-out infinite",
        marquee: "marquee 28s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
