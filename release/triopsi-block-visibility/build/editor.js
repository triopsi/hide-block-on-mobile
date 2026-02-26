(function(hooks, compose, blockEditor, components, element, i18n) {
  "use strict";
  const withHideOnMobileToggle = compose.createHigherOrderComponent(
    (BlockEdit) => (props) => {
      const { attributes, setAttributes } = props;
      const { hideOnMobile, hideOnDesktop, centerOnMobile } = attributes;
      return /* @__PURE__ */ wp.element.createElement(element.Fragment, null, /* @__PURE__ */ wp.element.createElement(BlockEdit, { ...props }), /* @__PURE__ */ wp.element.createElement(blockEditor.InspectorControls, null, /* @__PURE__ */ wp.element.createElement(
        components.PanelBody,
        {
          title: i18n.__("Responsive", "triopsi-block-visibility"),
          initialOpen: true
        },
        /* @__PURE__ */ wp.element.createElement(
          components.ToggleControl,
          {
            label: i18n.__(
              "Hide on mobile",
              "triopsi-block-visibility"
            ),
            checked: !!hideOnMobile,
            onChange: (value) => setAttributes({ hideOnMobile: !!value }),
            help: i18n.__(
              "Hides this block on mobile devices (max-width: 768px).",
              "triopsi-block-visibility"
            )
          }
        ),
        /* @__PURE__ */ wp.element.createElement(
          components.ToggleControl,
          {
            label: i18n.__(
              "Hide on desktop",
              "triopsi-block-visibility"
            ),
            checked: !!hideOnDesktop,
            onChange: (value) => setAttributes({ hideOnDesktop: !!value }),
            help: i18n.__(
              "Hides this block on desktop devices (min-width: 769px).",
              "triopsi-block-visibility"
            )
          }
        ),
        /* @__PURE__ */ wp.element.createElement(
          components.ToggleControl,
          {
            label: i18n.__(
              "Center on mobile",
              "triopsi-block-visibility"
            ),
            checked: !!centerOnMobile,
            onChange: (value) => setAttributes({ centerOnMobile: !!value }),
            help: i18n.__(
              "Centers this block on mobile devices (max-width: 768px).",
              "triopsi-block-visibility"
            )
          }
        )
      )));
    },
    "withHideOnMobileToggle"
  );
  const withHideMobileClassInEditor = compose.createHigherOrderComponent(
    (BlockListBlock) => (props) => {
      const { hideOnMobile, hideOnDesktop, centerOnMobile } = (props == null ? void 0 : props.attributes) || {};
      if (!hideOnMobile && !hideOnDesktop && !centerOnMobile) {
        return /* @__PURE__ */ wp.element.createElement(BlockListBlock, { ...props });
      }
      const classes = [props.className];
      if (hideOnMobile) {
        classes.push("hide-mobile");
      }
      if (hideOnDesktop) {
        classes.push("hide-desktop");
      }
      if (centerOnMobile) {
        classes.push("center-mobile");
      }
      const className = classes.filter(Boolean).join(" ");
      return /* @__PURE__ */ wp.element.createElement(BlockListBlock, { ...props, className });
    },
    "withHideMobileClassInEditor"
  );
  function registerEditorFilters() {
    hooks.addFilter(
      "editor.BlockEdit",
      "trblvi/with-triopsi-block-visibility-toggle",
      withHideOnMobileToggle
    );
    hooks.addFilter(
      "editor.BlockListBlock",
      "trblvi/with-hide-mobile-class-in-editor",
      withHideMobileClassInEditor
    );
  }
  function addHideMobileClassOnSave(extraProps, blockType, attributes) {
    const { hideOnMobile, hideOnDesktop, centerOnMobile } = attributes || {};
    if (!hideOnMobile && !hideOnDesktop && !centerOnMobile) {
      return extraProps;
    }
    const classes = (extraProps.className || "").split(" ").filter(Boolean);
    if (hideOnMobile && !classes.includes("hide-mobile")) {
      classes.push("hide-mobile");
    }
    if (hideOnDesktop && !classes.includes("hide-desktop")) {
      classes.push("hide-desktop");
    }
    if (centerOnMobile && !classes.includes("center-mobile")) {
      classes.push("center-mobile");
    }
    return { ...extraProps, className: classes.join(" ") };
  }
  function registerSaveFilters() {
    hooks.addFilter(
      "blocks.getSaveContent.extraProps",
      "trblvi/add-hide-mobile-class-on-save",
      addHideMobileClassOnSave
    );
  }
  function addHideOnMobileAttribute(settings, name) {
    const excluded = /* @__PURE__ */ new Set(["core/block"]);
    if (excluded.has(name)) {
      return settings;
    }
    return {
      ...settings,
      attributes: {
        ...settings.attributes,
        hideOnMobile: { type: "boolean", default: false },
        hideOnDesktop: { type: "boolean", default: false },
        centerOnMobile: { type: "boolean", default: false }
      }
    };
  }
  hooks.addFilter(
    "blocks.registerBlockType",
    "trblvi/add-triopsi-block-visibility-attribute",
    addHideOnMobileAttribute
  );
  registerEditorFilters();
  registerSaveFilters();
})(wp.hooks, wp.compose, wp.blockEditor, wp.components, wp.element, wp.i18n);
