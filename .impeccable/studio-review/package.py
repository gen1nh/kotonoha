from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path.cwd()
output = root / 'Kotonoha-React.zip'
files = []
for folder in ('src', 'public', 'tests', 'design-system'):
    files.extend(p for p in (root / folder).rglob('*') if p.is_file() and p.name != 'study-nook.png')
for name in ('AGENTS.md', 'PRODUCT.md', 'DESIGN.md', 'README.md', 'package.json', 'package-lock.json', 'index.html', 'vite.config.js', 'playwright.config.js', '.gitignore', '.impeccable/design.json', '.impeccable/surfaces/src-shell-jsx.md', '.impeccable/studio-review/verification.md', '.impeccable/studio-review/research.md'):
    files.append(root / name)
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for path in sorted(files):
        archive.write(path, path.relative_to(root))
with ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'src/studio.css' in archive.namelist()
    assert 'DESIGN.md' in archive.namelist()
    assert all('node_modules' not in name and 'study-nook.png' not in name for name in archive.namelist())
print(f'{output}\n{len(files)} arquivos; {output.stat().st_size:,} bytes; integridade OK')
