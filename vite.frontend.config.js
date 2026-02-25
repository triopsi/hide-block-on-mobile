import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Plugin to remove empty JS files generated from CSS-only entries
function removeEmptyJsPlugin() {
	return {
		name: 'remove-empty-js',
		writeBundle(options) {
			const emptyJsFiles = ['frontend-style.js', 'editor-style.js'];
			const outputDir = options.dir || 'build';

			emptyJsFiles.forEach((file) => {
				const filePath = resolve(outputDir, file);
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}
			});
		}
	};
}

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

const defineEnv = {
	'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
};

export default defineConfig({
	esbuild: esbuildConfig,
	build: {
		outDir: 'build',
		emptyOutDir: false,
		minify: false,
		cssMinify: false,
		rollupOptions: {
			input: {
				'frontend-style': resolve(__dirname, 'src/style-entry.js'),
				'editor-style': resolve(__dirname, 'src/editor-style-entry.js'),
			},
			output: {
				entryFileNames: '[name].js',
				assetFileNames: (assetInfo) => {
					const name = assetInfo.name || '';
					if (name.includes('editor-style') && name.endsWith('.css')) {
						return 'editor.css';
					}
					if (name.includes('frontend-style') && name.endsWith('.css')) {
						return 'frontend.css';
					}
					return '[name][extname]';
				},
				chunkFileNames: 'chunks/[name]-[hash].js',
			},
		},
		manifest: false,
	},
	css: cssConfig,
	plugins: [removeEmptyJsPlugin()],
	define: defineEnv,
});
