# Kotonoha 1.0 — gate de publicação

> Atualização de 2026-10-13: a refatoração foi integrada na branch de trabalho e validada localmente (82 testes unitários, build, 15 E2E aprovados e 1 ignorado). Consulte [INTEGRATION_VALIDATION.md](INTEGRATION_VALIDATION.md). O histórico abaixo registra o estado anterior; o bloqueio editorial da versão 1.0 continua válido.

**Status: NÃO LIBERAR PRODUÇÃO.** A meta da 1.0 é ensinar do zero até as competências N5 e permitir a passagem ao N4 apenas após uma prova interna validada, abrangendo vocabulário/kanji, gramática, leitura e áudio. A prova não corresponde à pontuação ou certificação oficial JLPT.

## Estado atual

- A fundação de correção e proveniência editorial está neste PR.
- Um pacote local refatorado inclui a integração de progresso, separação entre micro-checkpoints e certificação, tela de preparação N5, runner de avaliação interna, currículo editorial, importador JMdict e teste de bloqueio de lançamento.
- No pacote local, 76 testes unitários passaram; a análise sintática de módulos JavaScript/JSX não encontrou erros.
- O repositório `main` ainda precisa ser reconciliado com o código refatorado do pacote local. **Não publicar/mesclar como 1.0 antes dessa reconciliação.**
- A auditoria de N5 falha intencionalmente por não haver o mínimo de 20 itens aprovados por habilidade, em especial áudio offline licenciado.
- O pacote não foi validado com `npm run build`, Playwright nem Safari físico; o ambiente de preparação não possui as dependências npm em cache.

## Gate da 1.0

1. Integrar refatoração ao branch e garantir migração do estado local sem perda de notas, revisões ou checkpoints.
2. Ampliar e revisar conteúdo N5: kana complementares, vocabulário, kanji, gramática, leitura e escuta.
3. Adicionar pelo menos 80 itens **revisados e rastreáveis** (20 por habilidade como mínimo inicial), com áudio real nos itens de listening.
4. Auditar licenças (JMdict/EDRDG, KanjiVG, Tatoeba e gravações), gabaritos e alternativas. Questões geradas não podem ser aprovadas automaticamente.
5. Executar testes unitários, build Vite, Playwright, acessibilidade, PWA offline e Safari iOS.
6. Revisar e só então publicar. Sem sincronização em nuvem nesta fase.

O pacote refatorado completo precisa ser sincronizado num commit separado; este documento registra o bloqueio para evitar um release enganoso.
