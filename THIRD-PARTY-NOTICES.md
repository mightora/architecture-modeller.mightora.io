# Third-party assets

- Mightora shared UI CSS, header/footer/author components and footer content: https://github.com/mightora/shared-ui. The online edition loads the official CDN URLs prescribed by the design system. The offline edition embeds a CSS snapshot fetched from the main branch on 17 October 2026, plus equivalent local header/author/footer markup. The full Mightora logo is retained for branding.
- Logo source: https://raw.githubusercontent.com/mightora/mightora.io/main/static/images/mightoraIoLogo4-200x900.png. The bundled image is the 900 × 200 full Mightora wordmark.
- Online YAML parser: js-yaml 4.1.0, Copyright Vitaly Puzrin and contributors, MIT licence, https://github.com/nodeca/js-yaml. It is not used by the offline edition.

All graph rendering, modelling, examples, application code and export logic in `src/` were implemented for this application. No diagramming library, icon library, analytics or web font is required.

Updated export edition dependencies, embedded locally in both editions:

- js-yaml 4.1.0, MIT, Vitaly Puzrin and contributors: https://github.com/nodeca/js-yaml. Full licence: assets/JS-YAML-LICENSE.txt.
- JSZip 3.10.1, dual MIT/GPLv3; used under MIT. Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso and contributors. https://github.com/Stuk/jszip. Licence: assets/JSZIP-LICENSE.txt.
- PptxGenJS 4.0.1, MIT, Brent Ely and contributors: https://github.com/gitbrent/PptxGenJS. Its browser bundle includes JSZip and polyfills. Licence: assets/PPTXGENJS-LICENSE.txt. Generated decks use native editable Office shapes and attached connectors.
- Five product SVGs from the official archived Microsoft PowerBI-Icons repository: https://github.com/microsoft/PowerBI-Icons. Microsoft and contributors, content under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/legalcode. Power Apps (Power-Apps-Colored.svg), Power Automate (Power-Automate-Colored.svg), Dataverse (Dataverse-Colored.svg), Power Pages (Power-Pages.svg), Power BI (Power-BI.svg). Original SVGs are unchanged. PNG fallbacks are raster conversions preserving proportions. Their versions may differ from current product branding. Architecture-use guidance: https://learn.microsoft.com/en-us/power-platform/guidance/icons. Microsoft reserves trademark rights; these assets are not relicensed under the app’s MIT licence.

Brand assets remain Mightora's branding; the MIT licence does not grant trademark rights or imply endorsement of third-party modifications.
