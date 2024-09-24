import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  build: {
    target: 'es2017',
  },
  plugins: [
    sveltekit(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),]
});