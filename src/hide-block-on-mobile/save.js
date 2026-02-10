import { addFilter } from '@wordpress/hooks';

/**
 * Beim Speichern `hide-mobile` und `hide-desktop` zur className hinzufügen (Frontend-Markup)
 *
 * @param {Object} extraProps Props already collected for save content.
 * @param {Object} blockType  Block type object.
 * @param {Object} attributes Block attributes.
 * @return {Object} Modified props including classes.
 */
export function addHideMobileClassOnSave( extraProps, blockType, attributes ) {
	const { hideOnMobile, hideOnDesktop } = attributes || {};

	if ( ! hideOnMobile && ! hideOnDesktop ) {
		return extraProps;
	}

	const classes = ( extraProps.className || '' )
		.split( ' ' )
		.filter( Boolean );

	if ( hideOnMobile && ! classes.includes( 'hide-mobile' ) ) {
		classes.push( 'hide-mobile' );
	}

	if ( hideOnDesktop && ! classes.includes( 'hide-desktop' ) ) {
		classes.push( 'hide-desktop' );
	}

	return { ...extraProps, className: classes.join( ' ' ) };
}

export function registerSaveFilters() {
	addFilter(
		'blocks.getSaveContent.extraProps',
		'hbom/add-hide-mobile-class-on-save',
		addHideMobileClassOnSave
	);
}
