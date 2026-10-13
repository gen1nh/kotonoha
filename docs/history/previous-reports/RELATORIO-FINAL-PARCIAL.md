# Kotonoha — implementação de checkpoints (entrega parcial)

## Implementado
- Checkpoints locais de 5 questões para hiragana, katakana e vocabulário N5, com aprovação a partir de 80%.
- Progressão da trilha condicionada à aprovação, não apenas à visualização de cartões.
- Feedback de respostas, possibilidade de nova tentativa, persistência e validação de backup.
- Compatibilidade com progresso legado: os cartões permanecem salvos; as novas avaliações precisam ser realizadas para validar as etapas.
- Gramática N5 mantém conclusão anterior, pois não existe banco de questões próprio suficiente para checkpoint nesta etapa.
- 32 testes unitários aprovados.

## Limitações e pendências
- Não foi possível executar build: vite não está instalado no ambiente e npm ci excedeu o tempo disponível.
- Testes Playwright e Safari/iOS não executados.
- Integração automática de revisão SRS com checkpoints e avaliação equivalente para gramática e N4-N1 ainda pendentes.
- A interface precisa de inspeção visual em navegador antes de publicação.
- Nenhuma sincronização em nuvem foi adicionada.

## Comandos de validação
npm ci
npm test
npm run build
npm run test:e2e
