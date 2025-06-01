import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import BuildInfo from 'unplugin-info/vite'
import { defineConfig } from 'vite'
import zipPack from 'vite-plugin-zip-pack'

const isProduction = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TanStackRouterVite() as any,
    react(),
    BuildInfo(),
    isProduction && zipPack(),
    // ViteFaviconsPlugin('./src/assets/prompt-pal-logo.png')
  ].filter(x => x),
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
