import type { Config } from 'tailwindcss'

const withOpacity = (variable: string) => `hsl(var(${variable}) / <alpha-value>)`

export default <Partial<Config>>{
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        brand: {
          50: withOpacity('--color-brand-50'),
          100: withOpacity('--color-brand-100'),
          200: withOpacity('--color-brand-200'),
          300: withOpacity('--color-brand-300'),
          400: withOpacity('--color-brand-400'),
          500: withOpacity('--color-brand-500'),
          600: withOpacity('--color-brand-600'),
          700: withOpacity('--color-brand-700'),
          800: withOpacity('--color-brand-800'),
          900: withOpacity('--color-brand-900'),
          950: withOpacity('--color-brand-950'),
        },
        neutral: {
          0: withOpacity('--color-neutral-0'),
          50: withOpacity('--color-neutral-50'),
          100: withOpacity('--color-neutral-100'),
          200: withOpacity('--color-neutral-200'),
          300: withOpacity('--color-neutral-300'),
          400: withOpacity('--color-neutral-400'),
          500: withOpacity('--color-neutral-500'),
          600: withOpacity('--color-neutral-600'),
          700: withOpacity('--color-neutral-700'),
          800: withOpacity('--color-neutral-800'),
          900: withOpacity('--color-neutral-900'),
          950: withOpacity('--color-neutral-950'),
        },
        success: {
          50: withOpacity('--color-success-50'),
          100: withOpacity('--color-success-100'),
          600: withOpacity('--color-success-600'),
          700: withOpacity('--color-success-700'),
        },
        warning: {
          50: withOpacity('--color-warning-50'),
          100: withOpacity('--color-warning-100'),
          600: withOpacity('--color-warning-600'),
          700: withOpacity('--color-warning-700'),
        },
        danger: {
          50: withOpacity('--color-danger-50'),
          100: withOpacity('--color-danger-100'),
          600: withOpacity('--color-danger-600'),
          700: withOpacity('--color-danger-700'),
        },
        info: {
          50: withOpacity('--color-info-50'),
          100: withOpacity('--color-info-100'),
          600: withOpacity('--color-info-600'),
          700: withOpacity('--color-info-700'),
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        control: 'var(--shadow-sm)',
        soft: 'var(--shadow-md)',
        overlay: 'var(--shadow-lg)',
      },
      maxWidth: {
        content: '80rem',
        reading: '65ch',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        normal: 'var(--motion-normal)',
        slow: 'var(--motion-slow)',
      },
      transitionTimingFunction: {
        product: 'var(--ease-product)',
      },
    },
  },
}
