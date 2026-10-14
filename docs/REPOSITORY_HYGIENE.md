# Higiene do repositório

## O que fica versionado
- `src/`: aplicação React e regras de aprendizagem.
- `public/`: recursos realmente usados pelo PWA, incluindo KanjiVG offline.
- `tests/` e `scripts/`: testes e verificações.
- `.agents/skills/`: skills explicitamente instaladas e utilizadas no desenvolvimento.
- `design/`: fontes de design e materiais de autoria. Revisar e arquivar separadamente, sem apagar referências de marca.

## O que não deve voltar para o Git
As pastas `.impeccable/{font-package,package-stage,bamboo-review,cleanup-review,hierarchy-review,review,studio-review}/` são cópias temporárias de empacotamento ou registros visuais gerados em revisões. Os arquivos antigos continuam acessíveis pelo histórico do Git, mas não pertencem à árvore atual.

Para verificar as regras: `git ls-files .impeccable` (não deve listar as pastas ignoradas). Se alguma ferramenta exigir artefatos dessas pastas, recrie-os localmente por meio do seu fluxo de trabalho, sem versioná-los.

## Limpeza de código segura
- Não trate ausência de import estático como prova de código morto: há import dinâmico, PWA, arquivos públicos, referências em scripts e testes.
- Antes de remover um módulo, verifique imports/exports, referências dinâmicas, `public/`, rotas, dados de estudos, histórico de progresso e testes.
- Não altere IDs de cartões ou lições, formatos de backup, chave local `kotonoha.v1`, UI aprovada nem disponibilidade offline.
- Execute `npm ci`, `npm test`, `npm run check:architecture`, `npm run audit:n5-course`, `npm run build` e `npm run test:e2e` antes de integrar.
- `audit:n5-release` é um bloqueio editorial intencional; não altere para simular aprovação.

Este documento é uma política enxuta; a arquitetura permanece descrita em `docs/ARCHITECTURE.md`, e regras dos agentes permanecem em `AGENTS.md`.
