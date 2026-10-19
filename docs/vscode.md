# VS Code installation and publishing

The extension uses the same editor, model format, schema, governance and Office engine as the website. `browser` and `main` point to one browser-compatible CommonJS bundle; `vscode` is its only external module. Local files use supported file-provider APIs, including virtual workspaces.

## Private installation

Build with `npm run build:offline`. The generated package is `dist/downloads/mightora-architecture-modeller-0.6.0.vsix`.

Desktop VS Code: Extensions → More actions → Install from VSIX. Select the file. Open a `.archmodel.json` or legacy `.architecture.json`/YAML file. If it opens as text, right-click the tab → Reopen Editor With → Mightora Architecture Modeller.

VS Code Web: use Install from VSIX when the host offers it, or install a published web-compatible Marketplace extension. Host policies can restrict private VSIX installation. `github.dev` and browser Codespaces use the web extension host when available; writable file-provider permissions and host extension policies apply. No Node filesystem or local process is needed.

## Commands

All commands use the **Architecture Modeller:** prefix:

- Create New Model and Open Visual Editor.
- Validate Architecture and Select Viewpoint.
- Export to Word, Export to PowerPoint and Generate Documentation.
- Compare Models and Create Architecture Decision Record.
- Search Components and Reveal Component.

Explorer contains an Architecture Outline with clickable master entities. The editor's inspector changes properties/documentation. Problems links to governance findings in source text. Source links open web URLs or matching workspace files with an optional line number. Native save/Save As and undo/redo operate on the model TextDocument.

Office exports ask VS Code for a destination and write bytes through `workspace.fs`. They do not depend on an iframe browser download. Cancelling the picker writes nothing. Conflicting external edits are not overwritten silently; preserve canvas JSON before reopening.

## Package verification

```sh
npm ci
npm run typecheck
npm run build:offline
python3 scripts/verify-vsix.py
npx playwright install --with-deps chromium
npm run test:vscode-web
```

The Python packager creates a genuine VSIX with manifest, web-discovery metadata, browser entry, embedded editor, logo, README, changelog and licence. `vsix-release.yml` produces a downloadable artifact from a tag or manual run. It does not publish.

## Visual Studio Marketplace

1. Create or confirm the `mightoraio` publisher at https://marketplace.visualstudio.com/manage. Publisher ownership has not been assumed or verified by the code.
2. Review display name, version, description, licence, branding, screenshots and README in `vscode-extension/`.
3. Build and run the package and host tests above. Check `docs/verification.md` for any platform tests still outstanding.
4. Upload the generated VSIX in the publisher's web portal. This avoids putting a publishing credential into repository files.
5. Alternatively, use a current `@vscode/vsce` and `vsce login mightoraio`, then package/publish from `vscode-extension`. The root dev dependency supplies the CLI. Keep credentials in the credential store or protected CI secrets, never client-side assets.
6. Inspect the published listing and test installation in Desktop, vscode.dev, github.dev and Codespaces. A built VSIX does not imply Marketplace publication or service-specific installation verification.

Official guidance: https://code.visualstudio.com/api/working-with-extensions/publishing-extension and https://code.visualstudio.com/api/extension-guides/web-extensions.
