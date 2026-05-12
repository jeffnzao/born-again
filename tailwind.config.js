/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spiritual: {
          50: '#f8f7ff',
          100: '#f0eeff',
          200: '#e8deff',
          300: '#d5c4ff',
          400: '#b898ff',
          500: '#9d6dff',
          600: '#8b4dff',
          700: '#7a2eff',
          800: '#6620d9',
          900: '#4d15b8',
        },
        sacred: {
          50: '#faf8f3',
          100: '#f5f1e6',
          200: '#f0ecd9',
          300: '#e8e0c5',
          400: '#dccca3',
          500: '#d0b888',
          600: '#c9a86e',
          700: '#b8935d',
          800: '#9d7a47',
          900: '#6d5436',
        }
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(157, 109, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(157, 109, 255, 0.6)' },
        },
      }
    },
  },
  plugins: [],
}
