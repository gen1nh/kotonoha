# Fase 7 — Proteção de navegação e métricas

## Alterações implementadas
- `src/routeAccess.js`: fonte única para validar telas permitidas, incluindo URLs diretas e histórico do navegador.
- `src/App.jsx`: aplica a proteção também ao carregar o aplicativo, ao voltar/avançar no navegador e ao mudar o nível selecionado; URLs bloqueadas são substituídas pela central de prática.
- `src/components/DailyQuestion.jsx`: desafios diários não incrementam mais contadores de revisão espaçada nem de acerto de flashcards, evitando métricas distorcidas.
- `src/components/Home.jsx` e `Settings.jsx`: textos diferenciam claramente o desafio diário, a meta opcional de minutos e a conclusão de lições.
- `tests/route-access.test.js`: três testes de proteção de rota.

## Verificação
- `npm test`: 25/25 aprovados.
- Build, Playwright e Safari/iOS: não executados nesta fase. Não declarar validação mobile ou de produção.

## Pendências
- Revisão visual em dispositivos reais, inclusive reprodução de áudio no iOS.
- Meta configurável baseada em conclusão de atividades pedagógicas.
- Revisão detalhada de correspondência entre telas, lições e pré-requisitos.
- Expansão curricular e sincronização opcional entre dispositivos.
