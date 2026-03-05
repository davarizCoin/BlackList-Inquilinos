/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          dark: '#0f172a',
          primary: '#1e293b',
          accent: '#b91c1c',
          secondary: '#334155'
        }
      }
    },
  },
  plugins: [],
}
