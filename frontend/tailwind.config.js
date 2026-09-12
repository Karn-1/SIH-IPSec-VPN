/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soc: {
          background: '#0C1511',
          card: '#17251F',
          cardHover: '#20352B',
          border: '#2C4739',
          borderLight: '#40604D',
          text: '#F7FBF8',
          textSecondary: '#C5D5CA',
          textMuted: '#9EB4A5',
          primary: '#22C55E',
          primaryDark: '#166534',
          primaryLight: '#4ADE80',
          accent: '#7DD3A5',
          accentDark: '#34A86B',
          accentLight: '#BBF7D0',
          success: '#34D399',
          warning: '#FBBF24',
          danger: '#FB7185',
          info: '#B6C7BC',
        }
      },
      fontWeight: {
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      }
    },
  },
  plugins: [],
}
