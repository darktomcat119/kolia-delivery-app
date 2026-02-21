/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
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
        text: {
          primary: '#1A1A1A',
          secondary: '#6B6560',
          tertiary: '#A39E98',
          'on-primary': '#FFFFFF',
        },
        success: {
          DEFAULT: '#16A34A',
          muted: '#E8F9EE',
        },
        error: {
          DEFAULT: '#DC2626',
          muted: '#FDE8E8',
        },
        warning: {
          DEFAULT: '#F59E0B',
          muted: '#FEF5E4',
        },
        info: {
          DEFAULT: '#2563EB',
          muted: '#E8EFFE',
        },
        skeleton: {
          DEFAULT: '#E8E4DD',
          shimmer: '#F0ECE6',
        },
      },
      fontFamily: {
        display: ['PlayfairDisplay_700Bold'],
        'display-semibold': ['PlayfairDisplay_600SemiBold'],
        body: ['DMSans_400Regular'],
        'body-medium': ['DMSans_500Medium'],
        'body-semibold': ['DMSans_600SemiBold'],
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        pill: '24px',
        input: '12px',
      },
    },
  },
  plugins: [],
};
