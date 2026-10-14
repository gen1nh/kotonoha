from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
root=Path(__file__).resolve().parent.parent
files=[]
for folder in ('src','public','tests','design-system','scripts','docs','supabase'):
    files.extend(p for p in (root/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
for name in ('AGENTS.md','PRODUCT.md','DESIGN.md','ANALISE-PROJETO.md','README.md','package.json','package-lock.json','index.html','vite.config.js','playwright.config.js','.gitignore','.impeccable/design.json','.impeccable/surfaces/src-shell-jsx.md'):
    files.append(root/name)
assert json.loads((root/'.impeccable/design.json').read_text(encoding='utf-8-sig'))['schemaVersion']==2
with ZipFile(root/'Kotonoha-React.zip','w',ZIP_DEFLATED) as archive:
    for path in sorted(files): archive.write(path,path.relative_to(root))
with ZipFile(root/'Kotonoha-React.zip') as archive:
    assert archive.testzip() is None
    assert not any('.env' in name or 'node_modules' in name for name in archive.namelist())
print(f'{len(files)} arquivos; ZIP íntegro, sem dependências instaladas ou configuração privada.')
