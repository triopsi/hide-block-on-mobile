import { addFilter } from '@wordpress/hooks';
import './style.scss';
import './editor.scss';

import { registerEditorFilters } from './edit';
import { registerSaveFilters } from './save';

/**
 * Attribut an (fast) alle Blöcke hängen
 */
function addHideOnMobileAttribute(settings, name) {
	const excluded = new Set(['core/block']); // z.B. Reusable Block Wrapper
	if (excluded.has(name)) return settings;

	return {
		...settings,
		attributes: {
			...settings.attributes,
			hideOnMobile: { type: 'boolean', default: false },
			hideOnDesktop: { type: 'boolean', default: false },
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'hbom/add-hide-on-mobile-attribute',
	addHideOnMobileAttribute
);

// Editor + Save Filter registrieren
registerEditorFilters();
registerSaveFilters();
