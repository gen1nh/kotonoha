# Simulados — fluxo focado (outubro 2026)

## Regra de UX
Uma tarefa por vez. A aba **Simulados** funciona como menu curto e não carrega formulários, provas e materiais ao mesmo tempo.

- **Autoavaliação:** apenas a questão atual, alternativas, progresso e ações de avançar/voltar. Correção e explicações somente após finalizar.
- **Praticar no papel:** exercícios próprios num único destino, sem aparecer ao lado da prova.
- **Meus resultados:** registro manual em tela própria, histórico paginado de três itens e últimas autoavaliações recolhidas.
- **Material oficial JLPT:** links externos em tela própria, sem misturar links com questões e resultados.
- **Resumo de Progresso:** estatísticas detalhadas sob um painel recolhido. O acompanhamento do tempo deixou de aparecer misturado aos Simulados.

## Regras preservadas
Os critérios de acesso e as regras de aprendizagem N5 não mudam. Autoavaliações e notas pessoais não certificam JLPT nem desbloqueiam o próximo nível. Não modificar o formato de `state.mocks` e `state.diagnosticHistory`. Não mover para componentes globais ações usadas apenas pelo Progresso; respeitar FSD.

## Validação
Node tests, verificação arquitetural e editorial, build Vite e Playwright Chromium/WebKit. Teste de navegação mobile: menu sem questões, uma questão por etapa, respostas ocultas até finalizar, retorno ao menu, registro de nota sem overflow.
