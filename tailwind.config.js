/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        costco: {
          red: '#E31837',
          blue: '#005DAA',
          grey: '#555555',
        }
      }
    },
  },
  plugins: [],
}
