# Third-party assets

- Mightora shared UI CSS, header/footer/author components and footer content: https://github.com/mightora/shared-ui. The online edition loads the official CDN URLs prescribed by the design system. The offline edition embeds a CSS snapshot fetched from the main branch on 17 October 2026, plus equivalent local header/author/footer markup. The full Mightora logo is retained for branding.
- Logo source: https://raw.githubusercontent.com/mightora/mightora.io/main/static/images/mightoraIoLogo4-200x900.png. The bundled image is the 900 × 200 full Mightora wordmark.
- YAML parser: js-yaml 4.1.0, Copyright Vitaly Puzrin and contributors, MIT licence, https://github.com/nodeca/js-yaml. Bundled in the online, offline and VS Code editions.

All graph rendering, modelling, examples, application code and export logic in `src/` were implemented for this application. Icons are bundled static assets. The public website embeds Cloudflare Web Analytics; offline and VS Code editions omit it and block outbound application connections.

Updated export edition dependencies, embedded locally in both editions:

- js-yaml 4.1.0, MIT, Vitaly Puzrin and contributors: https://github.com/nodeca/js-yaml. Full licence: assets/JS-YAML-LICENSE.txt.
- JSZip 3.10.1, dual MIT/GPLv3; used under MIT. Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso and contributors. https://github.com/Stuk/jszip. Licence: assets/JSZIP-LICENSE.txt.
- PptxGenJS 4.0.1, MIT, Brent Ely and contributors: https://github.com/gitbrent/PptxGenJS. Its browser bundle includes JSZip and polyfills. Licence: assets/PPTXGENJS-LICENSE.txt. Generated decks use native editable Office shapes and attached connectors.
- Microsoft Power Platform: eight SVGs from the official Power-Platform-icons-scalable.zip linked at https://learn.microsoft.com/en-us/power-platform/guidance/icons. Microsoft permits architectural diagrams, training materials and documentation; copying, distribution and display are limited to those permitted uses unless separately authorised. Microsoft reserves other rights, including trademark rights.
- Microsoft Azure: eleven SVGs from the official Azure_Public_Service_Icons_V24.zip linked at https://learn.microsoft.com/en-us/azure/architecture/icons/. Limited architecture, training and documentation uses apply. Do not crop, rotate, recolour, distort or use product artwork as your own brand.
- AWS Architecture Icons: fourteen service SVGs from the official Icon-package_07312026 release linked at https://aws.amazon.com/architecture/icons/. AWS provides these assets for architecture diagrams and related technical materials; AWS and its licensors retain intellectual-property and trademark rights.
- Lucide: ten general architecture symbols from https://github.com/lucide-icons/lucide. ISC, with MIT notices for symbols derived from Feather. Full copyright and licence text: assets/LUCIDE-LICENSE.txt, embedded in the app and carried in exports using these symbols. Terms: https://lucide.dev/license.
- Power BI (archived): the retained Power-BI.svg from https://github.com/microsoft/PowerBI-Icons. Microsoft and contributors, CC BY 4.0: https://creativecommons.org/licenses/by/4.0/legalcode. Microsoft trademark rights are retained.

assets/icon-catalog.json records each icon's collection, terms URL, source archive or original URL, member path and SHA-256 of the unchanged SVG. PNG fallbacks preserve proportions. The curated 44-icon set is a subset of the source collections. scripts/import-icon-packs.py and scripts/rasterize-icons.cjs document acquisition and conversion. Normal builds use committed assets without contacting icon providers. The code licence does not replace asset terms; inclusion does not imply vendor endorsement.

Brand assets remain Mightora's branding; the MIT licence does not grant trademark rights or imply endorsement of third-party modifications.
