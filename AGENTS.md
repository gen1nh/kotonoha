# Kotonoha — regras de contribuição

Este arquivo **aponta para fontes de verdade**, sem repetir instruções de skills.

## Fontes de verdade
- Produto e N5: `PRODUCT.md` e `docs/N5_PERSONAL_COURSE_DELIVERY.md`.
- Arquitetura: `docs/ARCHITECTURE.md` e `.agents/skills/feature-sliced-design/SKILL.md`.
- Identidade e tokens: `design-system/kotonoha/MASTER.md`.

## Skills sob demanda
- **Arquitetura, imports e refatoração:** `feature-sliced-design`. Siga *pages first*; não crie abstrações especulativas.
- **Telas e UX:** `ui-ux-pro-max` e `design-system` quando relevantes; use `ui-styling` e `brand` somente se agregarem à tarefa.
- **Ilustrações:** plugin Anidoodle instalado no Codex, apenas quando solicitado para trabalho visual.

## Regras inegociáveis
- Preserve a trilha N5, IDs de cartões/lições, backups, acessibilidade, interface aprovada, celular e PWA offline. Não apague ou reinicialize progresso.
- Não adicione backend, autenticação nem serviços pagos como requisito de refatoração.
- Estrutura: `src/app/` (shell/estado global), `src/pages/` (telas), `src/entities/study/` (regras do estudo compartilhadas) e `src/shared/` (UI e utilitários sem negócio).
- Respeite as APIs públicas; não crie camadas, átomos/moléculas/organismos ou widgets vazios só para seguir nomes.

## Validação antes de integrar
`npm ci`, `npm test`, `npm run check:architecture`, `npm run audit:n5-course`, `npm run build` e `npm run test:e2e`. O gate `audit:n5-release` permanece deliberadamente fechado até haver prova editorial revisada.
