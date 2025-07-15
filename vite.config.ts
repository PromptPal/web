import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import BuildInfo from 'unplugin-info/vite'
import { defineConfig, loadEnv } from 'vite'
import zipPack from 'vite-plugin-zip-pack'

import { analyzer } from 'vite-bundle-analyzer'

import { inspectorServer } from '@react-dev-inspector/vite-plugin'

const isProduction = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      BuildInfo(),
      isProduction && zipPack(),
      analyzer({
        enabled: !isProduction,
      }),
      inspectorServer(),
    // ViteFaviconsPlugin('./src/assets/prompt-pal-logo.png')
    ].filter(x => x),
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      __HTTP_ENDPOINT__: JSON.stringify(env.VITE_HTTP_ENDPOINT),
    },
  }
})
