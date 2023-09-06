import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      keyframes: {
        wave: {
          "0%, 5%, 10%": { transform: "rotate(0deg)" },
          "2.5%, 7.5%": { transform: "rotate(30deg)" },
        },
      },
      animation: {
        wave: "wave 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
