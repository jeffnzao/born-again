import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spiritual: {
          50: '#faf8ff',
          100: '#f3ecff',
          200: '#e8d9ff',
          300: '#d4b5ff',
          400: '#b890ff',
          500: '#9d68ff',
          600: '#8843ff',
          700: '#7c2ae8',
          800: '#5f1fb3',
          900: '#4a157d',
          950: '#2d0d4d',
        },
        sacred: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      animation: {
        'pulse-spiritual': 'pulse-spiritual 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'breath': 'breath 4s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-spiritual': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(141, 67, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(141, 67, 255, 0.6)' },
        },
        'breath': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'spiritual': '0 0 20px rgba(141, 67, 255, 0.25)',
        'spiritual-lg': '0 0 40px rgba(141, 67, 255, 0.35)',
      },
    },
  },
  plugins: [],
}
export default config
