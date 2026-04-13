import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8f1',
          100: '#ffefdb',
          200: '#ffdac1',
          300: '#ffbd93',
          400: '#ff8f58',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        surface: {
          50:  '#fdfcfb',
          100: '#f5f4f2',
          200: '#e7e5e4',
          300: '#d6d3d1',
          800: '#44403c',
          900: '#292524',
          950: '#1c1917',
        },
        success: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a' },
        danger:  { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
        warning: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft':     '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'glow':     '0 0 20px rgba(99,102,241,0.35)',
        'glow-lg':  '0 0 40px rgba(99,102,241,0.45)',
        'card':     '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':    'spin 3s linear infinite',
        'bounce-gentle':'bounce 2s infinite',
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-up':     'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':     'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                          to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.92)' },     to: { opacity: '1', transform: 'scale(1)' } },
      },
      screens: { xs: '375px' },
    },
  },
  plugins: [],
}

export default config
