# Estabilização consolidada — outubro de 2026

## O que foi corrigido no código
- Subpáginas de Praticar, Biblioteca, Caderno, Progresso, Simulados e Preferências integram o histórico do navegador, com retorno próprio e restauração via URL.
- Recuperações de conflito ficam limitadas a cinco snapshots neste navegador. A nova cópia deve ser gravada antes da remoção de antigas; erro de quota cancela a substituição.
- O romaji opcional não aparece antes de responder ao Desafio Diário; a Biblioteca e o laboratório de mídia respeitam a preferência. Leitura em kana é apresentada separadamente, evitando ruby incorreto de frase inteira.
- Controle de velocidade individual em revisão e desafio, preservando a velocidade/voz padrão. Qualidade e disponibilidade de TTS ainda dependem do dispositivo.
- Simulados selecionam nível sem mudar a Trilha; resultados têm origem opcional; rascunhos de autoavaliação persistem sem alterar desbloqueio.
- Textos técnicos sobre banco editorial não aparecem no Progresso; orientação da lousa mobile, toque e rotulagem receberam ajustes.
- Documentação principal reconciliada com o código corrente.

## Contratos de preservação
Chave `kotonoha.v1`, IDs de unidades/cartões, SRS, checkpoint, autenticação Supabase, retenção dos dados locais e versão de schema 2 não são alterados. Preferências locais mantêm chaves próprias. N4 permanece bloqueado pela avaliação interna independente. Não importar mídia de curso sem direito de redistribuição.

## Homologação fora do alcance da CI
- [ ] Safari físico no iPhone: SpeechSynthesis em japonês, fontes/kana/kanji, reprodução MP3 ou gravação autorizada, permissão de microfone, teclado, rotação, VoiceOver, safe areas e PWA offline
- [ ] Android físico: vozes disponíveis, TalkBack, fontes e armazenamento
- [ ] Conferência linguística por especialista do N5, furigana por item, explicações e questões
- [ ] Licença, proveniência e atribuição por áudio/material de terceiros
- [ ] Teste das políticas RLS e conflitos no Supabase real com duas contas e dois dispositivos
- [ ] Validação de backup corrompido e restauração após falta de espaço em aparelhos reais

## Gates
`npm ci`, `npm test`, `npm run check:architecture`, `npm run audit:dead-code`, `npm run audit:n5-course`, `npm run build`, `npm run test:e2e`. `npm run audit:n5-release` deve **continuar falhando** enquanto não existir banco certificado, revisto e licenciado. Nunca declarar v1.0 aprovada a partir da CI apenas.
