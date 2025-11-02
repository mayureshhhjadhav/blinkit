# Blinkit Gourmet Store Wireframe

This repository contains two deliverables for the Blinkit Gourmet Store concept:

1. **A polished high-fidelity wireframe** implemented as a responsive web mock-up (`web/`).
2. **A Figma automation plugin** (`figma-plugin/`) that generates the same layout directly inside Figma so the design team can continue iterating natively.

## Web prototype

The static site under `web/` mirrors the new Gourmet Store landing experience, including the dedicated navigation icon and all merchandising grids described in the brief.

### Preview locally

```bash
cd web
python -m http.server 8000
```

Then open http://localhost:8000 in your browser to explore the layout.

The design uses subtle linen and olive tones, luxury typography, and photography sourced from Unsplash and official brand assets to convey a premium quick-commerce experience.

## Figma plugin

The plugin automates the creation of the Gourmet Store frame with hero, navigation, and all category grids. It downloads imagery from the internet at runtime so the design remains fully editable once generated.

### Install steps

1. In Figma, go to **Plugins → Development → New Plugin… → Link existing plugin**.
2. Choose the `figma-plugin/manifest.json` file from this repository.
3. Run **Plugins → Development → Blinkit Gourmet Store Wireframe**.
4. A ready-to-edit frame named “Blinkit Gourmet Store Landing” will appear on the current page.

All components are Auto Layout–ready, so swapping imagery or editing labels is frictionless.

## Assets and attribution

- Category and lifestyle imagery: Unsplash (royalty-free, credited via original URLs in the source).
- Brand marks: public assets from official brand sites or Wikimedia Commons, used here for concept illustration only.

Feel free to replace any asset URLs with internal CDNs when moving toward production.
