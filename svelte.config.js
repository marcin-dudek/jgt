import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'connect-src': ["'self'", 'https://cloudflareinsights.com', 'https://api.brevo.com', 'https://o4507021725138944.ingest.us.sentry.io'],
        'script-src': ["'self'", 'https://static.cloudflareinsights.com'],
        'report-to': ['https://o4507021725138944.ingest.sentry.io'],
        'report-uri': ['https://o4507021725138944.ingest.sentry.io'],
        'worker-src': ["'self'", 'blob:'],
      },
      reportOnly: {
        'report-uri': ['https://o4507021725138944.ingest.sentry.io'],
        'report-to': ['csp-endpoint']
      }
    }
  },
  preprocess: vitePreprocess()
};
export default config;
