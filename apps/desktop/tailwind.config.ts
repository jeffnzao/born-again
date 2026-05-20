import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sacred: {
          50: '#fdf8f4',
          100: '#fbe8dc',
          200: '#f5cebc',
          300: '#efb39b',
          400: '#ea987b',
          500: '#e47d5c',
          600: '#d4693c',
          700: '#b8512f',
          800: '#8f3e23',
          900: '#6b2c18',
        },
        divine: {
          purple: '#6b21a8',
          gold: '#fbbf24',
          silver: '#e5e7eb',
        },
      },
      animation: {
        'breath': 'breath 4s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-in-out',
      },
      keyframes: {
        breath: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(249, 115, 22, 0.4)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
