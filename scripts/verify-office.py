"""Check real Office ZIPs, every XML part and internal relationship target."""
import sys
import zipfile
import posixpath
import xml.etree.ElementTree as ET
from pathlib import Path
for filename in sys.argv[1:]:
    path=Path(filename)
    with zipfile.ZipFile(path) as z:
        assert z.testzip() is None, 'Corrupt ZIP member'
        names=set(z.namelist())
        for name in names:
            if name.endswith(('.xml','.rels')):
                root=ET.fromstring(z.read(name))
                if name.endswith('.rels'):
                    base=posixpath.dirname(posixpath.dirname(name))
                    for rel in root:
                        if rel.attrib.get('TargetMode')=='External':
                            continue
                        target=rel.attrib.get('Target','')
                        resolved=posixpath.normpath(posixpath.join(base,target)) if not target.startswith('/') else target.lstrip('/')
                        assert resolved in names, f'Missing relationship target {name}: {target}'
        assert '[Content_Types].xml' in names
        assert ('word/document.xml' if path.suffix=='.docx' else 'ppt/presentation.xml') in names
    print(f'OOXML verified: {path.name}')
