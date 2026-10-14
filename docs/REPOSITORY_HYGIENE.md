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

## Verificação automatizada
- `npm run audit:dead-code`: examina imports estáticos, reexports e imports dinâmicos literais a partir de `src/main.jsx`, reportando candidatos sem uso. Não apaga arquivos.
- `npm run audit:dead-code -- --strict`: opcional, falha caso existam candidatos ou imports não resolvidos. Ative como bloqueio somente depois de verificar os falsos positivos.
- `npm run check:quality`: executa validação de arquitetura, relatório de módulos e auditoria do curso.
- O CI também executa testes Node, compilação Vite e testes Playwright.

Configurações locais como `.impeccable/config.local.json` não devem ser versionadas.

## Revisão arquitetural complementar (outubro de 2026)
- Extraído o controle de preferência visual de `Shell.jsx` para `src/app/model/useThemePreference.js`. A chave persistida, o tema e a cor do PWA foram preservados.
- Removidos um import não utilizado e o cálculo sem consumidores de `due` no Shell.
- Mantida a API pública da entidade de estudo por compatibilidade. Uma alteração de `export *` exige auditoria de todos os consumidores e dos testes; não é limpeza cosmética.
- Os arquivos em `design/` e as skills em `.agents/` têm função autoral/ferramental: não removê-los apenas por volume.
- A auditoria de alcance atual não identifica exports, propriedades e ramos mortos. Antes de qualquer exclusão futura, cruzar resultados de ferramentas estáticas e testes de comportamento.
