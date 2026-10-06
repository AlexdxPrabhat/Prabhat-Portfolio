/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07070a",
        surface: "#0f0e14",
        raised: "#16151d",
        paper: "#f1efe9",
        muted: "#8f8d99",
        dim: "#4a4954",
        line: "rgba(241, 239, 233, 0.1)",
        violet: { DEFAULT: "#8b5cf6", soft: "#a78bfa", deep: "#4c1d95" },
        lime: "#c4f542",
      },
      fontFamily: {
        sans: ['"Inter Tight Variable"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.06em",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};
