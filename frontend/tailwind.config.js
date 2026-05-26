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
        gold: '#D4AF37',
        charcoal: '#1A1A1A',
        cream: '#F5F1E8',
        'soft-white': '#FAFAF8',
        'rose-gold': '#B76E79',
        silver: '#C0C0C0',
        'text-primary': '#1A1A1A',
        'text-secondary': '#5A5A5A',
        border: '#E8E8E8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['Montserrat', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5D784 50%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
        'luxe-hero': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #2a2510 100%)',
      },
      boxShadow: {
        'luxe': '0 4px 30px rgba(212, 175, 55, 0.15)',
        'luxe-hover': '0 16px 50px rgba(212, 175, 55, 0.25)',
        'card': '0 2px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.16)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
