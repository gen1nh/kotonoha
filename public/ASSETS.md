# Ativos de identidade

Novo logotipo horizontal e conjunto de ícones/favicons atualizados para o Conceito B (Fusão de Folha de Bambu & Kanji 言 em Squircle Tátil 3D), alinhados ao sistema de design vigente (`design-system/kotonoha/MASTER.md`):

1. **Logotipo horizontal (`public/brand/logo.svg`):** Símbolo tátil à esquerda, tipografia Kotonoha vetorizada em cor de texto de alta densidade (`#162019`) e selo vertical autêntico Hanko japonês em ouro Kokoro (`#d99b00` / `#ffc800`) com a inscrição `言の葉`.
2. **Ícone vetorial (`public/icon.svg`):** Squircle tátil 256×256 com elevação física 3D em verde vibrante (`#58cc02` / `#357300`), folha de bambu orgânica no traço superior de 言, centelha dourada e traços arredondados de alta legibilidade.
3. **Pacote de ícones PWA e Favicon:**
   - `public/favicon.ico`: Formato binário padrão contendo camadas 16×16, 32×32 e 48×48.
   - `public/apple-touch-icon.png`: Resolução 180×180 para dispositivos Apple iOS.
   - `public/icon-192.png` e `public/icon-512.png`: Ícones padrão para Progressive Web App.
   - `public/maskable-512.png`: Ícone adaptativo com fundo integral e padding seguro (safe zone de 80%) para Android.
4. **Geração automatizada:** Script local `scripts/generate-brand-assets.mjs` renderiza todos os binários diretamente dos arquivos SVG via Chromium / Playwright, sem perda de nitidez ou artefatos.
