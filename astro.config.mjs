import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.arrowmaxcleanwpa.com',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  server: { host: true },
});
