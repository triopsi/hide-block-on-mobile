# Localization Instructions

## Current Status
The plugin is now in English by default and ready for translation.

## Text Domain
The plugin uses the text domain: `hide-block-on-mobile`

## Translatable Strings
All user-facing strings use WordPress i18n functions:
- "Responsive" - Panel title
- "Hide on mobile" - Toggle label
- "Hides this block on mobile devices (max-width: 768px)." - Help text

## How to Add Translations

### 1. Create the languages directory
```bash
mkdir -p languages
```

### 2. Generate POT file
Use WP-CLI or a tool like Poedit to generate the translation template:

```bash
wp i18n make-pot . languages/hide-block-on-mobile.pot --domain=hide-block-on-mobile
```

Or use the npm package:
```bash
npm install --save-dev @wordpress/i18n
npx wp-i18n make-pot . languages/hide-block-on-mobile.pot --domain=hide-block-on-mobile
```

### 3. Create language-specific .po files
For German (de_DE):
```bash
# Copy the .pot file
cp languages/hide-block-on-mobile.pot languages/hide-block-on-mobile-de_DE.po

# Edit with Poedit or text editor
# Add translations for each msgid
```

### 4. Generate .mo files
```bash
msgfmt languages/hide-block-on-mobile-de_DE.po -o languages/hide-block-on-mobile-de_DE.mo
```

### 5. For JavaScript translations
WordPress automatically handles JavaScript translations when you have:
- `.po` and `.mo` files in the `languages/` folder
- `wp_set_script_translations()` called in PHP (already configured)

WordPress will automatically generate `.json` files for JavaScript translations.

## Example German Translation

Create `languages/hide-block-on-mobile-de_DE.po`:
```
msgid "Responsive"
msgstr "Responsiv"

msgid "Hide on mobile"
msgstr "Auf Mobilgeräten ausblenden"

msgid "Hides this block on mobile devices (max-width: 768px)."
msgstr "Blendet diesen Block auf Mobilgeräten aus (max-width: 768px)."
```

## Alternative: Use Loco Translate Plugin
1. Install "Loco Translate" plugin in WordPress
2. Go to Loco Translate → Plugins → Hide Block On Mobile
3. Add translations through the UI
4. Export .po/.mo files

## Note
After adding translation files, clear WordPress cache and reload the editor to see changes.
