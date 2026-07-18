const { brand } = require("./src/lib/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // Class strategy so setColorScheme() can toggle dark mode on web.
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        foreground: {
          DEFAULT: "rgb(var(--foreground) / <alpha-value>)",
          muted: "rgb(var(--foreground-muted) / <alpha-value>)",
        },
        outline: {
          DEFAULT: "rgb(var(--outline) / <alpha-value>)",
          subtle: "rgb(var(--outline-subtle) / <alpha-value>)",
          strong: "rgb(var(--outline-strong) / <alpha-value>)",
        },
        brand,
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
