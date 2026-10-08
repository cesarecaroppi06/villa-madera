import type { Config } from 'tailwindcss';

// I valori vivono in src/styles/tokens.css; qui Tailwind li richiama per nome.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '480px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px' },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'bianco-infisso': 'var(--bianco-infisso)',
      lino: 'var(--lino)',
      tortora: 'var(--tortora)',
      'tortora-profondo': 'var(--tortora-profondo)',
      inchiostro: 'var(--inchiostro)',
      'verde-persiana': 'var(--verde-persiana)',
      'verde-persiana-scuro': 'var(--verde-persiana-scuro)',
      rovere: 'var(--rovere)',
      mattone: 'var(--mattone)',
      white: '#ffffff',
    },
    fontFamily: {
      display: 'var(--font-display)',
      sans: 'var(--font-sans)',
    },
    fontSize: {
      sm: ['var(--step--1)', { lineHeight: '1.5' }],
      base: ['var(--step-0)', { lineHeight: 'var(--leading-body)' }],
      lg: ['var(--step-1)', { lineHeight: '1.4' }],
      xl: ['var(--step-2)', { lineHeight: 'var(--leading-title)' }],
      '2xl': ['var(--step-3)', { lineHeight: 'var(--leading-title)' }],
      '3xl': ['var(--step-4)', { lineHeight: '1.08' }],
      display: ['var(--step-display)', { lineHeight: '1.05' }],
    },
    borderRadius: { none: '0', DEFAULT: 'var(--radius)', full: '9999px' },
    boxShadow: { none: 'none' },
    extend: {
      maxWidth: { container: 'var(--container)', prose: '68ch' },
      spacing: { section: 'var(--section)', gutter: 'var(--gutter)' },
      transitionTimingFunction: { tenda: 'var(--ease)' },
      transitionDuration: { ui: '200ms', img: '700ms' },
    },
  },
  plugins: [],
} satisfies Config;
