import { addFilter } from '@wordpress/hooks';

/**
 * Beim Speichern `hide-mobile` zur className hinzufügen (Frontend-Markup)
 */
export function addHideMobileClassOnSave(extraProps, blockType, attributes) {
	if (!attributes?.hideOnMobile) return extraProps;

	const classes = (extraProps.className || '').split(' ').filter(Boolean);
	if (!classes.includes('hide-mobile')) classes.push('hide-mobile');

	return { ...extraProps, className: classes.join(' ') };
}

export function registerSaveFilters() {
	addFilter(
		'blocks.getSaveContent.extraProps',
		'hbom/add-hide-mobile-class-on-save',
		addHideMobileClassOnSave
	);
}
