#!/usr/bin/env python3
"""Build online and truly self-contained offline editions without npm dependencies."""
import base64
import hashlib
import html
import json
import re
import shutil
import subprocess
import zipfile
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'

def put_zip(path, files):
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name, data in sorted(files.items()):
            info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, data)

class OfflineParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        assert not any(k.startswith('on') for k in a), 'Inline event handler found'
        for k in ['src', 'srcset', 'poster']:
            if k in a:
                assert a[k].startswith(('data:', 'blob:')), f'Offline external asset: {tag} {k}'
        if tag == 'link' and a.get('rel') in ('stylesheet', 'icon', 'preload', 'prefetch'):
            assert a.get('href', '').startswith('data:'), 'Offline link asset is not embedded'
        if tag in ('iframe', 'object', 'embed'):
            raise AssertionError('Unexpected active embedded resource')

def validate_offline(html):
    parser = OfflineParser(); parser.feed(html)
    assert "connect-src 'none'" in html
    assert 'Offline Edition – No Internet Connection Required' in html
    assert '/*CORE_SCRIPT*/' not in html and '/*APP_SCRIPT*/' not in html
    assert 'src="https://' not in html
    assert not re.search(r'@import|url\(\s*[\'\"]?https?://', html, re.I), 'Remote CSS resource in offline build'
    app = (ROOT / 'src/app.js').read_text()
    assert not re.search(r'\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts)\s*\(', app)
    assert not re.search(r'\b(?:eval|Function)\s*\(', app)
    # Keep the selection path stable so a first click cannot replace a double-click target.
    select = re.search(r'function select\(nodeId\) \{([^}]+)\}', app).group(1)
    assert 'renderGraph' not in select, 'Selecting a block replaces its double-click target'

def main():
    for source in ['core.js', 'dimensions.js', 'guidance.js', 'examples.js', 'formats.js', 'office.js', 'app.js', 'platform-ui.js', 'vscode-bridge.js']:
        subprocess.run(['node', '--check', str(ROOT / 'src' / source)], check=True)
    test = subprocess.run(['node', '--test', '--test-reporter=tap', *[str(p) for p in sorted((ROOT / 'tests').glob('*.test.cjs'))]], text=True, capture_output=True)
    if test.returncode:
        print(test.stdout, end='')
        raise RuntimeError(test.stderr or 'Core tests failed')
    total = int(re.search(r'# tests (\d+)', test.stdout).group(1))
    footer_text = (ROOT / 'assets/footer.yaml').read_text()
    footer_check = subprocess.run(['node', str(ROOT/'scripts/validate-footer.cjs')], input=footer_text, text=True, capture_output=True, check=True)
    footer_details = json.loads(footer_check.stdout)
    DIST.mkdir(exist_ok=True); (DIST / 'downloads').mkdir(exist_ok=True)
    template = (ROOT / 'src/index.html').read_text()
    template = template.replace('/*PLATFORM_SCRIPT*/', (ROOT/'.generated/platform.js').read_text().replace('</script', '<\\/script'))
    template = template.replace('<!--ICON_TERMS-->',(ROOT / 'src/icon-terms.html').read_text())
    template = template.replace('The application has no model-upload endpoint, analytics or telemetry.', 'The application has no model-upload endpoint. The public website uses Cloudflare Web Analytics to measure visits and performance; model content is not sent to the analytics service. The offline and VS Code editions block analytics connections.')
    scripts = {name: (ROOT / 'src' / name).read_text().replace('</script', '<\\/script') for name in ['core.js', 'dimensions.js', 'guidance.js', 'examples.js', 'formats.js', 'office.js', 'app.js', 'platform-ui.js']}
    styles = (ROOT / 'src/styles.css').read_text()
    for token, name in [('CORE_SCRIPT', 'core.js'), ('DIMENSIONS_SCRIPT', 'dimensions.js'), ('GUIDANCE_SCRIPT', 'guidance.js'), ('EXAMPLE_SCRIPT', 'examples.js'), ('FORMATS_SCRIPT', 'formats.js'), ('OFFICE_SCRIPT', 'office.js'), ('APP_SCRIPT', 'app.js'), ('PLATFORM_UI_SCRIPT','platform-ui.js')]:
        template = template.replace(f'/*{token}*/', scripts[name])
    vendors = '\n;\n'.join(re.sub(r'//# sourceMappingURL=.*|//#sourceMappingURL=.*', '', (ROOT / 'assets' / n).read_text()) for n in ['js-yaml.min.js', 'jszip.min.js', 'pptxgen.bundle.js'])
    template = template.replace('/*VENDOR_SCRIPT*/', vendors.replace('</script', '<\\/script'))
    icon_catalog = json.loads((ROOT / 'assets/icon-catalog.json').read_text())
    icon_registry = {icon['id']: {**icon, 'svg': 'data:image/svg+xml;base64,' + base64.b64encode((ROOT / 'assets/icons' / (icon['id'] + '.svg')).read_bytes()).decode(), 'png': 'data:image/png;base64,' + base64.b64encode((ROOT / 'assets/icons' / (icon['id'] + '.png')).read_bytes()).decode()} for icon in icon_catalog}
    template = template.replace('/*ICON_SCRIPT*/', 'globalThis.ModellerIconCatalog = '+json.dumps(icon_catalog)+';globalThis.ModellerIcons = ' + json.dumps(icon_registry) + ';globalThis.ModellerIconLicenseText = '+json.dumps((ROOT/'assets/LUCIDE-LICENSE.txt').read_text())+';')
    template = template.replace('/*APP_STYLES*/', styles)
    template = template.replace('and the YAML parser from external domains.', 'from external domains; the YAML parser and Office exporters are bundled locally.')
    notices = (ROOT / 'THIRD-PARTY-NOTICES.md').read_text() + '\n\n' + '\n\n'.join((ROOT / 'assets' / name).read_text() for name in ['JS-YAML-LICENSE.txt', 'JSZIP-LICENSE.txt', 'PPTXGENJS-LICENSE.txt', 'LUCIDE-LICENSE.txt'])
    template = template.replace('<!--DEPENDENCY_NOTICES-->', '<section class="wrap info-section"><details class="faq"><summary>Third-party attribution and licence texts</summary><pre class="licence-text">' + html.escape(notices) + '</pre></details></section>')
    online_head = '''<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: blob: https://cdn.jsdelivr.net https://raw.githubusercontent.com https://techtweedie.github.io; connect-src 'self' https://cdn.jsdelivr.net https://raw.githubusercontent.com https://cloudflareinsights.com; font-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'none'">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/shared.css">
<script>if(window.fetch){const originalFetch=window.fetch.bind(window);window.fetch=async(...args)=>{const response=await originalFetch(...args);const url=typeof args[0]==='string'?args[0]:args[0]?.url||'';if(url.includes('footer.yaml')&&response.ok){const raw=await response.clone().text();return new Response(raw.replace(/\\t/g,'  '),{status:response.status,headers:response.headers});}return response;};}</script>
<script defer src="https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/components.js"></script>
<script type="module">const beaconUrl='https://static.cloudflareinsights.com/beacon.min.js';if(!Array.from(document.scripts).some(script=>script.src.startsWith(beaconUrl))){const beacon=document.createElement('script');beacon.type='module';beacon.src=beaconUrl;beacon.dataset.cfBeacon=JSON.stringify({token:'54355574b7594d3d9d9946038d33925a'});document.head.append(beacon);}</script>'''
    online = template.replace('<!--EDITION_HEAD-->', online_head).replace('<!--EDITION_LABEL-->', 'LOCAL MODEL PROCESSING')
    assert online.count("const beaconUrl='https://static.cloudflareinsights.com/beacon.min.js'") == 1
    (DIST / 'index.html').write_text(online)
    (DIST / 'CNAME').write_text('architecture-modeller.mightora.io\n')
    (DIST / '.nojekyll').write_text('')
    logo = 'data:image/png;base64,' + base64.b64encode((ROOT / 'assets/mightora-logo.png').read_bytes()).decode()
    offline_head = '''<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; media-src 'none'">'''
    offline = template.replace('<!--EDITION_HEAD-->', offline_head).replace('<!--EDITION_LABEL-->', 'Offline Edition – No Internet Connection Required')
    offline = re.sub(r'<section id="vscode".*?</section>', '', offline, flags=re.S)
    offline_shared_css = re.sub(r"background-image:\s*url\(['\"]https://[^)]+\);", 'background-image: none;', (ROOT / 'assets/shared.css').read_text())
    offline = offline.replace('<style>', '<style>' + offline_shared_css, 1)
    offline = offline.replace('./mightora-logo.png', logo)
    offline = offline.replace('https://raw.githubusercontent.com/mightora/mightora.io/main/static/images/mightoraIoLogo4-200x900.png', logo)
    offline = offline.replace('<title>Mightora Architecture Modeller', '<title>Offline — Mightora Architecture Modeller')
    offline = re.sub(r'<div class="download-actions">.*?</div>', '<div class="download-actions"><button type="button" class="button primary" data-action="save-offline-copy">Save this HTML ↓</button><button type="button" class="button" data-action="export-json">Save model JSON ↓</button></div>', offline, count=1, flags=re.S)
    offline = offline.replace('No installation · No model upload · Generated from the same maintained source', 'Offline Edition – No Internet Connection Required. Keep this HTML file and export model JSON to back up your work.')
    offline = offline.replace('href="./LICENSE"', 'href="data:text/plain;base64,' + base64.b64encode((ROOT / 'LICENSE').read_bytes()).decode() + '" download="LICENSE.txt"')
    offline = offline.replace('href="./downloads/mightora-architecture-modeller-source.zip" download id="source-badge"', 'href="#downloads" id="source-badge"').replace('<strong>Download</strong>', '<strong>In this HTML</strong>')
    source_files_for_hash = sorted(p for folder in ['src','packages','vscode-extension/src'] for p in (ROOT/folder).rglob('*') if p.is_file()) + [ROOT/'assets/vendor-lock.json',ROOT/'package-lock.json']
    source_digest = hashlib.sha256(b''.join(str(p.relative_to(ROOT)).encode()+b'\0'+p.read_bytes() for p in source_files_for_hash)).hexdigest()
    report = { 'sourceSha256': source_digest, 'unitTests': { 'passed': total, 'failed': 0 }, 'javascriptSyntax': 'passed', 'offlineResourceAndCspChecks': 'passed', 'zipMatchesHtml': 'passed', 'sharedFooter': { 'source':'https://github.com/mightora/shared-ui/blob/main/footer.yaml', 'sha256':hashlib.sha256(footer_text.encode()).hexdigest(), **footer_details }, 'browserInteractionVerification': 'Not executed by the packaging command; see CI acceptance results and docs/verification.md', 'hosting': 'GitHub Pages, existing main branch workflow', 'analytics': 'Single online-only Cloudflare beacon using existing mightora.io site token; CSP permits reporting; no beacon in offline/extension editions', 'codeQL': 'see GitHub workflow for actual result', 'note': 'These checks are not a security certification or a browser performance guarantee.' }
    offline = offline.replace('href="./verification.json"', 'href="data:application/json;base64,' + base64.b64encode(json.dumps(report, indent=2).encode()).decode() + '" download="verification.json"')
    offline = offline.replace('<!doctype html>', '<!doctype html>\n<!-- Mightora Architecture Modeller. Copyright (c) 2026 Ian Tweedie / Mightora. MIT licence; see embedded licence link. -->', 1)
    validate_offline(offline)
    offpath = DIST / 'downloads/architecture-modeller-offline.html'; offpath.write_text(offline)
    offline_readme = '''Mightora Architecture Modeller — Offline Edition

Offline Edition – No Internet Connection Required

1. Extract this ZIP.
2. Double-click index.html in Windows, macOS or Linux. No installation or server is needed.
3. Start with the included Power Platform example, load the shop example, or create your own model.
4. Double-click a block to explore inside it. On touch devices, select it and choose Explore inside.
5. Use Export → Model JSON to back up your model. Browser file:// storage support varies.
6. Use Import to move a JSON model between the online and offline editions.

The HTML embeds all application code, styles and the full Mightora logo.
The CSP blocks application network requests. External links only navigate when explicitly followed.
Open Developer Tools → Network, enable Preserve log and reload to independently inspect requests.
The in-app monitor uses Performance Resource Timing and is not an audit.

This edition is a single-user modeller, not an ArchiMate implementation. It has no collaboration backend.
Full source, maintenance instructions and GitHub workflows are in the separate source ZIP.
'''
    off_files = { 'index.html': offline.encode(), 'README.txt': offline_readme.encode(), 'LICENSE': (ROOT / 'LICENSE').read_bytes(), 'THIRD-PARTY-NOTICES.txt': notices.encode() }
    put_zip(DIST / 'downloads/mightora-architecture-modeller-offline.zip', off_files)
    with zipfile.ZipFile(DIST / 'downloads/mightora-architecture-modeller-offline.zip') as z:
        assert z.read('index.html') == offpath.read_bytes(), 'ZIP contains stale HTML'
    shutil.copyfile(ROOT / 'assets/mightora-logo.png', DIST / 'mightora-logo.png')
    shutil.copyfile(ROOT / 'assets/footer.yaml', DIST / 'footer.yaml')
    shutil.copyfile(ROOT / 'LICENSE', DIST / 'LICENSE')
    (DIST / 'verification.json').write_text(json.dumps(report, indent=2))
    (DIST / 'robots.txt').write_text('User-agent: *\nAllow: /\n')
    (DIST / 'llms.txt').write_text('# Mightora Architecture Modeller\n\nFree configurable hierarchical architecture modelling. All diagram processing is local.\nFeatures: nested components; drill-down; mixed-level expansion; cross-level dependency links; custom modelling language; JSON, SVG and CSV export; offline HTML.\nNot an ArchiMate implementation. Single-user, one active model per browser.\n')
    source_files = {}
    for folder in ['src', 'assets', 'scripts', 'tests', '.github', 'vscode-extension', 'packages', 'tools', 'docs']:
        for f in sorted((ROOT / folder).rglob('*')):
            if f.is_file() and '__pycache__' not in str(f) and '/media/' not in str(f) and not f.name.endswith('.pyc'):
                source_files[f'mightora-architecture-modeller/{f.relative_to(ROOT)}'] = f.read_bytes()
    for name in ['README.md', 'LICENSE', 'package.json', 'package-lock.json', 'tsconfig.json', 'playwright.config.cjs', 'MODEL_FORMAT.md', 'THIRD-PARTY-NOTICES.md', 'design-system.instructions.md', 'Shared-Development-Standards.md']:
        if (ROOT / name).exists(): source_files[f'mightora-architecture-modeller/{name}'] = (ROOT / name).read_bytes()
    source_files['mightora-architecture-modeller/offline/index.html'] = offpath.read_bytes()
    source_files['mightora-architecture-modeller/offline/README.txt'] = offline_readme.encode()
    source_files['mightora-architecture-modeller/verification.json'] = json.dumps(report, indent=2).encode()
    put_zip(DIST / 'downloads/mightora-architecture-modeller-source.zip', source_files)
    print(json.dumps({ 'built': True, 'tests': total, 'source_sha256': source_digest, 'offline_html_bytes': len(offline.encode()), 'dist': str(DIST) }))

if __name__ == '__main__':
    main()
