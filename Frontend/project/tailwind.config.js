/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#e6f7ff',
          DEFAULT: '#1890ff',
          dark: '#096dd9',
        },
        secondary: {
          light: '#f0f5ff',
          DEFAULT: '#597ef7',
          dark: '#2f54eb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};