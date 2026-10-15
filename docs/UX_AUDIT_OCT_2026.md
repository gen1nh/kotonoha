# Kotonoha — Revisão UX/UI e didática (outubro de 2026)

## Direção
Melhorar o aplicativo atual, sem redesign. Preservar as tipografias, paleta, componentes táteis, navegação e histórico N5. Seguir as skills `feature-sliced-design`, `ui-ux-pro-max`, `design-system` e `impeccable`. No mobile, revelar o próximo passo sem sobrecarregar a tela; no desktop, manter o espaço útil.

## Melhorias implementadas nesta branch
- **Checkpoint:** uma questão visível de cada vez, navegação anterior/próxima, progresso e correção somente ao final. As respostas continuam persistidas e recuperáveis.
- **Gramática N5:** escolha de alternativa não exibe imediatamente correto/incorreto; há confirmação explícita antes do feedback.
- **Digitação japonesa:** removida a conversão automática visível durante a escrita. Em caso de erro, a leitura esperada só aparece após escolher mostrá-la.
- **Preferências:** seções Estudo e sons / Conta e backups / Mais opções; explicação do que conta na meta diária.
- **Progresso:** seções Resumo / Preparação N5 / Simulados, reduzindo a extensão da página mobile.
- **Áudio:** opção 0,5× no checkpoint e na escuta N5, ampliando o limite interno do TTS; mantém voz japonesa e fallback existente.
- **Login:** ícone do Google no botão de autenticação.
- **Lousa:** instrução persistente destacada oculta em telas pequenas para dar prioridade à área de desenho.

## Avaliação item a item
| Tema | Decisão / pendência |
| --- | --- |
| Revelação precoce | Corrigir confirmações automáticas; exercício com resposta deve pedir conferência explícita. Revisar outras práticas em uma auditoria funcional por fluxo. |
| Sessão | Checkpoints adotam uma questão por vez. As telas de explicação continuam adequadas para estudo exploratório. |
| Preferências | Divididas em três seções; não remover opções avançadas. |
| Nuvem e backup | Agrupados numa seção. Próximo passo: cartão de último backup, recuperação única em destaque e histórico detalhado acessível, sem apagar cópias existentes. |
| Hierarquia visual | Preservar componentes atuais; dar destaque apenas às ações principais e destrutivas. |
| Velocidade da voz | Agora inclui 0,5× nas práticas tratadas. Unificação da preferência entre telas ainda pendente. |
| Fontes japonesas | Manter `font-jp` e verificar legibilidade real de kana/kanji em iOS, Android e desktop antes de substituir. |
| Romaji opcional | Requer leituras confiáveis de kanji e frases; `toRomaji` não resolve kanji por si. Implementar após validar o modelo de conteúdo e a preferência persistida. |
| Sons de acerto/erro | `src/shared/audio/index.js` já centraliza correct, incorrect, complete. Precisa checklist de eventos por fluxo e testes de silêncio/volume. |
| Lousa mobile | Primeiro ajuste aplicado; próximo teste com dedo, safe-area, canvas e ferramentas em aparelhos reais. |
| Navegação longa | Preferências e Progresso segmentados; revisar Biblioteca e Caderno separadamente. |
| Recursos visuais | Preferir elementos alinhados ao design atual e com função pedagógica, não ilustrações decorativas. |
| Textos | Remover avisos técnicos de áreas de estudo; guardar detalhes de provedores e certificados em ajuda. Não ocultar restrições relevantes de disponibilidade. |
| Chat de dúvidas | IA opcional já existe em funções específicas. Um chat dedicado deve usar a conexão atual, informar quando estiver indisponível e não bloquear trilha offline. |
| Metas | Explicadas em Preferências; revisar exemplos e semântica com alunos. |
| Estudar com temas (ex.: Dragon Ball) | Feature futura opt-in baseada nos objetivos N5; gerar exemplos sem substituir fundamentos nem depender de material protegido de franquias. |
| Baralhos Anki pagos | Não distribuir arquivos no repositório público nem na Vercel sem licença de redistribuição. Considerar importação local privada, com deduplicação e validação editorial. |

## Gates de segurança da implementação
Executar `npm ci`, `npm test`, `npm run check:architecture`, `npm run audit:n5-course`, `npm run build`, `npm run test:e2e`. Não integrar se falharem; preservar progressão, dados, backup, autenticação e modo offline.
