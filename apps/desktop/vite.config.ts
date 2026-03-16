import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@repo/shared-types': path.resolve(
        __dirname,
        '../../packages/shared-types/src/index.ts',
      ),
    },
  },
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
