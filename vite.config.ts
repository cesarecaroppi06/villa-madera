import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

// Porta 8080: è quella che usa l'anteprima di Lovable.
export default defineConfig({
  server: { host: '::', port: 8080 },
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: { target: 'es2020', cssCodeSplit: false },
});
