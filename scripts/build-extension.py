#!/usr/bin/env python3
"""Build a portable VSIX from the same self-contained HTML as the website's offline edition."""
import json
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXT = ROOT / 'vscode-extension'

def main():
    source = ROOT / 'dist/downloads/architecture-modeller-offline.html'
    if not source.exists():
        raise RuntimeError('Run python3 scripts/build.py first.')
    media = EXT / 'media'; media.mkdir(exist_ok=True)
    editor = source.read_text().replace('Offline Edition – No Internet Connection Required','VS Code Edition – Workspace documents').replace('Offline — Mightora','VS Code — Mightora')
    editor = editor.replace('<script>/*VSCODE_BRIDGE*/</script>','<script>'+ (ROOT/'src/vscode-bridge.js').read_text()+'</script>')
    editor = editor.replace('</head>', '<style>.intro,.info-section,.trust-strip,mightora-author,mightora-footer,.quick-jump-nav{display:none!important}.wrap{width:calc(100% - 24px)}.views-toolbar{position:sticky;top:48px}.workspace{margin-block:12px}.local-header{padding:8px 16px;min-height:48px}.local-header nav{display:none!important}</style></head>')
    (media / 'editor.html').write_text(editor)
    shutil.copyfile(ROOT/'assets/extension-icon.png',media/'icon.png')
    starter = __import__('subprocess').check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./src/core.js').empty('Untitled architecture'),null,2)+'\\n')"],cwd=ROOT)
    (media/'starter.architecture.json').write_bytes(starter)
    shutil.copyfile(ROOT/'LICENSE',EXT/'LICENSE')
    shutil.copyfile(ROOT/'THIRD-PARTY-NOTICES.md',EXT/'THIRD-PARTY-NOTICES.md')
    package = json.loads((EXT/'package.json').read_text()); version = package['version']
    files = ['package.json','extension.js','LICENSE','README.md','CHANGELOG.md','THIRD-PARTY-NOTICES.md','media/editor.html','media/icon.png','media/starter.architecture.json']
    files += [str(p.relative_to(EXT)) for p in (EXT/'screenshots').glob('*.png')]
    # Universal VSIX: the manifest's browser entry enables the web extension host.
    manifest = f'''<?xml version="1.0" encoding="utf-8"?><PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011"><Metadata><Identity Language="en-US" Id="{package['name']}" Version="{version}" Publisher="{package['publisher']}"/><DisplayName>{package['displayName']}</DisplayName><Description xml:space="preserve">{package['description']}</Description><Tags>architecture,modelling,web</Tags><Categories>Visualization,Other</Categories><GalleryFlags>Public</GalleryFlags><Properties><Property Id="Microsoft.VisualStudio.Code.Engine" Value="^1.95.0"/><Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value=""/><Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value=""/><Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="ui,workspace"/><Property Id="Microsoft.VisualStudio.Code.WebExtension" Value="true"/><Property Id="Microsoft.VisualStudio.Services.Links.Source" Value="https://github.com/mightora/architecture-modeller.mightora.io"/></Properties><License>extension/LICENSE</License><Icon>extension/media/icon.png</Icon></Metadata><Installation><InstallationTarget Id="Microsoft.VisualStudio.Code"/></Installation><Dependencies/><Assets><Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/><Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true"/><Asset Type="Microsoft.VisualStudio.Services.Content.Changelog" Path="extension/CHANGELOG.md" Addressable="true"/><Asset Type="Microsoft.VisualStudio.Services.Icons.Default" Path="extension/media/icon.png" Addressable="true"/></Assets></PackageManifest>'''
    # Match vsce's web-discovery metadata, so Marketplace clients offer it in vscode.dev.
    manifest = manifest.replace('<Tags>architecture,modelling,web</Tags>', '<Tags>architecture,modelling,__web_extension</Tags>').replace('Value="ui,workspace"', 'Value="ui,workspace,web"').replace('extension/LICENSE</License>', 'extension/LICENSE.txt</License>')
    manifest = manifest.replace('</Properties>', '<Property Id="Microsoft.VisualStudio.Code.ExecutesCode" Value="true"/></Properties>')
    types = '''<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="json" ContentType="application/json"/><Default Extension="js" ContentType="application/javascript"/><Default Extension="html" ContentType="text/html"/><Default Extension="png" ContentType="image/png"/><Default Extension="md" ContentType="text/markdown"/><Default Extension="vsixmanifest" ContentType="text/xml"/><Default Extension="txt" ContentType="text/plain"/></Types>'''
    output = ROOT/'dist/downloads'/f'mightora-architecture-modeller-{version}.vsix'
    with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
        archive.writestr('extension.vsixmanifest',manifest); archive.writestr('[Content_Types].xml',types)
        for name in files: archive.write(EXT/name,'extension/'+('LICENSE.txt' if name == 'LICENSE' else name))
    with zipfile.ZipFile(output) as archive:
        import xml.etree.ElementTree as ET
        metadata = ET.fromstring(archive.read('extension.vsixmanifest'))
        ns = {'v':'http://schemas.microsoft.com/developer/vsx-schema/2011'}
        assert '__web_extension' in metadata.find('v:Metadata/v:Tags',ns).text
        for asset in metadata.findall('v:Assets/v:Asset',ns):
            assert asset.attrib['Path'] in archive.namelist(), 'VSIX asset missing'
        assert metadata.find('v:Metadata/v:License',ns).text in archive.namelist()
        assert json.loads(archive.read('extension/package.json'))['browser'] == './extension.js'
    print(json.dumps({'extension':str(output),'browserEntry':'extension.js','version':version}))

if __name__ == '__main__':
    main()
