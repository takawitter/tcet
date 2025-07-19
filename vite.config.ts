import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/tcet.ts',
      name: 'tcet',
      formats: ["es", "umd"],
      fileName: (format) => `tcet.${format}.js`,      
    },
  },
});
