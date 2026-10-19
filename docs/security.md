# Security and privacy

Models are untrusted input. JSON/YAML imports enforce byte/complexity limits, safe IDs, finite bounded coordinates, known types/relationships, acyclic containment, referential integrity and supported schema versions. YAML uses the JSON schema, rejects duplicate/reserved keys, executable tags, cyclic aliases and excessive expansion. Recursive guards reject prototype-related property names throughout a model.

Names, labels and documentation render as escaped text. The application does not execute model-provided JavaScript, HTML or Markdown. Source links accept HTTP(S) without embedded credentials or control characters and traversal-free workspace-relative file paths. No shell execution is provided. Imported SVG artwork/remote icon URLs are not allowed; model icons select trusted bundled catalogue IDs. Export-logo uploads accept bounded PNG/JPEG images.

The online edition's CSP permits the existing Mightora shared components/footer/brand resources and existing Cloudflare analytics. Its request summary uses browser Resource Timing and cannot audit browser extensions, every blocked/cached request or all cross-origin details. Use F12 → Network → Preserve log → reload for independent checks. Architecture content is never included in an app network request.

The offline edition embeds application code, styles, logo and icon bytes. Its restrictive CSP includes `connect-src 'none'`, no remote scripts, no frames/objects and no external fonts. Browser tests load the actual file URL and assert no HTTP(S) requests while modelling/exporting. External links remain explicit navigation actions.

The VS Code webview has no remote resource roots and a per-view nonce CSP. Messages have allowed operation types, bounded payloads and document-version checks. Mutation text is parsed/validated in the host before WorkspaceEdit. Export paths are chosen by the user in VS Code; model content cannot nominate arbitrary filesystem writes. Local source navigation is confined to a workspace-relative target. No GitHub credentials are embedded.

Browser recovery storage is local to the origin/device and not encrypted by this application. Browser profile access exposes it. Export backups and choose appropriate file protections for sensitive designs. The app has no accounts or collaboration server. Website analytics retain the existing implementation and can be blocked by relevant browser privacy controls; offline/extension editions do not load the beacon.

CodeQL, dependency scanning, imported-model checks and tests reduce particular risks and are not a security certification. Report vulnerabilities privately to the repository maintainer using GitHub's available security-reporting mechanism. Do not place confidential production architecture in a public issue.
