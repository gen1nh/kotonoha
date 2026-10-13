import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // number of images

  const entries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    entries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

async function generate() {
  console.log('Iniciando renderização dos ativos de identidade com Playwright...');
  const iconSvgPath = path.join(publicDir, 'icon.svg');
  const iconSvg = fs.readFileSync(iconSvgPath, 'utf8');

  // Maskable SVG com safe zone (fundo verde 512x512 preenchido e ícone centralizado com padding)
  const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <linearGradient id="maskableBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#5ed802" />
        <stop offset="100%" stop-color="#50be00" />
      </linearGradient>
      <filter id="mShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#1e4e00" flood-opacity="0.25" />
      </filter>
    </defs>
    <!-- Fundo completo para adaptive maskable -->
    <rect width="512" height="512" fill="url(#maskableBg)" />
    <!-- Conteúdo seguro dentro da safe zone circular de 80% -->
    <g transform="translate(256, 256) scale(1.4) translate(-128, -128)">
      <!-- Kokoro Spark -->
      <circle cx="138" cy="35" r="7" fill="#ffb800" />
      <!-- Folha de bambu principal -->
      <path d="M 72 36 C 86 34, 102 42, 108 53 C 96 56, 82 50, 72 36 Z" fill="#ffffff" />
      <!-- Folha secundária menor -->
      <path d="M 68 56 C 80 54, 98 56, 106 61 C 94 65, 78 66, 68 56 Z" fill="#ffffff" />
      <!-- Haste / traço 1 -->
      <rect x="100" y="49" width="62" height="15" rx="7.5" fill="#ffffff" />
      <!-- Traço 2 -->
      <rect x="66" y="80" width="124" height="15" rx="7.5" fill="#ffffff" />
      <!-- Traço 3 -->
      <rect x="84" y="108" width="88" height="14" rx="7" fill="#ffffff" />
      <!-- Traço 4 -->
      <rect x="84" y="134" width="88" height="14" rx="7" fill="#ffffff" />
      <!-- Radical 口 -->
      <rect x="80" y="160" width="96" height="46" rx="11" fill="#ffffff" />
      <rect x="96" y="172" width="64" height="22" rx="6" fill="#46a800" />
    </g>
  </svg>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Helper para renderizar SVG com fundo transparente
  async function renderSvgToBuffer(svgContent, size) {
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body, html { width: ${size}px; height: ${size}px; background: transparent; overflow: hidden; }
      svg { width: ${size}px; height: ${size}px; display: block; }
    </style></head><body>${svgContent}</body></html>`;

    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html);
    return await page.screenshot({ omitBackground: true, type: 'png' });
  }

  // 1. Gerar icon-512.png
  console.log('Gerando icon-512.png...');
  const buf512 = await renderSvgToBuffer(iconSvg, 512);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buf512);

  // 2. Gerar icon-192.png
  console.log('Gerando icon-192.png...');
  const buf192 = await renderSvgToBuffer(iconSvg, 192);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buf192);

  // 3. Gerar apple-touch-icon.png (180x180)
  console.log('Gerando apple-touch-icon.png...');
  const buf180 = await renderSvgToBuffer(iconSvg, 180);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf180);

  // 4. Gerar maskable-512.png
  console.log('Gerando maskable-512.png...');
  const bufMaskable = await renderSvgToBuffer(maskableSvg, 512);
  fs.writeFileSync(path.join(publicDir, 'maskable-512.png'), bufMaskable);

  // 5. Gerar favicon.ico (16, 32, 48)
  console.log('Gerando favicon.ico...');
  const buf16 = await renderSvgToBuffer(iconSvg, 16);
  const buf32 = await renderSvgToBuffer(iconSvg, 32);
  const buf48 = await renderSvgToBuffer(iconSvg, 48);

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: buf16 },
    { width: 32, height: 32, buffer: buf32 },
    { width: 48, height: 48, buffer: buf48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  await browser.close();
  console.log('Todos os ativos foram gerados com sucesso em public/ !');
}

generate().catch(err => {
  console.error('Erro ao gerar ativos:', err);
  process.exit(1);
});
