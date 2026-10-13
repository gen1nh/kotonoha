# Integração WanaKana e KanjiVG — Kotonoha N5

## WanaKana
- Biblioteca JS: https://github.com/WaniKani/WanaKana
- Dependência npm: `wanakana@5.3.1`.
- Licença MIT, veja `docs/licenses/WANAKANA_LICENSE.txt`.
- Integração: `src/kanaTyping.js` e `src/components/KanaTypingPractice.jsx`.
- Digitação em romaji ou kana, normalização para hiragana, e comparação de leitura.
- Treino adicional e **não certificador**, sem alterar cartões SRS, checkpoints ou destravamento de níveis.
- Não conecta API e funciona offline após o PWA armazenar os recursos.

## KanjiVG
- Dados SVG de https://github.com/KanjiVG/kanjivg
- Copyright Ulrich Apel e colaboradores, CC BY-SA 3.0. Veja `public/kanjivg/ATTRIBUTION.md` e `COPYING`.
- Somente 105 diagramas do N5, servidos via `public/kanjivg/*.svg` e armazenados offline pelo PWA.
- `src/kanjiStrokes.js` extrai o atributo geométrico `d` de cada traço, sem montar HTML externo.
- Biblioteca → aba Kanji N5 → desenho: guia por traço com seleção e destaque.
- Kana preserva o guia de escrita anterior.
- A prática de escrita é **orientada**, não valida automaticamente precisão geométrica da escrita.

## Como verificar
```bash
npm ci
npm test
npm run build
npm run test:e2e
```

Para conferência manual: digitar `nihongo` como `にほんご`; abrir Biblioteca →
Kanji N5 → selecionar `日` → guia de quatro traços; conferir no modo avião após
abrir o site uma vez online; verificar preservação do progresso após recarregar.

Não usar a existência de um caminho SVG nem um acerto de digitação como certificação JLPT.
