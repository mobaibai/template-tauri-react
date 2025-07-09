import react from '@vitejs/plugin-react'
import path from 'node:path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

import { svgsprites } from './vite_plugins/svgsprites'

const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [UnoCSS(), react(), svgsprites({ noOptimizeList: ['logo'] })],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },

  define: {
    __isDev__: process.env.NODE_ENV === 'development',
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  base: './',

  build: {
    chunkSizeWarningLimit: 1024,
  },

  assetsInclude: [
    /* 二进制打包模型 */
    '**/*.glb',
    /* HDR环境贴图 */
    '**/*.hdr',
    /* 压缩纹理 */
    '**/*.ktx2',
  ],
}))
