import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Color Palette ────────────────────────────────────────────────
      colors: {
        // Brand primary — a warm terracotta/coral
        brand: {
          50:  '#fff5f0',
          100: '#ffe8db',
          200: '#ffc9ae',
          300: '#ffa37f',
          400: '#ff7a4f',
          500: '#ff5722', // primary action
          600: '#e84c1a',
          700: '#c73e12',
          800: '#9e310e',
          900: '#7a260b',
          950: '#411208',
        },
        // Neutral — warm off-white / charcoal (NOT default Tailwind gray)
        stone: {
          50:  '#faf9f7',
          100: '#f2ede7',
          200: '#e4dbd0',
          300: '#cfc2b0',
          400: '#b3a08c',
          500: '#9a846d',
          600: '#836e59',
          700: '#6c5a49',
          800: '#574a3e',
          900: '#483e36',
          950: '#271f1a',
        },
        // Accent — deep teal for secondary CTAs
        teal: {
          50:  '#effafa',
          100: '#d6f4f5',
          200: '#b1e9eb',
          300: '#7dd8dc',
          400: '#44bfc6',
          500: '#28a2aa',
          600: '#25828f',
          700: '#246873',
          800: '#26555e',
          900: '#244850',
          950: '#122f35',
        },
        // Semantic
        success: '#22c55e',
        warning: '#f59e0b',
        error:   '#ef4444',
      },

      // ─── Typography ───────────────────────────────────────────────────
      fontFamily: {
        heading: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg':  ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md':  ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-xs':  ['1.5rem',  { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
      },

      // ─── Spacing (8px base grid) ──────────────────────────────────────
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '26':  '6.5rem',
        '30':  '7.5rem',
      },

      // ─── Border Radius ────────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ─── Box Shadow ───────────────────────────────────────────────────
      boxShadow: {
        'card':     '0 2px 8px -2px rgba(39,31,26,0.08), 0 4px 16px -4px rgba(39,31,26,0.06)',
        'card-hover':'0 8px 24px -4px rgba(39,31,26,0.12), 0 16px 32px -8px rgba(39,31,26,0.08)',
        'booking':  '0 12px 40px -8px rgba(39,31,26,0.18)',
        'dropdown': '0 4px 16px -2px rgba(39,31,26,0.12), 0 2px 6px -2px rgba(39,31,26,0.08)',
      },

      // ─── Animation ────────────────────────────────────────────────────
      animation: {
        'fade-in':       'fadeIn 0.3s ease-out',
        'slide-up':      'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right':'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'skeleton':      'skeleton 1.6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },

      // ─── Backdrop Blur ────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
