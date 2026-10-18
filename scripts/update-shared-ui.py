#!/usr/bin/env python3
"""Refresh and validate the central Mightora footer snapshot before a release build."""
import json
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://raw.githubusercontent.com/mightora/shared-ui/main/footer.yaml'

def main():
    request = urllib.request.Request(SOURCE, headers={'User-Agent': 'Mightora-Architecture-Modeller-build'})
    with urllib.request.urlopen(request, timeout=30) as response:
        footer = response.read(1024 * 1024 + 1).decode('utf-8').replace('\t', '  ')
    if len(footer.encode()) > 1024 * 1024:
        raise ValueError('Shared footer exceeds 1 MB')
    result = subprocess.run(['node', str(ROOT / 'scripts/validate-footer.cjs')], input=footer, text=True, capture_output=True, check=True)
    (ROOT / 'assets/footer.yaml').write_text(footer)
    print(json.dumps({'source': SOURCE, **json.loads(result.stdout)}))

if __name__ == '__main__':
    main()
