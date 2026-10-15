# Fase 2 — Leitura, voz e segurança dos backups

## Entregas
- Preferência local para mostrar romaji (desligada por padrão), aplicada somente após revelar transcrição ou concluir prática.
- Transcrição latina revisada nas seis frases de escuta formativa N5. Frases sem leitura humana verificada continuam sem romaji para evitar erros em kanji e partículas.
- Preferência única de velocidade do japonês (0,5×, 0,75×, 0,85×, 1× e 1,15×), usada pelo TTS em geral, checkpoint e prática formativa; persistência local, sem exigir conta.
- Tela de conta com destaque para última sincronização e cópia de segurança mais recente; cópias anteriores continuam disponíveis, recolhidas em histórico.
- Fluxo de decisão de conflitos, formato de backup, login e sincronização permanecem intactos.

## Próxima evolução
- Revisar leituras de todas as frases N5 antes de oferecer romaji universal; não usar transcrição automática de kanji sem dicionário e revisão.
- Rever fontes japonesas em iOS/Android em teste real; a família japonesa existente deve ser preservada se estiver legível.
- Chat dedicado de dúvidas e tradução com IA opcional, sem armazenar chaves em servidor público ou prometer disponibilidade offline.
- Personalização por tema pedagógico com conteúdos originais, preservando objetivos N5 e critérios dos checkpoints.
- Importador pessoal para Anki comprado: não adicionar mídia de curso ao repositório ou deploy público sem autorização de redistribuição.

## Validação
`npm ci && npm test && npm run check:architecture && npm run audit:n5-course && npm run build && npm run test:e2e`.
