/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#6366F1', // Indigo
          light: '#A5B4FC',
          dark: '#312E81',
        },
        accent: {
          DEFAULT: '#10B981', // Emerald
          light: '#6EE7B7',
        },
        blush: {
          DEFAULT: '#F472B6',
          light: '#FBCFE8',
        },
        blue: {
          DEFAULT: '#3B82F6',
          light: '#93C5FD',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        pink: {
          DEFAULT: '#EC4899',
          light: '#F9A8D4',
        },
      },
      boxShadow: {
        soft: '0 4px 24px 0 rgba(99, 102, 241, 0.08)',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '2rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

