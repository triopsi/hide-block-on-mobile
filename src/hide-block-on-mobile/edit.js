import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Toggle im Inspector (Sidebar) hinzufügen
 */
export const withHideOnMobileToggle = createHigherOrderComponent(
	(BlockEdit) =>
		(props) => {
			const { attributes, setAttributes } = props;
			const { hideOnMobile } = attributes;

			return (
				<Fragment>
					<BlockEdit {...props} />
					<InspectorControls>
						<PanelBody title={__('Responsive', 'hide-block-on-mobile')} initialOpen={true}>
							<ToggleControl
								label={__('Hide on mobile', 'hide-block-on-mobile')}
								checked={!!hideOnMobile}
								onChange={(value) =>
									setAttributes({ hideOnMobile: !!value })
								}
								help={__('Hides this block on mobile devices (max-width: 768px).', 'hide-block-on-mobile')}
							/>
						</PanelBody>
					</InspectorControls>
				</Fragment>
			);
		},
	'withHideOnMobileToggle'
);

/**
 * Klasse im Editor DOM hinzufügen, damit man es direkt sieht (optional aber sinnvoll)
 */
export const withHideMobileClassInEditor = createHigherOrderComponent(
	(BlockListBlock) =>
		(props) => {
			if (!props?.attributes?.hideOnMobile) {
				return <BlockListBlock {...props} />;
			}

			const className = [props.className, 'hide-mobile']
				.filter(Boolean)
				.join(' ');

			return <BlockListBlock {...props} className={className} />;
		},
	'withHideMobileClassInEditor'
);

export function registerEditorFilters() {
	addFilter(
		'editor.BlockEdit',
		'hbom/with-hide-on-mobile-toggle',
		withHideOnMobileToggle
	);

	addFilter(
		'editor.BlockListBlock',
		'hbom/with-hide-mobile-class-in-editor',
		withHideMobileClassInEditor
	);
}
