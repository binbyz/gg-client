/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
  theme: {
    extend: {
      colors: {
        'bluegray-900': '#0F172A',
        'bluegray-800': '#1E293B',
        'bluegray-700': '#334155',
        'bluegray-600': '#475569',
        'bluegray-500': '#64748B',
        'bluegray-400': '#94A3B8',
        'bluegray-300': '#CBD5E1',
        'bluegray-200': '#E2E8F0',
        'bluegray-100': '#F1F5F9',
        'bluegray-50': '#F8FAFC',
        scrollbar: {
          bg: 'var(--scrollbar-bg-color)',
          thumb: 'var(--scrollbar-thumb-color)',
          thumbHover: 'var(--scrollbar-thumb-hover-color)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
