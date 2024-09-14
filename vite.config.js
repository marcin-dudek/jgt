import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2017',
  },
  plugins: [sentrySvelteKit({
    sourceMapsUploadOptions: {
      org: "magickwings",
      project: "juicy-decor"
    }
  }), sveltekit()]
});