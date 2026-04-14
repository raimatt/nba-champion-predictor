/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        championGlow: {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(234, 179, 8, 0.3)' },
          '50%': { boxShadow: '0 0 40px 12px rgba(234, 179, 8, 0.6)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out forwards',
        championGlow: 'championGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
