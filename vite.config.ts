
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 确保 API_KEY 被正确注入为字符串常量
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    // 针对 Vercel 优化，确保模块解析正确
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
