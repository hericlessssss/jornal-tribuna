/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#dc2626',
          dark: '#991b1b',
        },
      },
    },
  },
  plugins: [],
};