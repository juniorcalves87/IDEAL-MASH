/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sap: {
          bg: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          accent: '#e3b341', // Amarelo PCM
        }
      }
    },
  },
  plugins: [],
}