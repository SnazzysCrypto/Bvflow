/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fd',
          400: '#8292fa',
          500: '#6471f5',
          600: '#4f52ea',
          700: '#4240d4',
          800: '#3636ab',
          900: '#303387',
        },
      },
    },
  },
  plugins: [],
}
