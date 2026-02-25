import { addFilter } from '@wordpress/hooks';

import { registerEditorFilters } from './edit.jsx';
import { registerSaveFilters } from './save.jsx';

/**
 * Attribut an (fast) alle Blöcke hängen
 *
 * @param {Object} settings Block settings object.
 * @param {string} name     Block name.
 * @return {Object} Modified settings.
 */
function addHideOnMobileAttribute( settings, name ) {
	const excluded = new Set( [ 'core/block' ] ); // z.B. Reusable Block Wrapper
	if ( excluded.has( name ) ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			hideOnMobile: { type: 'boolean', default: false },
			hideOnDesktop: { type: 'boolean', default: false },
			centerOnMobile: { type: 'boolean', default: false },
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'trblvi/add-triopsi-block-visibility-attribute',
	addHideOnMobileAttribute
);

// Editor + Save Filter registrieren
registerEditorFilters();
registerSaveFilters();
