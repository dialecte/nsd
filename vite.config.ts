import path from 'node:path'
/// <reference types="vite/client" />
import { fileURLToPath, URL } from 'node:url'

// VITE
import { defineConfig } from 'vite'
// VITE PLUGINS
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		dts({
			tsconfigPath: path.resolve(__dirname, './tsconfig.build.json'),
			insertTypesEntry: true,
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		sourcemap: import.meta.env?.DEV,
		lib: {
			entry: {
				'v2017A/index': fileURLToPath(new URL('./src/v2017A/index.ts', import.meta.url)),
				'v2017A/test': fileURLToPath(new URL('./src/v2017A/test/index.ts', import.meta.url)),
			},
			name: 'NsdDialecte',
			formats: ['es'],
		},
		rollupOptions: {
			external: [/^@dialecte\/core/, 'dexie'],
		},
	},
})
