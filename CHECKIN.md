# CHECKIN — Kotonoha

> **Arquivo de continuidade para qualquer IA ou desenvolvedor.** Atualize este documento na mesma PR em que mudar o projeto. Leia antes de modificar a interface. Este arquivo não substitui a revisão editorial ou os testes em aparelhos físicos.

## Como retomar o projeto

- **Repositório:** https://github.com/gen1nh/kotonoha
- **Branch principal:** `main`
- **PR da refatoração UX:** https://github.com/gen1nh/kotonoha/pull/24 · branch `feat/guided-ux-consolidation-20261015` (mesclar apenas com CI aprovado)
- **Produto:** aplicativo PWA de japonês, uso pessoal, curso N5 guiado, SRS, Biblioteca, Caderno, escuta e avaliação.
- **Versão do pacote:** confirmar `package.json` antes de citar; **não chamar de 1.0** sem fechar os gates.
- **Documentos canônicos:** `docs/RELEASE_1_0_CHECKLIST.md`, `docs/UX_ARCHITECTURE.md`, `docs/N5_CURRICULUM_MAP.md`, `docs/TEACHING_FLOW_AUDIT.md`. Relatórios antigos em `docs/history/` são históricos, não novos requisitos.

## Princípio de UX aprovado pelo usuário

**O app guia o aluno; o aluno não precisa escolher entre ferramentas para descobrir o que estudar.** Conteúdos técnicos, explicações sobre arquitetura, termos como “checkpoint”, “microlição”, “SRS” ou “evidência auditiva” não devem ser despejados nas telas de estudo. Acessibilidade, transparência sobre áudio e limitações de exames continuam obrigatórias, mas em linguagem simples e no momento apropriado.

Contrato de produto:
1. **Hoje:** exatamente uma ação pedagógica em destaque, derivada de `nextGuidedAction` e dos cartões vencidos. Meta diária compacta.
2. **Trilha:** mostrar próxima lição com prioridade; conteúdos antigos ou futuros ficam recolhidos. A trilha é a única fonte de ordem e desbloqueio.
3. **Lição:** entender um exemplo, praticar, fazer teste rápido; não obrigar a usar ferramentas extras.
4. **Teste rápido:** uma pergunta por vez, resultado separado, “Continuar” se aprovado (≥80%) ou “Tentar novamente” se não; explicação detalhada opcional.
5. **Meu espaço:** progresso e recursos de apoio (Revisar, Biblioteca, Caderno, Treinos extras, preparação, simulados, Preferências). Nenhum deles cria uma segunda progressão.
6. **Semântica visual:** uma CTA sólida verde por contexto; navegação ativa em verde suave; ações secundárias neutras; sucesso com ícone/verde pontual, etapa atual informada por texto/azul, revisão laranja, bloqueio cinza, erros reais vermelho. Não confiar só em cor.

## Implementado antes desta refatoração (main)

- [x] Trilha N5 de **220 unidades**, IDs estáveis e sequência canônica.
- [x] Fluxo de lição, cartões e teste rápido por unidade; ≥80% para passar.
- [x] Resultado do teste em tela própria com acertos, detalhes expansíveis e nova tentativa (PR #23).
- [x] Retomada de questões não respondidas e salvamento local após recarga (PR #20).
- [x] Escuta exige tocar áudio ou consultar transcrição; consulta preservada como leitura (PR #19).
- [x] Proteção da integridade das notas de avaliação interna N5 antes de N4 (PR #22).
- [x] Carregamento sob demanda de telas opcionais, com cobertura PWA offline e acessibilidade de foco (PR #21).
- [x] Checks automatizados de arquitetura, currículo e fluxo de navegador no GitHub Actions.

## Refatoração de UX/UI — branch atual

Estas tarefas marcadas **implementadas no código da branch**, não equivalem a CI aprovado ou deploy. Conferir GitHub Actions e estado da PR:
- [x] Navegação principal com **Hoje / Trilha / Meu espaço** (rotas antigas `practice` e `progress` continuam aceitas).
- [x] Home enxuta com um próximo passo, meta compacta e revisão contextual (sem segundo motor curricular).
- [x] Meu espaço reúne Progresso, Revisar, Biblioteca, Caderno, exercícios opcionais e Preferências.
- [x] Trilha prioriza a lição atual e recolhe outras lições por capítulo.
- [x] Primeiro acesso explica a próxima atividade sem exigir meta antes de começar.
- [x] Praticar muda para Treinos extras e recolhe o catálogo de atividades.
- [x] Padronizar componentes de botões, cards, status e navegação; restringir verde sólido à CTA e estados pontuais.
- [x] Simplificar textos da Home, lições, testes, Biblioteca e preparação N5; final de revisão retorna a Hoje.
- [ ] Revisar a linguagem residual nas telas secundárias (Preferências, Simulados, Caderno e laboratórios) após testes com alunos.
- [x] Recolher planejamento avançado do Caderno e recursos extras de Meu espaço; preservar seus dados.
- [ ] Revisar os textos longos restantes de Simulados, Preferências, lições específicas de leitura/escuta e alertas.
- [x] Atualizar e adicionar cenários E2E de três destinos, primeiro acesso, Biblioteca/Caderno, treinos recolhidos, Simulados e navegação existente.
- [ ] Confirmar esses E2E aprovados no SHA final (Chromium e WebKit), inclusive mobile, histórico, offline e dark mode.
- [ ] Verificar acessibilidade WCAG, foco, target touch e contrastes; testar Safari físico.
- [ ] Confirmar CI verde do commit final e mesclar a PR.
- [ ] Confirmar CI da `main` após mesclagem e validar o deploy real da Vercel.

## Pendências obrigatórias antes da 1.0

- [ ] Revisão linguística japonesa **independente** de todas as 220 unidades e respectivos exemplos, feedback e distratores.
- [ ] Banco de avaliação final N5 aprovado com cobertura curricular, revisão independente e direitos de áudio verificados.
- [ ] Homologação física em **iPhone/Safari** de áudio, instalação da PWA, offline, safe area, desenho e retomada.
- [ ] Revisar licenças dos materiais incorporados e atribuições.
- [ ] Confirmar deploy do commit de `main` na Vercel (não basta GitHub verde).
- [ ] Executar testes com iniciantes reais, sem dicas do desenvolvedor: começar, continuar, errar, tentar de novo, revisar, consultar palavra e retomar após fechar.
- [ ] Publicar 1.0 só após fechar `docs/RELEASE_1_0_CHECKLIST.md`; não afirmar certificação oficial JLPT.

## Comandos antes de qualquer merge

```bash
npm ci
npm test
npm run check:architecture
npm run audit:dead-code
npm run audit:n5-course
npm run build
npm run test:e2e
```

Verifique também os workflows GitHub Actions do **SHA final da branch** e da `main` após mesclar. Uma execução aprovada de um SHA antigo não valida commits novos.

## Invariantes: não quebrar

- **Não trocar os IDs das 220 unidades**, nem reordenar currículo ou falsificar progressão.
- Preservar `kotonoha.v1`, migração em `normalizeState`, `drafts`, `attempts`, backups e histórico.
- Não enfraquecer `isAccessibleLesson`, `isAccessibleCheckpoint`, `recordN5Result`, cobertura do exame ou exigência de 80%.
- Não tratar TTS como gravação nativa licenciada nem o teste interno como JLPT oficial.
- Não tornar IA, login, nuvem ou materiais externos obrigatórios para aprender offline. O código já contém sync opcional; **não ampliar** sincronização entre aparelhos nesta refatoração.
- Reutilizar os componentes e tokens em `src/shared/ui`; evitar CSS ad-hoc ou duplicação de regras pedagógicas em páginas.

## Mapa mínimo para a próxima IA

| Problema | Código |
| --- | --- |
| Roteamento/voltar, persistência e ações | `src/app/App.jsx` |
| Layout e 3 destinos | `src/app/Shell.jsx`, `src/shared/ui/layout.jsx` |
| Próxima ação | `src/entities/study/model/learning.js` |
| Tela Hoje | `src/pages/home/ui/Home.jsx` |
| Trilha | `src/pages/learning-path/ui/PathTimeline.jsx` |
| Teste e resultado | `src/pages/checkpoint/ui/CheckpointPlayer.jsx` |
| Treinos extras | `src/pages/practice/ui/PracticeHub.jsx` |
| Meu espaço | `src/pages/progress/ui/ProgressOverview.jsx` |
| Testes de navegação | `tests/browser/flows.spec.js` |

## Próxima ação ao retomar

1. Abrir o **PR #24**: https://github.com/gen1nh/kotonoha/pull/24 (branch `feat/guided-ux-consolidation-20261015`).
2. Ler seus checks e logs do GitHub Actions, corrigir qualquer falha E2E ou de acessibilidade **antes** do merge.
3. Concluir os itens não marcados acima sem começar outra auditoria genérica.
4. Atualizar este CHECKIN com SHAs, evidências verificadas e pendências reais.
