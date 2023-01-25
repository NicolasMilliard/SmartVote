/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#fefefe",
      gray: "#a3a2a7",
      purple: {
        100: "#2b2b45",
        900: "#171725",
      },
      yellow: "#fcd100",
      orange: "#fd9a0b",
      red: "#fd3920",
    },
  },
  plugins: [],
};
