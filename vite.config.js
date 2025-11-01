import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    target: 'es2017',
  },
  plugins: [
    tailwindcss(),
    sveltekit(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),]
});