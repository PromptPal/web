import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import zipPack from 'vite-plugin-zip-pack'
import BuildInfo from 'vite-plugin-info'
import { ViteFaviconsPlugin } from 'vite-plugin-favicon'

const isProduction = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    BuildInfo(),
    isProduction && zipPack(),
    // ViteFaviconsPlugin('./src/assets/prompt-pal-logo.png')
  ].filter(x => x),
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})