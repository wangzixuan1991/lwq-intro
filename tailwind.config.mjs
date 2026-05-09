/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Source Serif 4', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Inter Tight', 'Inter', 'sans-serif'],
      },
      colors: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        ink: 'var(--c-ink)',
        muted: 'var(--c-muted)',
        accent: 'var(--c-accent)',
        rule: 'var(--c-rule)',
      },
      maxWidth: {
        prose: '70ch',
        page: '1100px',
      },
    },
  },
  plugins: [],
};
