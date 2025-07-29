module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#14b8a6', // teal-500
          dark: '#0f766e',    // teal-800
        },
      },
    },
  },
  plugins: [],
};
