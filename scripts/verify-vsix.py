import json
import zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
version=json.loads((root/'vscode-extension/package.json').read_text())['version']
path=root/'dist/downloads'/f'mightora-architecture-modeller-{version}.vsix'
with zipfile.ZipFile(path) as z:
    manifest=json.loads(z.read('extension/package.json'))
    assert manifest['browser']=='./extension.js'
    assert len(manifest['contributes']['commands'])>=10
    assert len(z.read('extension/media/editor.html'))>100000
    host=z.read('extension/extension.js').decode()
    assert 'require("node:' not in host and "require('node:" not in host
    assert "connect-src 'none'" in z.read('extension/media/editor.html').decode()
print(f'Verified VSIX {version}, shared editor, browser bundle and commands.')
