# Troubleshooting and known limitations

## Save, recovery and conflicts

If browser storage fails, export JSON immediately; model edits remain in memory. Keep a file backup before clearing browser data. IndexedDB/file URL support varies by browser. Recovery revisions are capped at five per saved model. This is a single-user editor; concurrent tabs do not merge changes.

VS Code reports expected-version conflicts without overwriting external/native changes. Export canvas JSON for recovery, fix/reopen the document and import the required changes. Read-only virtual workspaces can display models but cannot save; choose a writable file provider/destination. Browser extensions must be installed through a supported web extension mechanism.

## Diagrams

Large focused/collapsed views are easier to read than one expanded enterprise graph. Canvas labels may shorten long names while catalogues retain full text. The layout is deterministic grid/band layout, not a complete constraint solver. Alignment guides and snap assist manual arrangement. Orthogonal/manual routing is available, but arbitrary obstacle avoidance is not guaranteed. Swimlanes, process decisions and security zones are descriptive, not formal BPMN/ArchiMate execution or compliance models.

Ungroup moves children out while retaining the group entity for explicit removal; automatically deleting the group would lose its documentation/relationships. PowerPoint shapes are not exported as arbitrary native grouped objects. Office routing can simplify manual canvas paths. Word diagrams are embedded images, not editable Word shapes.

## Exports

If a generation error appears, the model is unchanged. Save JSON and try fewer views/sections. The extension limits an individual export message to 25 MB. Full packs can be long; select an executive preset or smaller scope. Update Word's TOC field manually where a reader does not calculate it automatically.

Fonts are requested by name. Readers lacking the font will substitute. No guarantee is made for every Microsoft Office/LibreOffice/mobile version. OOXML, rendering and supported-host tests are listed in [verification](verification.md); successful ZIP checks alone do not prove layout quality.

Large Office generation currently runs on the browser main thread and can pause interaction. There is progress/error feedback, partitioned diagrams, bounded import size and local recovery; worker-based export and full viewport culling remain future improvements. A 500/1,000 benchmark is representative evidence, not a device-independent latency promise.

## Scope limits

The retained renderer/Office writer are JavaScript; strict TypeScript covers new domain packages and the extension host. Terraform/Bicep discovery is not implemented; optional discovery currently supports OpenAPI, package manifests and Docker Compose. It imports reviewed components without claiming authoritative dependency inference.

Microsoft/AWS artwork retains provider terms. Generic alternatives are available. Custom arbitrary SVG import is intentionally unsupported.

Actual vscode.dev, github.dev and Codespaces account/installation journeys require the extension to be installed in those services. A real VS Code Web test host exercises equivalent browser APIs, but service-specific Marketplace installation is not the same test. Marketplace publishing remains a maintainer action. Desktop verification status is recorded separately.
