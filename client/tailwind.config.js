/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    fontFamily: {
      sans: ["Roboto, sans-serif"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#e1e1e5",
      gray: {
        100: "#bbbbd2",
        500: "#c3bdc8",
        900: "#5c5b63",
      },
      black: "#050507",
      red: "#e84949",
    },
    borderRadius: {
      none: "0",
      xs: "0.75rem",
      sm: "0.875rem",
      DEFAULT: "1rem",
      full: "50%",
    },
    boxShadow: {
      DEFAULT: "0 0 16px rgba(5, 5, 7, 0.1)",
    },
  },
  plugins: [],
};
