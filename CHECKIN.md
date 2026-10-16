# CHECKIN — Kotonoha

> **Arquivo de continuidade para qualquer IA ou desenvolvedor.** Atualize este documento na mesma PR em que mudar o projeto. Leia antes de modificar a interface. Este arquivo não substitui a revisão editorial ou os testes em aparelhos físicos.

## Como retomar o projeto

- **Repositório:** https://github.com/gen1nh/kotonoha
- **Branch principal:** `main`
- **Refatoração UX/UI:** [PR #24](https://github.com/gen1nh/kotonoha/pull/24), integrado à `main` em `e191c5947d12a0dcc0b2e37d6512742508473d1c`; CI do commit do PR aprovado: https://github.com/gen1nh/kotonoha/actions/runs/38827954953
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

## Refatoração de UX/UI — integrada à main

Os itens concluídos abaixo fazem parte da `main` após o PR #24. Isso **não significa que o deploy da Vercel ou o lançamento 1.0 estejam homologados**:
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
- [x] E2E Chromium/WebKit e verificações de currículo/arquitetura aprovados no SHA final da branch (`b0e9bed5bb7f8ee1528cc3605012038ff1db807e`) via GitHub Actions.
- [ ] Homologar o mesmo fluxo em dispositivos físicos e confirmar contrastes/uso real de teclado.
- [ ] Verificar acessibilidade WCAG, foco, target touch e contrastes; testar Safari físico.
- [x] PR #24 integrado à `main` após CI verde (merge `e191c5947d12a0dcc0b2e37d6512742508473d1c`).
- [ ] Confirmar CI da `main` após mesclagem e validar o deploy real da Vercel.

## Ajustes de UX motivados pelo uso real (PR #25 · integrado)

Integrado por squash à `main`: `a83f9497518ce3b90cde5335f41540a8d7b9c46f`. CI completo do commit do PR (Chromium, WebKit, build e auditorias): https://github.com/gen1nh/kotonoha/actions/runs/38830612713

- [x] A Trilha voltou a exibir uma timeline real; **só as cinco etapas** são expansíveis. Capítulos não exigem outro clique.
- [x] Status das lições em texto simples, sem pílulas verdes/azuis. Removido o componente não utilizado `LearningStatus.jsx`.
- [x] O botão **Voltar à Trilha** fica acima do conteúdo de um teste e na tela de resultado.
- [x] A correção depois do teste é apresentada diretamente no resumo, apenas com os erros, respostas corretas e explicações (não há botão “Ver correção”).
- [x] Hoje apresenta a atividade recomendada, o momento do ciclo Aprender/Revisar/Conferir e cores de fundo discretas.
- [x] Meu espaço tem quatro recursos de estudo em cards pastéis e links diretos para preparação, simulados e preferências.
- [x] Testes de navegador adaptados para os novos fluxos sem sanfonas aninhadas.
- [x] CI Chromium/WebKit, build, arquitetura e currículo aprovado no SHA final do PR #25 (`aee90f81b93860d6dc9101adcfaf601869075ed8`).
- [ ] Validar contraste, responsividade, dark mode e toque em iPhone real; documentar ajustes após teste com usuários.
- [x] Integrado à `main` via PR #25, sem mudança do modelo de dados ou currículo.
- [ ] Confirmar CI da `main` após o merge e implantação real na Vercel.

**Regra de design:** cores pastéis diferenciam grupos de ferramentas e superfícies, *não* status pedagógicos. Não reintroduzir tags de estado nem esconder lições atrás de capítulos expansíveis. O aluno deve acessar uma lição após **no máximo um clique para abrir sua etapa**. A correção só aparece **depois** de uma avaliação finalizada.

## Publicação e visualização no navegador — decisão aprovada

- [x] Desligar deployments Git automáticos na Vercel via `vercel.json` (`git.deploymentEnabled: false`). **Builds e testes do GitHub Actions continuam ativos**.
- [x] Documentar o fluxo local de prévia com `npm ci`, `npm run dev` e `http://localhost:5173`, ou `npm run preview` para simular produção.
- [x] Documentar publicação **manual** depois de CI aprovado usando `npx vercel --prod`, com login e vínculo ao projeto Vercel existente.
- [ ] Verificar se o painel da Vercel passou a respeitar a nova configuração após mesclar. Pode existir um último deploy do commit que muda `vercel.json`, ou a cota ainda pode estar esgotada.
- [ ] Quando o limite de build estiver liberado, fazer um único deployment manual e confirmar status **Ready**, commit publicado e interface atual. Não declarar publicado antes disso.

**Motivo:** a conta Hobby atingiu `build-rate-limit` após muitos commits. Evitar deploy Git por commit; o GitHub Actions valida os commits, mas **não publica**. O campo `Ignored Build Step` pode contar para a cota mesmo quando um build é cancelado; por isso preferimos desativar o gatilho de deploy Git, mantendo a Vercel para publicações autorizadas. Para reverter esta política, reabilitar `git.deploymentEnabled` explicitamente (e atualizar estas instruções). Consulte o README, seção "Ver as mudanças no navegador antes de publicar".

## Ajustes de consistência e conteúdo por nível (PR #27 · integrado)

Merge à `main`: `a57bd363922452f25b62b9175f421151298b7033`. CI final da branch aprovada nas duas execuções [38835569573](https://github.com/gen1nh/kotonoha/actions/runs/38835569573) e [38835575626](https://github.com/gen1nh/kotonoha/actions/runs/38835575626).

- [x] Template de largura única no `Shell` (`max-w-[52rem]`) e normalização do primeiro contêiner de cada rota; não deslocar telas com utilitários `max-w-2xl` ou `max-w-3xl` individuais.
- [x] Alternativa selecionada em teste usa azul suave, não verde de acerto antes de ser corrigida.
- [x] Revisão automática mostra **somente cartões já encontrados e vencidos**; não usa kana ou vocabulário inédito para completar listas. Cartões pessoais criados pelo próprio aluno continuam elegíveis.
- [x] Revisão vazia orienta a voltar à atividade recomendada em Hoje; não diz falsamente que uma sessão foi concluída.
- [x] Caracteres isolados de kana/kanji e exemplos japoneses na lição, leitura, cartões, checkpoint e desafio diário podem ser tocados para ouvir via voz nativa ja-JP; se não houver voz disponível, respeitar o feedback já fornecido pelo mecanismo de áudio.
- [x] Desafio rápido agora utiliza itens estudados e evita repetir perguntas até esgotar a seleção; registra IDs recentes localmente para evitar repetição imediata entre sessões.
- [x] Desafio diário N5 deriva de checkpoints das unidades aprovadas (até 10 recentes, múltiplas questões por unidade) e gira diariamente; a pergunta respondida fica vinculada ao dia no backup para não mudar após avançar de lição.
- [x] Prática extra de escuta usa sons/palavras que o aluno já viu e incorpora os exercícios autorais das unidades de escuta praticadas; ao esgotar o banco liberado, **não reinicia automaticamente** as mesmas seis questões.
- [x] Mantém a política offline-first: o **banco de itens atual é local e versionado**, sem banco remoto nem necessidade de login. Não inventar frases ilimitadas com IA; ampliar só com conteúdo editorial revisado.
- [x] CI Node, arquitetura, currículo, build e Playwright Chromium/WebKit aprovado no SHA final do PR #27 (`dbb34fd5fb14f26cd1f60f35f457f52b67adac8a`).
- [ ] Conferir CI do commit na `main` e prévia real após atualização do CHECKIN; publicação Vercel continua **manual**.
- [ ] Testar visualmente todas as rotas e dispositivos reais: larguras, scroll, áudio de japonês e safe areas.
- [ ] Fazer revisão editorial de novas questões antes de expandir a variedade além dos itens já aprovados.

**Princípio:** revisão nunca ensina algo inédito; lição apresenta conteúdo e SRS reforça depois. Desafio opcional deve usar conteúdo visto ou aprovado e não interferir no desbloqueio N4 nem nas evidências de escuta.

## Pendências obrigatórias antes da 1.0

- [ ] Revisão linguística japonesa **independente** de todas as 220 unidades e respectivos exemplos, feedback e distratores.
- [ ] Banco de avaliação final N5 aprovado com cobertura curricular, revisão independente e direitos de áudio verificados.
- [x] **Confirmação manual do usuário (15/10/2026):** áudio funcionando no computador e no iPhone; também testou a PWA instalada e o funcionamento offline no iPhone. Evidência relatada pelo usuário, não teste executado pela CI.
- [ ] Homologação física **completa** no iPhone/Safari: ainda verificar/documentar safe area, desenho, retomada após fechamento, navegação e outras rotas. O teste confirmado de áudio/PWA offline não comprova esses itens.
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

1. Confirmar CI da `main` após integrar a configuração manual e, quando liberada a cota, publicar **intencionalmente** pelo projeto Vercel existente; não esperar deploy automático.
2. Fazer testes com aprendizes iniciantes e aparelhos reais; observar pontos de confusão antes de alterar os fluxos novamente.
3. Concluir as caixas pendentes deste arquivo e do `docs/RELEASE_1_0_CHECKLIST.md`, sem começar outra auditoria genérica.
4. Atualizar este CHECKIN sempre que mudar código, resultado de testes ou condição de lançamento.
