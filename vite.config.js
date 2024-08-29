import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.170.31:6969', // Replace with your backend URL
        changeOrigin: true,
        secure: false, // If you're using a self-signed certificate, set this to false
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
