import { defineConfig } from 'vite';
import { resolve } from 'path';

const esbuildConfig = {
	loader: 'jsx',
	include: /src\/.*\.js$/,
	exclude: [],
	jsxFactory: 'wp.element.createElement',
	jsxFragment: 'wp.element.Fragment',
};

const cssConfig = {
	preprocessorOptions: {
		scss: {
			api: 'modern-compiler',
		},
	},
};

const globals = {
	'@wordpress/blocks': 'wp.blocks',
	'@wordpress/element': 'wp.element',
	'@wordpress/block-editor': 'wp.blockEditor',
	'@wordpress/i18n': 'wp.i18n',
	'@wordpress/hooks': 'wp.hooks',
	'@wordpress/compose': 'wp.compose',
	'@wordpress/components': 'wp.components',
};

const defineEnv = {
	'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
};

export default defineConfig({
	esbuild: esbuildConfig,
	build: {
		outDir: 'build',
		emptyOutDir: true,
		minify: false,
		cssMinify: false,
		rollupOptions: {
			input: {
				editor: resolve(__dirname, 'src/editor-entry.js'),
			},
			output: {
				format: 'iife',
				name: 'TriopsiBlockVisibility',
				globals,
				entryFileNames: 'editor.js',
				assetFileNames: (assetInfo) => {
					const name = assetInfo.name || '';
					if (name.endsWith('.css')) {
						return 'editor.css';
					}
					return '[name][extname]';
				},
				chunkFileNames: 'chunks/[name]-[hash].js',
			},
			external: [
				/^@wordpress\//,
			],
		},
		manifest: false,
	},
	css: cssConfig,
	define: defineEnv,
});
