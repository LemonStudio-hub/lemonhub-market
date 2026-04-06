import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// SDK Library Build Configuration
// Builds the LemonHub SDK as a standalone npm package
export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/sdk/index.ts'),
      name: 'LemonHub',
      formats: ['es', 'cjs'],
      fileName: 'lemon-hub',
    },
    outDir: 'dist-sdk',
    emptyOutDir: true,
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
        },
      },
    },
  },
})
