# Mightora Architecture Modeller

Explore one architecture model from solution, business-process, stakeholder, application-layer and traceability perspectives. Drill into components, expand multiple levels, connect exact endpoints and export selected views to Word and PowerPoint.

The extension bundles the same application code as [the website](https://architecture-modeller.mightora.io/). It runs as a **web extension** in vscode.dev, github.dev and browser-based Codespaces, as well as desktop VS Code. No server, Node.js runtime or external website is needed while using the extension.

## Use it

1. Run **Mightora: New Architecture Model** or **Mightora: Open Architecture Model** from the Command Palette.
2. Use names such as `solution.architecture.json` or `solution.architecture.yaml` to open automatically in the modeller. Other JSON/YAML names work through the Open command or **Reopen Editor With → Mightora Architecture Modeller**.
3. Edit with the same hierarchy, mappings, layers and saved views as online. Changes update the workspace text document. Use **Ctrl+S / Cmd+S**, or VS Code Auto Save, to persist it. Source Control sees ordinary text changes.
4. Import and exports use VS Code file pickers. Word, PowerPoint, SVG, CSV and text model exports work locally. Word diagrams are images with editable report tables; PowerPoint shapes and connectors are editable.

VS Code owns file save, backup and native undo/redo. The modeller's Undo/Redo buttons handle changes in the current canvas session. Native document edits, revert or undo refresh the canvas. Concurrent file edits are detected: export your canvas JSON, reopen the document, then reconcile your changes. Multiple independent editor instances for one model are disabled.

All model processing stays inside the webview. Its Content Security Policy blocks outbound connections. There is no extension telemetry or Cloudflare beacon. Workspace file access uses VS Code APIs, including virtual file systems. Files must be under 5 MB; extension exports are limited to 25 MB. Virtual workspaces may be read-only depending on the provider.

## Install a packaged build

Download `mightora-architecture-modeller-0.4.0.vsix` from the website's Downloads section or a GitHub build artifact. Run **Extensions: Install from VSIX** and select it. For browser VS Code, use that command where available; publishing to the Marketplace is the normal installation route for wider distribution. The manifest has a `browser` entry point.

## Build and test

From the repository root, with Node.js 22+ and Python 3.10+:

```sh
npm run build
```

This refreshes and validates the central footer, runs tests, builds website/offline editions and packages the VSIX. Use `npm run build:offline` to build from the committed footer snapshot without network access.

For desktop development, create a VS Code launch configuration of type `extensionHost` with `--extensionDevelopmentPath=${workspaceFolder}/vscode-extension`. For the web host, from the repository root:

```sh
npx @vscode/test-web --extensionDevelopmentPath ./vscode-extension --browserType chromium
```

The automated suite covers host document edits, conflict rejection, undo propagation, exports, imports and browser-safe packaging. An interactive VS Code web/desktop run remains a release verification step; the creation environment lacked the supported browser QA capability.

## Publish to the Visual Studio Marketplace

The proposed publisher ID is **mightoraio**, matching other Mightora Marketplace tools. You need publishing access to that publisher; the build does not verify ownership or publish automatically.

1. Sign in to <https://marketplace.visualstudio.com/manage> and select `mightoraio`, or change `publisher` in `vscode-extension/package.json` to a publisher you control.
2. Run `npm run build`. Upload `dist/downloads/mightora-architecture-modeller-0.4.0.vsix` using **New extension → Visual Studio Code**, or the existing extension's update action for subsequent releases. Manual upload needs no repository token.
3. Alternatively, use Microsoft's packaging and publishing tool:

```sh
cd vscode-extension
npx @vscode/vsce package --no-dependencies
npx @vscode/vsce publish --packagePath mightora-architecture-modeller-0.4.0.vsix
```

Authenticate with a method currently supported by your publisher. Keep credentials out of source control. Microsoft's authentication guidance is changing around retirement of global Azure DevOps PATs; check the official publishing documentation when configuring automation.

4. For an update, increment both package versions, update the changelog and website download link, rebuild, test and upload the new VSIX. A published version cannot be reused.
5. Install the Marketplace release in desktop VS Code and vscode.dev. Confirm JSON/YAML opening, native save/undo, drill-down, mappings and Office exports before announcing the release.

Official references:

- <https://code.visualstudio.com/api/extension-guides/web-extensions>
- <https://code.visualstudio.com/api/extension-guides/custom-editors>
- <https://code.visualstudio.com/api/working-with-extensions/publishing-extension>

MIT source: <https://github.com/mightora/architecture-modeller.mightora.io>. Microsoft icons and export libraries retain their attribution and terms in the application and third-party notices.
