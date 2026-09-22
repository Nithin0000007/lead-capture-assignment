/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'drawer-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'popover-in': {
          '0%': { opacity: '0', transform: 'translateY(-4px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.2s ease-out',
        'drawer-in': 'drawer-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'popover-in': 'popover-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
};
