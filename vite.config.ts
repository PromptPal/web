import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import BuildInfo from 'unplugin-info/vite'
import { defineConfig } from 'vite'
import zipPack from 'vite-plugin-zip-pack'

import { inspectorServer } from '@react-dev-inspector/vite-plugin'

const isProduction = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    BuildInfo(),
    isProduction && zipPack(),
    inspectorServer(),
    // ViteFaviconsPlugin('./src/assets/prompt-pal-logo.png')
  ].filter(x => x),
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
