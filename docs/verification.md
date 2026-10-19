# Release verification

Release 0.6.0 verification is tracked separately from feature implementation. CI artifacts contain commit-specific browser/extension results. Marketplace publication is not part of this release.

## Verified in the development environment

- 78 Node unit/integration tests pass, including the retained 56 tests and new schema, governance, ADR, pattern, comparison, CLI and export cases.
- Strict TypeScript (`strict`, `noUncheckedIndexedAccess`) and JavaScript syntax/dynamic-code lint pass.
- Website/offline Chromium acceptance journeys exercise real edits, nesting, relationships, processes, stakeholder/RACI mapping, view saving/switching, recovery, model round trips, governance corrections, ADRs, comparison, Word/PPTX downloads and responsive navigation.
- The first-run wizard and catalogue drag/multi-select/duplicate/group journey are included in the browser suite.
- A real official VS Code Stable browser extension host opens the custom editor, edits/saves through a virtual file provider, exposes commands/outline, publishes Problems diagnostics and writes real DOCX/PPTX exports through `workspace.fs`. Those files are reopened as ZIPs and checked for expected model content.
- Unit tests inspect native PowerPoint shapes and attached connector IDs. Word tests check editable content, SVG/PNG embedding, properties, TOC, headers, page numbers, classification, long/special-character labels, optional gaps, custom branding and empty models.
- Every XML part and internal relationship target is parsed/checked for generated edge-case Office packages.
- Representative complete Word/PowerPoint packs have been rendered and visually reviewed. Layout review led to explicit continuation slides and better table/page handling. This is not a claim that Microsoft Office itself was installed or manually tested.
- A 500-component/1,000-relationship model validates, renders, responds to search/zoom and exports all visible components. Observed Chromium canvas render time was about 0.1 seconds and semantic validation about 2–3 ms in this environment. Hardware/browser differences apply.
- The actual `file://` offline build makes no HTTP(S) requests while modelling and generating Office files. Its ZIP is checked byte-for-byte against the standalone HTML.
- VSIX structure, browser entry, bundled editor, commands, CSP and lack of Node filesystem imports are checked.
- `npm audit` reports no known dependency vulnerabilities at the time of the development check. CodeQL results must be read from the actual workflow.

## Release gates

The GitHub workflow reruns these checks from a clean install before deploying. A separate Desktop job uses official VS Code Stable under Xvfb and tests the custom editor, native file saving, diagnostics and both Office exports. The development container has no native display/Xvfb; Desktop results must be taken from that job, not inferred from the Web test.

Production deployment and the served build are checked after push. The workflow's `verification.json` records the actual commit and browser-host result. Review the relevant Actions run for final CI/deployment conclusions.

## Not claimed

- Marketplace publication, publisher ownership, or actual installation sessions in vscode.dev/github.dev/Codespaces accounts.
- A complete rewrite of legacy JavaScript rendering/export code into TypeScript.
- Formal BPMN/ArchiMate support, advanced obstacle avoidance, arbitrary native PowerPoint grouping, or editable Word diagram shapes.
- Main-thread-free Office generation, viewport culling, or a device-independent performance guarantee.
- Terraform/Bicep discovery or authoritative reverse engineering from source code.
- A security certification, comprehensive penetration test, or universal compatibility with all Office clients.

See [known limitations](limitations.md) and the [publishing guide](vscode.md) for precise remaining manual/platform work.
