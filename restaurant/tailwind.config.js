/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E07A2F',
          light: '#F4A261',
          dark: '#C4631E',
          muted: '#FDF0E4',
        },
        secondary: {
          DEFAULT: '#1B5E3A',
          light: '#2D8B5E',
        },
        accent: '#D4A745',
        background: '#FAFAF7',
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F5F3EF',
        },
        border: {
          DEFAULT: '#E8E4DD',
          light: '#F0ECE6',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
