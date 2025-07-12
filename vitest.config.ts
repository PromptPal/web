/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/test/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/*.stories.*',
				'src/gql/',
				'src/vite-env.d.ts'
			]
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	}
})