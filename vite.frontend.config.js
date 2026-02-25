import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

function removeCssEntryJsStubs(stubFiles = []) {
	return {
		name: 'remove-css-entry-js-stubs',
		writeBundle(options) {
			const outDir = options.dir || 'build';
			for (const file of stubFiles) {
				const p = resolve(outDir, file);
				if (fs.existsSync(p)) fs.unlinkSync(p);
			}
		},
	};
}

export default defineConfig({
	build: {
		outDir: 'build',
		emptyOutDir: false, // weil dein editor-build ebenfalls nach build/ schreibt
		minify: false,
		cssMinify: false,
		rollupOptions: {
			input: {
				'frontend-style': resolve(__dirname, 'src/style-entry.js'),
				'editor-style': resolve(__dirname, 'src/editor-style-entry.js'),
			},
			output: {
				// JS-Stubs werden danach entfernt
				entryFileNames: '[name].js',
				assetFileNames: (assetInfo) => {
					const name = assetInfo.name || '';
					if (name.includes('editor-style') && name.endsWith('.css')) return 'editor.css';
					if (name.includes('frontend-style') && name.endsWith('.css')) return 'frontend.css';
					return '[name][extname]';
				},
			},
		},
	},
	plugins: [
		removeCssEntryJsStubs(['frontend-style.js', 'editor-style.js']),
	],
});