import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Version B - puerto 5174 para correr en paralelo con la version A (React).
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5174,
    host: true,
  },
  preview: {
    port: 5174,
  },
});
