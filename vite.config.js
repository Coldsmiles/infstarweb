import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths) {
      // Only pre-render primary routes, skip .html aliases
      return paths.filter((path) => !path.endsWith('.html'));
    },
  },
});