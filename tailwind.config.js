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
        primary: '#1e293b',
        secondary: '#334155',
        success: '#2ecc71',
        danger: '#ff4757',
        warning: '#ffa502',
        info: '#3742fa',
        light: '#f1f2f6',
        darkBg: '#0f172a',
      }
    }
  },
  plugins: [],
}
