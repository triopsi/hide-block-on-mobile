

# Hide Block On Mobile

A WordPress plugin that adds responsive visibility controls to the block inspector, allowing you to hide any Gutenberg block on mobile or desktop devices.

<p align="center">
  <img src="gutenberg-editor-settings-block.png" alt="Gutenberg Editor Screenshot">
</p>

## Description

This plugin extends the WordPress block editor (Gutenberg) by adding a "Responsive" panel to every block's settings sidebar. Control the visibility of your blocks across different devices:

- **Hide on mobile**: Adds the `hide-mobile` CSS class - hides blocks on screens smaller than 768px
- **Hide on desktop**: Adds the `hide-desktop` CSS class - hides blocks on screens larger than 768px

**Features:**
- Works with all Gutenberg blocks (core and third-party)
- Two independent toggle controls in the block inspector
- Adds CSS classes automatically
- Visual indicators in the editor when blocks are hidden
- Both options can be used simultaneously if needed
- No configuration needed - activate and use

## Installation

### Manual Installation

1. Download the plugin files or clone this repository
2. Upload the `hide-block-on-mobile` folder to `/wp-content/plugins/`
3. Run `npm install` in the plugin directory
4. Run `npm run build` to compile the assets
5. Activate the plugin through the 'Plugins' menu in WordPress
6. Edit any post or page with the block editor
7. Select a block and look for the "Responsive" panel in the right sidebar

## Usage

1. Open the WordPress block editor (Gutenberg)
2. Select any block you want to control
3. In the right sidebar, find the "Responsive" panel
4. Toggle "Hide on mobile" to hide the block on mobile devices (max-width: 768px)
5. Toggle "Hide on desktop" to hide the block on desktop devices (min-width: 769px)
6. You can enable both options if you want to hide the block everywhere (useful for draft content)

**Editor Visual Indicators:**
- Blocks with "Hide on mobile" show a black dashed outline with a label
- Blocks with "Hide on desktop" show a blue dashed outline with a label
- Blocks with both options show a purple dashed outline with a combined label

## Development

Build the plugin:
```bash
npm install
npm run build
```

Watch mode for development:
```bash
npm run start
```

## License

This plugin is licensed under the GPL v2 or later.

```
Hide Block On Mobile
Copyright (C) 2026

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
```

## Requirements

- WordPress 6.8 or higher
- PHP 7.4 or higher
- Node.js and npm (for development)

## Screenshot
<img src="screenshot-1.png" alt="Gutenberg Editor Screenshot 2">