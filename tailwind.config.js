/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c0c0c",
        surface: "#141414",
        raised: "#1b1b1b",
        paper: "#eeeeea",
        muted: "#8f8f8a",
        dim: "#4a4a47",
        line: "rgba(238, 238, 234, 0.1)",
        // The only accent: ServiceNow's brand green, used sparingly
        accent: "#62d84e",
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
