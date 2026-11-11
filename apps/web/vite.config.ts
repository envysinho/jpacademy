import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Los paquetes del workspace se publican como CommonJS (los consume también NestJS);
  // Vite debe pre-empaquetarlos en dev para convertirlos a ESM.
  optimizeDeps: { include: ['@academy/shared', '@academy/api-client'] },
  server: { port: 5173 },
});
