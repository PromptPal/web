import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { ViteFaviconsPlugin } from 'vite-plugin-favicon'
import BuildInfo from 'vite-plugin-info'
import zipPack from 'vite-plugin-zip-pack'

const isProduction = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    TanStackRouterVite() as any,
    react(),
    BuildInfo(),

    isProduction && zipPack(),
    // ViteFaviconsPlugin('./src/assets/prompt-pal-logo.png')
  ].filter((x) => x),
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
