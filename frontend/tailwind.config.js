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
        betano: {
          primary: '#1DB954',
          secondary: '#FF6B00',
          green: '#1DB954',
          orange: '#FF6B00',
          dark: '#0D0D0D',
          surface: '#1A1A1A',
          card: '#252525',
          border: '#333333',
          muted: '#B3B3B3',
          text: '#FFFFFF',
          'text-secondary': '#B3B3B3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-betano': 'linear-gradient(135deg, #1DB954 0%, #FF6B00 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}