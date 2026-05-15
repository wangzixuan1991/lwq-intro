import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// On Vercel deploy to root (no base path). For GitHub Pages, keep /lwq-intro/.
const onVercel = !!process.env.VERCEL;

export default defineConfig({
  site: onVercel ? 'https://lwq-intro.vercel.app' : 'https://wangzixuan1991.github.io',
  base: onVercel ? '/' : '/lwq-intro/',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [tailwind({ applyBaseStyles: false })],
});
