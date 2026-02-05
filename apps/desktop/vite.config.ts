import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
  },
  server: {
    port: 4000,
    strictPort: false,
    host: '0.0.0.0',
  },
});
