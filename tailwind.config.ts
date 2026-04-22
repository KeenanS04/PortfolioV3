import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "SF Pro Display", "Inter", "sans-serif"],
      },
      colors: {
        ink: "#0a0a0f",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "25%": { transform: "translate3d(4%,-6%,0) scale(1.08)" },
          "50%": { transform: "translate3d(-3%,-10%,0) scale(1.04)" },
          "75%": { transform: "translate3d(-6%,-3%,0) scale(1.1)" },
        },
        drift: {
          "0%,100%": { transform: "translate3d(-8%,2%,0) scale(1)" },
          "33%": { transform: "translate3d(6%,-4%,0) scale(1.06)" },
          "66%": { transform: "translate3d(9%,4%,0) scale(1.03)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 14s ease-in-out infinite",
        drift: "drift 20s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
