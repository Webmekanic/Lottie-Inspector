import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Forward the API key from the incoming request
            const apiKey = req.headers['x-api-key'];
            if (apiKey) {
              proxyReq.setHeader('x-api-key', apiKey);
            } else {
              console.warn('No API key found in request headers!');
            }
            
            // Set required headers
            proxyReq.setHeader('anthropic-version', '2023-06-01');
            proxyReq.setHeader('anthropic-dangerous-direct-browser-access', 'true');
            proxyReq.setHeader('content-type', 'application/json');
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Log response body for 401 errors
            if (proxyRes.statusCode === 401) {
              let body = '';
              proxyRes.on('data', (chunk) => {
                body += chunk;
              });
              proxyRes.on('end', () => {
                console.error('401 Error body:', body);
              });
            }
          });
        },
      },
    },
  },
})