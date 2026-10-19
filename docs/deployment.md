# GitHub Pages deployment

Production remains at https://architecture-modeller.mightora.io/ on GitHub Pages. This project does not require Cloudflare Pages, Workers, a backend, user accounts or secrets for modelling.

1. Set repository Settings → Pages → Source to GitHub Actions.
2. Keep the custom domain `architecture-modeller.mightora.io`; its DNS CNAME must target `mightora.github.io`. Cloudflare may remain the DNS/proxy provider, but no Cloudflare Pages custom-domain binding should intercept this hostname.
3. The main `.github/workflows/pages.yml` installs from the lockfile, checks strict types/syntax/security, runs unit/export tests, builds static assets, tests Chromium website and VS Code Web journeys, uploads artifacts and deploys `dist` through `actions/deploy-pages`.
4. Pull requests build and test but do not deploy production. Keep any branch-protection requirements set by the repository owner.
5. Confirm the Actions deploy job, open the public site, import a model and download both Office formats. Check `verification.json` for commit and workflow-specific verification evidence.

Assets use relative URLs and embedded scripts rather than application routes. The website therefore works at the custom-domain root and a repository Pages path. Preserve CNAME/custom-domain settings in GitHub. There is no service-side route fallback to configure.

`npm run build` refreshes the shared footer/branding snapshot. The build preserves js-yaml-before-components ordering and the existing footer tab-indentation workaround. The public-only analytics token is already configured; the loader reuses any automatically injected beacon to avoid duplication. Offline/extension editions remove the beacon.

The source ZIP contains code, lockfile, packages, docs and workflows; the offline ZIP contains exactly the generated standalone HTML. The release workflow packages the VSIX without publishing to Marketplace. See [VS Code](vscode.md).

A CodeQL success badge refers to the actual workflow, not a security certification. Dependency scanning runs on every CI build and Dependabot checks updates weekly.
