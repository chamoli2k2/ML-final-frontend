import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.170.31:6969', // Your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Keep the `/api` prefix
      },
    },
  },
});
