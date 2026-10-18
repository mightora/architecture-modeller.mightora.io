# Mightora Architecture Modeller

One connected model, from platform boundaries to individual components. A dependency-free static single-page application under the Mightora brand.

## Run it

Open `offline/index.html` directly if using the source download. The standalone edition requires no installation, internet connection, account or server. On touch devices, select a component and choose **Explore inside**.

For development: Node.js 20+ and Python 3.10+ are sufficient; there are no npm dependencies.

```sh
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. `dist/` is ready for GitHub Pages or any static host. Deploy at any base path; application resources and downloads use relative URLs.

## What works

- Nested components with stable IDs and a single parent, independent of type.
- Double-click / Enter / Explore inside drill-down with breadcrumbs and external context.
- Expand several branches to different levels on the same canvas.
- Directed relationships between components at any level, including parent-level and deep endpoints.
- View projection rolls hidden endpoints up to visible ancestors, groups links by direction and type, and preserves their exact endpoints.
- Custom component types, colours, shapes and named text properties.
- Custom relationship types with solid/dashed lines and optional allowed endpoint types.
- Move components to a different parent through Edit; incident relationships keep their IDs.
- Graph pan, zoom, fit, deterministic grid layout, draggable positions and 30-step undo/redo.
- Incoming and outgoing traversal of explicit links, with cycle-safe tracing.
- Browser-local autosave with error feedback; JSON import/export; current focused view SVG; all relationships CSV.
- Included Power Platform / Azure and online-shop examples.
- An offline HTML and ZIP generated from the same source; network transparency and restrictive offline CSP.
- Branded header, author, footer, sticky navigation and responsive editor.

## Multiple dimensions (0.3)

Choose a perspective: solution architecture, business processes, stakeholder responsibilities, application layers, business traceability or all entities. These are projections of one model, not separate diagrams. Save each perspective and its scope as a named view, then select and reorder views for a single Word or PowerPoint pack.

Add processes, nested steps and stakeholders from the toolbar. Business mappings adds component → process support, stakeholder → process participation with optional RACI roles, and process → process sequence links. Edit mappings from the mapping list or the normal relationship editor. Responsibilities can be attached to a whole process or an exact step; no ownership is implicitly inherited. RACI assignments are descriptive, not automatically enforced (for example, multiple accountable stakeholders are permitted).

Application layers are user-defined, ordered records with names, definitions and colours. Edit a component to assign its primary layer and optional additional layers. Containment and layer membership are independent: moving a component does not change its layers. Layer views flatten the component hierarchy and show each component once, in its primary layer, or in the first matching layer when scoped. Unassigned components have their own band. Deleting a layer only detaches its memberships; it does not delete components.

Scope can filter business views to a process and its steps, and components to an application layer. The process view includes supporting components as external context; switch that off in View filters. Traceability includes the supporting components and stakeholders for the selected process scope. Saved views, JSON/YAML and Office reports retain these dimensions. Word tables include entity categories, layer memberships and exact RACI roles. PowerPoint layer bands are native editable shapes; notes retain roles, layer definitions and memberships.

Load the “Business processes, stakeholders and layers” example to explore all dimensions. Existing model files remain compatible: entities without a category are treated as components, and old saved views use the solution perspective. This is lightweight process mapping, not a BPMN execution or conformance engine.

## Model storage and privacy

The active model is saved to localStorage on changes. There is one model per browser origin. Export JSON to maintain separate models, transfer between devices or retain a durable backup. The offline file's storage behaviour depends on the browser; exported JSON is the portable source of truth. Import and model replacement can be undone during the open session.

No models are uploaded. Online branding uses the official shared stylesheet and components on jsDelivr, the Mightora logo on GitHub, and shared footer content. YAML and Office libraries are bundled locally. The offline edition embeds all processing and branding resources. Its CSP blocks application connections; following an external link is an explicit navigation.

To inspect traffic: F12 → Developer Tools → Network → Preserve log → reload. On macOS use Option-Command-I if appropriate. The resource-timing panel is a convenience summary with browser and cross-origin limitations, not an audit.

## Verification and limitations

`npm run build` runs the model-engine tests and JavaScript syntax checks, validates offline resource embedding and CSP, and confirms that the offline ZIP contains the current HTML. It writes an honest `dist/verification.json` report. Browser interaction and responsive visual QA were not run in the creation environment because the supported browser-control skill was unavailable. Test direct file opening, touch double-click / Explore controls, scrolling/sticky offsets, mobile menus, keyboard controls and actual network requests in your target browsers before a public release.

The accepted model limits are 3,000 components, 10,000 links, 64 levels, 50 types of each kind, 16 custom fields per type, and a 5 MB import. These are validation limits, not measured performance promises. The renderer uses a grid layout and cubic links, not obstacle-avoiding routing. Dragging cannot reparent components; use Edit → Inside / parent. Component types use block shapes, with a cylinder glyph for data stores. Trace follows explicit links and does not infer dependencies from containment. SVG captures the focused expanded view; it is not a round-trip model format.

This is an independent modeller, not an implementation of the ArchiMate specification or exchange format. No accounts, collaboration, server storage, automatic cloud discovery or proprietary-file import are included.

## Text formats, named views and Office packs

Import JSON, YAML (.yaml/.yml), or YAML-formatted .txt. Export JSON or human-readable YAML. Named views and icon references are included in both formats. YAML uses the JSON schema: custom tags and duplicate keys are rejected, and cycles, nesting, alias expansion and expanded size are bounded before validation.

Save view captures focus, expansion, explicit relationship-type filters, external context, positions and camera. Named views reference the current model and therefore reflect later component changes. Manage views sets their export order. Updating a named view is explicit; navigating and editing the canvas does not silently overwrite its saved snapshot. Up to 50 named views are supported. Component deletion resets a saved focus to overview when needed.

Export Office pack lets you select current and/or saved views. PowerPoint exports one selected view per slide using native blocks, text and attached DrawingML connectors. Icons are embedded PNGs. Exact relationships and full view descriptions are in speaker notes. Word exports embedded SVG diagrams with PNG fallbacks, plus editable descriptions and optional component/dependency tables; individual Word diagram shapes are not editable. Portrait and landscape Letter pages are available. All selected views are rendered at their full scope rather than cropped to the saved camera. Collapse or focus large views for readability; Office exports support up to 500 visible components per view.

The browser rasterizes Word’s PNG fallbacks locally with Canvas. PowerPoint generation uses bundled PptxGenJS 4.0.1; Office packaging uses bundled JSZip 3.10.1; YAML uses bundled js-yaml 4.1.0. No runtime installation or network request is needed by these features, including in the standalone HTML.

The curated icon picker contains five official icons from Microsoft’s archived PowerBI Icons repository. SVG originals and proportion-preserving PNG fallbacks are bundled. Archive provenance and CC BY 4.0 attribution are in the UI and export notes. Icons may differ from current product branding. Keep Microsoft architecture-use and trademark terms separate from the app’s MIT licence.

Tests include YAML round-trips and malicious-input rejection, view filters and stale references, self-contained SVG, editable PowerPoint shape/connectors and Word packaging. `scripts/export-fixtures.cjs ABSOLUTE_DIRECTORY` generates QA samples with the production exporter, using the primary runtime’s sharp library for the test-only PNG adapter.

## Publish the source and host on GitHub Pages

Source: https://github.com/mightora/architecture-modeller.mightora.io. The source ZIP is also inspectable and MIT licensed. Evidence links point to actual workflows.

1. Production hosting uses Cloudflare Pages: main branch, `npm run build`, output `dist`.
2. Optional GitHub Pages: enable **Pages → Source → GitHub Actions** and set repository variable `ENABLE_GITHUB_PAGES=true`.
3. The included `pages.yml` runs tests/build and uploads website, offline and extension artifacts on pushes to `main`. Cloudflare's Git integration deploys production automatically.
4. Enable CodeQL if required by the repository's visibility/plan. `codeql.yml` supplies JavaScript analysis; it has not been run locally.
5. Evidence links immediately above the footer point to the source, licence, real workflow runs and build verification report.

## VS Code web and desktop extension

See [the extension guide](vscode-extension/README.md) for using workspace JSON/YAML models, installing the VSIX and publishing to the Visual Studio Marketplace. `npm run build` creates all website, offline and VSIX outputs. `npm run build:offline` uses the committed footer snapshot. The extension uses a browser entry point and VS Code file providers; it has no Node filesystem dependency or telemetry.

## Shared footer and Cloudflare analytics

Every release build fetches `mightora/shared-ui/main/footer.yaml`, repairs tab indentation, validates sections and HTTPS links with the bundled YAML parser, and bundles it as `dist/footer.yaml`. The official shared component prefers this local snapshot before its CDN fallback. A failed refresh/validation fails the build; `verification.json` records the snapshot hash and counts.

The proxied custom domain uses the existing `mightora.io` zone's automatic Cloudflare Web Analytics injection. The website CSP allows the beacon script and its reporting endpoint. No second application snippet is added. Offline and extension CSPs block outbound connections. Analytics measures website use, not model contents. Filter Cloudflare Web Analytics by hostname `architecture-modeller.mightora.io`.

Dependabot is configured for weekly action updates. The runtime has no npm dependencies; external shared online assets follow the official Mightora runtime-CDN convention and remain supply-chain dependencies. The offline shared CSS snapshot is bundled, and its provenance is recorded in `THIRD-PARTY-NOTICES.md`.

## Maintenance

Edit files in `src/`, never the generated HTML. Run the build after every source change. Distribute the new online `dist/` and downloads together. `dist/downloads/mightora-architecture-modeller-source.zip` includes the full maintainable source, offline app, licence and workflows. `.openai/` hosting identity is deliberately omitted from the reusable source ZIP.

See `MODEL_FORMAT.md` for graph and projection semantics.
