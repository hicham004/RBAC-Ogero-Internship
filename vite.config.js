import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/roles': 'http://localhost:3001',
      '/users': 'http://localhost:3001',
      '/permissions': 'http://localhost:3001',
      '/hierarchy': 'http://localhost:3001',
      '/changeRequests': 'http://localhost:3001',          
      '/permissionRequests': 'http://localhost:3001'       
    }
  }
});
