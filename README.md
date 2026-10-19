# Mightora Architecture Modeller

A free architecture editor for GitHub Pages, standalone offline HTML and VS Code. Technical components, business processes and stakeholders share one portable model. Word and PowerPoint exports run locally without accounts, AI services or a conversion backend.

[Open the modeller](https://architecture-modeller.mightora.io/) · [User guide](docs/user-guide.md) · [First model](docs/first-model.md) · [VS Code](docs/vscode.md) · [MIT licence](LICENSE)

## Quick start

1. Open the website or download the standalone HTML from **Downloads**.
2. Choose **Create your first model** or load an editable example.
3. Add components, nested detail, dependencies, business processes and stakeholders.
4. Use **Documentation** to capture purpose, ownership, security and operational information. Use **ADRs** for decisions.
5. Choose a perspective and **Save view**. All views reference the same entity identities.
6. **Validate**, resolve findings, and **Save model** as `.archmodel.json`.
7. Use **Export to Word** or **Export to PowerPoint** at any time. **Export options** adds scope, templates, branding and documentation sections.

## Development

Requires Node.js 22+ and Python 3.10+. Core runtime libraries are bundled in `assets/` with their notices; npm dependencies are development tools.

```sh
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci
npm run typecheck
npm run lint
npm test
npm run build:offline
npx playwright install --with-deps chromium
npm run test:e2e
npm run test:vscode-web
```

`npm run build` also refreshes the existing shared Mightora footer, styles and component snapshot. `build:offline` builds reproducibly from checked-in shared assets. Both produce `dist/index.html`, standalone HTML, offline/source ZIPs, a VSIX, licence and build metadata. The production site remains static on GitHub Pages; no Worker or backend is introduced.

The VS Code Web test downloads an official VS Code Stable build and uses a real browser extension host and virtual file provider. It checks custom-editor opening, edits, native saves, diagnostics, commands and actual Office files saved through `workspace.fs`. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when using an existing Chromium binary.

## Shared implementation

| Location | Responsibility |
| --- | --- |
| `packages/schema` | Strict TypeScript domain types, v1-to-v2 migration, safe links, import guards, canonical JSON |
| `packages/core` | Semantic differences, impact traversal, ADR Markdown, branch duplication |
| `packages/validation` | Configurable governance findings, severity and remediation |
| `packages/catalogue` | Nine templates and eight editable reusable patterns |
| `packages/renderer` | Alignment, distribution, snapping and routing helpers |
| `packages/storage` | IndexedDB model library and five recovery revisions |
| `packages/export` | Shared report sections, presets and export options |
| `src/core.js`, `dimensions.js` | Existing graph engine, hierarchy, projections and layout, extended for schema v2 |
| `src/office.js` | Browser OOXML Word generation and PptxGenJS native PowerPoint shapes/connectors |
| `src/app.js`, `platform-ui.js` | Shared canvas/editor interface used by all editions |
| `vscode-extension/src/extension.ts` | Strict TypeScript Custom Text Editor adapter and VS Code APIs |
| `tools/cli` | Schema/governance validation and semantic comparison for Git/CI |

The existing renderer and Office writer remain JavaScript to preserve working features. New domain packages and the extension host compile with TypeScript `strict` and `noUncheckedIndexedAccess`; a complete TypeScript conversion of the retained renderer is not claimed.

## Portable models

Schema v2 preserves older JSON/YAML models through migration. IDs and exact relationship endpoints remain stable across hierarchy and viewpoint changes. Logical entities are separate from layout positions. The canonical JSON exporter sorts object keys and unordered entity collections for useful Git diffs. See [model format](MODEL_FORMAT.md).

Local storage recovers the active website model after refresh. IndexedDB additionally holds multiple models and five earlier revisions. File-system save APIs are used where supported; other browsers download a model file. VS Code delegates saves and exports to the host file provider. Browser storage is not a substitute for exported backups.

## Office exports

Word files contain native headings, paragraphs, repeatable table headers, document properties, header/footer, page numbers and a Word TOC field. Diagrams are SVG with PNG fallback, not editable Word shapes. Update the TOC field in Word to populate page numbers.

PowerPoint uses editable shapes, text and attached native connectors. Product icons remain images. Large diagrams are split into detail slides/pages. Full-model packs include catalogues, exact dependencies, process/stakeholder mappings, risks, decisions and governance findings so collapsed or cross-page information remains documented. See [Word](docs/word-export.md) and [PowerPoint](docs/powerpoint-export.md).

## Governance in pull requests

```sh
npm run compile
node tools/cli/architecture.cjs validate docs/examples/simple.archmodel.json
node tools/cli/architecture.cjs validate model.archmodel.json --json
node tools/cli/architecture.cjs validate model.archmodel.json --sarif
node tools/cli/architecture.cjs diff before.archmodel.json after.archmodel.json --json
```

Exit codes: `0` valid/no policy errors, `1` governance errors or policy-defined breaking changes, `2` malformed input/usage. Warnings do not fail a command. The reusable workflow defaults to reporting; enforcement is opt-in. See [validation and GitHub integration](docs/validation.md).

## Branding and privacy

The online edition retains the full Mightora logo, shared header, author and footer, footer YAML workaround, real workflow/source/licence badges and existing online-only Cloudflare Web Analytics beacon. Model contents are not uploaded. Offline and VS Code editions embed their dependencies and block app network connections. External links navigate only when selected. The Network Transparency section explains the request monitor's limits and Developer Tools checks.

Vendor icons retain their original rights and usage terms. See [third-party notices](THIRD-PARTY-NOTICES.md), [catalogue guide](docs/catalogue.md) and [security/privacy](docs/security.md). An MIT licence for this code does not relicense Microsoft or AWS artwork.

## Documentation and verification

[Documentation index](docs/README.md) · [Developer architecture](docs/architecture.md) · [Deployment](docs/deployment.md) · [Troubleshooting and limitations](docs/limitations.md) · [Release verification](docs/verification.md).

Automated tests generate real DOCX/PPTX ZIPs, inspect OOXML and model coverage, round-trip older and new models, exercise browser downloads, and test a 500-component/1,000-relationship model. Export samples have also been rendered for layout review; this does not imply testing in Microsoft Office itself. Release-specific results and limitations belong in `docs/verification.md`, not fabricated badges.
