import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.(js|jsx)$/,
        jsxFactory: 'wp.element.createElement',
        jsxFragment: 'wp.element.Fragment',
    },

    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },

    build: {
        outDir: 'build',
        emptyOutDir: false, // wichtig wenn du noch einen zweiten build hast (frontend css)
        minify: false,
        cssMinify: false,
        manifest: false,

        rollupOptions: {
            input: {
                editor: resolve(__dirname, 'src/editor-entry.js'),
            },

            // WordPress liefert @wordpress/* zur Laufzeit
            external: (id) => id.startsWith('@wordpress/'),

            output: {
                format: 'iife',
                name: 'TriopsiBlockVisibility',

                globals: {
                    '@wordpress/blocks': 'wp.blocks',
                    '@wordpress/element': 'wp.element',
                    '@wordpress/block-editor': 'wp.blockEditor',
                    '@wordpress/i18n': 'wp.i18n',
                    '@wordpress/hooks': 'wp.hooks',
                    '@wordpress/compose': 'wp.compose',
                    '@wordpress/components': 'wp.components',
                },

                entryFileNames: 'editor.js',
                chunkFileNames: 'chunks/[name]-[hash].js',

                assetFileNames: (assetInfo) => {
                    const name = assetInfo.name || '';
                    if (name.endsWith('.css')) return 'editor.css';
                    return '[name][extname]';
                },
            },
        },
    },
});