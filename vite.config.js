// vite.config.js
import { defineConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [commonjs()],
  build: {
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'VeracodeHMAC.js',
        format: 'es',
      },
    },
    outDir: './',
    minify: false,
  },
});
