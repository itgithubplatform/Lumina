/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        accessibility: {
          high: '#000000',
          medium: '#1f2937',
          low: '#6b7280',
          dyslexia: '#fef3c7',
        }
      },
      fontFamily: {
        'dyslexia': ['OpenDyslexic', 'Arial', 'sans-serif'],
        'large': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'accessibility-sm': ['16px', '24px'],
        'accessibility-md': ['20px', '30px'],
        'accessibility-lg': ['24px', '36px'],
        'accessibility-xl': ['32px', '48px'],
      }
    },
  },
  plugins: [],
}