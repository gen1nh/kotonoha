# Kotonoha — estudo de japonês

App pessoal em React 19 + Vite para estudar japonês do N5 ao N1. O progresso fica no navegador do dispositivo; o produto não exige conta. A interface funciona em celular e desktop.

## Executar

Requer Node.js 22.12+ (ou 24+) e npm.

```bash
npm install
npm run dev
```

Para gerar e conferir a versão de produção:

```bash
npm run build
npm run preview
```

A instalação como PWA e o service worker estão disponíveis na versão de produção hospedada em HTTPS. O servidor de desenvolvimento não registra o service worker. Vozes japonesas dependem do navegador e do aparelho. Exercícios com Groq são opcionais, exigem conexão e uma chave própria, guardada apenas na sessão.

## O que inclui

- 46 hiragana e 46 katakana, com pronúncia pelo navegador e treino de escrita em canvas.
- Conteúdo inicial N5 com vocabulário, notas de gramática, quiz e revisão espaçada.
- N4, N3, N2 e N1 com três lições interativas por nível, quatro questões por lição e explicação após cada resposta.
- 16 cartões de vocabulário para cada nível N4–N1. Ao todo, a revisão espaçada contém 176 cartões.
- Pergunta diária, exercícios para fazer no papel, registro pessoal de simulados e links para materiais oficiais de prática do JLPT.
- Exportação e importação de backup JSON; os dados existentes em `kotonoha.v1` são preservados.

As lições e exemplos N4–N1 são conteúdo original de estudo, organizado por nível como referência didática. O JLPT publica descritores gerais e questões oficiais de exemplo, mas não uma lista completa oficial de kanji, vocabulário e gramática. O Kotonoha não afirma afiliação oficial nem reproduz questões protegidas. Os links para a página oficial ficam na área JLPT.

## Organização

- `src/App.jsx`: estado, persistência, navegação e instalação.
- `src/Shell.jsx`: navegação, pergunta diária e visão geral.
- `src/components/Views.jsx`: kana, vocabulário, gramática, revisão, papel, JLPT e preferências.
- `src/data.js`: conteúdo de base N5 e descrições dos níveis.
- `src/curriculum.js`: lições interativas e vocabulário original N4–N1.
- `src/state.js`: cartões, intervalos de revisão, sequência de estudo e validação de backups.
- `src/editorial.css`: direção visual editorial e comportamento responsivo.
- `public/`: logo, ícones e manifesto PWA.
- `tests/`: testes da lógica, conteúdo e fluxos no navegador.

## Verificação

```bash
npm test
npx playwright install chromium
npm run test:e2e
```

Os testes cobrem o conteúdo N4–N1, revisão e compatibilidade de backup, fluxos principais, interação de lições, navegação por teclado, acessibilidade automatizada, larguras móveis e uso offline após o primeiro acesso. Chamadas reais à Groq não são executadas pelos testes.

## Direção do produto e interface

O visual usa papel claro, tinta escura, vermelho discreto, tipografia forte e controles convencionais. A interação principal das novas lições é uma pergunta por vez, com feedback e explicação. Não há ilustrações decorativas. As decisões ficam em [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md), [AGENTS.md](AGENTS.md) e [design-system/kotonoha/MASTER.md](design-system/kotonoha/MASTER.md).
