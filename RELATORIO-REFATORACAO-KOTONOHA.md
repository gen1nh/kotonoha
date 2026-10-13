# Kotonoha — Relatório consolidado de implementação UI/UX + QA

**Data:** 13/10/2026
**Base:** `kotonoha-uiux-qa-versao-unificada.zip` + inventário de 58 achados.
**Entrega:** código-fonte pronto para **tentar** o build em Vercel, mas **não homologado em produção**. Sem sincronização/autenticação em nuvem.

## O que foi realizado

Em vez de patches isolados, foi unificada a seleção do próximo conteúdo em `courseUnits.js` + `learning.js`, com regras de acesso em `routeAccess.js` e checkpoints em `checkpoints.js`. O N5 possui microlições de kana/vocabulário/gramática. A Home não escolhe lições aleatórias, a Trilha é o curso oficial e as ferramentas opcionais ficam em Praticar. A navegação mobile mantém quatro destinos; lição, revisão e checkpoint usam tela imersiva.

A interface voltou a **Nunito + M PLUS Rounded 1c**, com botões arredondados/táteis, tokens de contraste e modo escuro. O progresso local preserva a chave existente `kotonoha.v1`, usa esquema 2, normaliza dados legados, salva rascunhos e torna flashcards pessoais elegíveis para SRS. No iOS foram tratados ciclo de voz, seleção de formatos MediaRecorder e desenho em coordenadas proporcionais; **esses ajustes ainda não comprovam funcionamento em um iPhone real**.

### Verificações efetuadas

- `npm test`: **56/56 testes aprovados**, incluindo regressões para curso, checkpoints e backups.
- Parsing de JSX/JS e resolução de imports relativos: aprovado na inspeção estática.
- Build Vite e testes Playwright/WebKit: **não executados**, porque a instalação npm falhou no ambiente disponível (`Exit handler never called`).
- Safari físico, gravação, áudio, VoiceOver, PWA offline real e testes com usuários: **pendentes de validação externa**.

### Como interpretar os status

- **Código ajustado:** a causa identificada recebeu alteração específica e, quando viável, teste unitário. **Não significa QA visual homologado**.
- **Parcial:** solução estrutural implantada, mas resta dívida de implementação/validação no código ou UX.
- **Homologação externa:** depende de executar browser/build ou usar aparelho real; não é resolúvel apenas inspecionando fonte.

## Matriz dos 58 achados

| # | Problema identificado | Situação no pacote | Ação / limitação |
|---:|---|---|---|
| 01 | Sessão guiada de 15 min é um segundo currículo: escolhe microlição independente e aleatória da trilha. | Código ajustado | StudySession antigo arquivado; `nextGuidedAction` dirige Home, Trilha e Prática. |
| 02 | Trilha exibe nível efetivamente liberado, mas seletor de nível em outras telas altera apenas `selectedLevel`. | Código ajustado | Seletor de referência restrito à Biblioteca; `courseLevel` é calculado por progresso. |
| 03 | Biblioteca oferece estudar, praticar, caligrafia, gramática, fontes web e mídias no mesmo destino. | Parcial | Consulta preservada com caligrafia e materiais opcionais; ainda é componente grande. |
| 04 | Chamada `go("jlpt")` na gramática avançada vai apenas à Trilha genérica, não à lição correspondente. | Código ajustado | Destino contextual de lição, tópico e nível; entrada antiga redirecionada. |
| 05 | Retorno da revisão guiada está fixado em N5; para outras origens, Voltar usa destinos genéricos. | Código ajustado | Contexto de revisão salvo no histórico para retornar à lição de origem. |
| 06 | Home, Trilha e Progresso repetem barras e listas do progresso geral. | Código ajustado | Home resume; Trilha é timeline; Progresso apresenta indicadores. |
| 07 | Configuração da meta aparece no onboarding, na Home e nas Preferências. | Código ajustado | Preferências controla meta; onboarding apenas sugere valor inicial. |
| 08 | Mesmo filtro JLPT pode ser alterado em Configurações, Progresso e Trilha, sem relação clara com desbloqueio. | Código ajustado | Removidos seletores de nível da Trilha/Progresso; consulta na Biblioteca. |
| 09 | Praticar reúne SRS, Biblioteca, Caderno, laboratórios, sessão curta e quiz; ainda exige que iniciante classifique ferramentas. | Código ajustado | SRS recebe destaque; laboratórios opcionais recolhidos; sem sessão aleatória. |
| 10 | Questionário diário, desafio rápido, checkpoint, avaliação diagnóstica e exercícios avançados não possuem nomenclatura suficientemente distinta. | Código ajustado | Diferenciados treino opcional, checkpoint, revisão e diagnóstico. |
| 11 | Área Progresso mostra sempre o detalhamento das quatro etapas N5, mesmo quando o aluno está em outro nível. | Código ajustado | Progresso aponta domínio atual sem replicar a lista de passos. |
| 12 | Caderno, diário de erros, dúvidas e flashcards pessoais são ferramentas próximas, mas aparecem como percursos próprios. | Código ajustado | Erros incorporados ao Caderno. |
| 13 | Existem componentes históricos grandes não referenciados nas rotas atuais (`Jlpt.jsx` e `ConversationChat.jsx`). | Código ajustado | Componentes históricos movidos para docs/history, fora do app ativo. |
| 14 | Uma questão correta de gramática marca os cinco tópicos da lição como estudados. | Código ajustado | Uma microlição/questão por tópico de gramática; progresso específico. |
| 15 | Progresso de hiragana/katakana exige que os 46 cartões sejam vistos antes de sequer tentar um checkpoint curto. | Código ajustado | Kana fragmentados em microlições; primeira avaliação disponível cedo. |
| 16 | Checkpoint N5 tem cinco perguntas determinísticas para volumes bem maiores de conteúdo; repetição não reamostra itens. | Código ajustado | Questões variam por unidade e tentativa; mantém equivalência de aprovações antigas. |
| 17 | Flashcard pessoal novo, nunca visto, não entra na fila geral de revisão. | Código ajustado | Cartões pessoais novos entram em lotes gerais. |
| 18 | Critério de avançar é desigual: N5 usa checkpoint >=80%; N4–N1 concluem lição com quiz >=75%, sem checkpoint equivalente. | Código ajustado | Lições avançadas agora usam exigência de aprovação 80%. Conteúdo continua limitado. |
| 19 | O conteúdo N4–N1 é introdutório (3 lições e 12 perguntas por nível), mas navegação pode transmitir sensação de curso N1 completo. | Código ajustado | N4–N1 rotulados como prévias introdutórias no curso e manifesto. |
| 20 | `lessons` booleano, `cards.seen`, checkpoints e SRS representam coisas diferentes sem modelo formal comum. | Parcial | Estados funcionais separados, mas migração gradual do modelo booleano legado permanece. |
| 21 | Marcar cartão como visto e acertar checkpoint são sinais distintos, mas barras às vezes os apresentam como o mesmo progresso. | Parcial | Aprovação e exposição diferenciadas; tela a tela ainda precisa de validação visual. |
| 22 | Revisão geral entrega todos os cartões vencidos de uma vez, sem limite de lote. | Código ajustado | Fila SRS limitada a 10 cartões. |
| 23 | Meta diária contabiliza uma revisão mesmo com respostas erradas; tempo e XP refletem participação, não domínio. | Código ajustado | Meta conta sessão significativa concluída, checkpoint e lição aprovada. |
| 24 | Streak pode ser acionado após uma única avaliação SRS, inclusive marcada como “Preciso rever”. | Código ajustado | Removido streak automático após uma única classificação de cartão. |
| 25 | A sessão curta informa meta de 15 minutos, enquanto a meta diária é por atividades, criando dois objetivos concorrentes. | Código ajustado | Sessão alternativa de 15 minutos retirada do fluxo ativo; uma meta de atividades. |
| 26 | Métricas “cartões encontrados” e “total de revisões” aparecem sem orientação sobre o que melhorar amanhã. | Código ajustado | Progresso destaca próxima competência, vencimentos e contexto. |
| 27 | Fonte do aplicativo (Inter) contradiz a fonte Nunito do `MASTER.md`; direção visual mudou sem especificação consolidada. | Código ajustado | Nunito restaurada; dependência Inter excluída; japonês em M PLUS Rounded. |
| 28 | Design guide descreve seis laboratórios na Home; Home atual não possui tal grade. | Código ajustado | MASTER reescrito como fonte única de design e fluxos atuais. |
| 29 | Existem botões do sistema 3D e botões desenhados manualmente, variando bordas, estados e tamanhos. | Parcial | Componentes principais usam UI compartilhada; alguns laboratórios legados possuem estilos próprios. |
| 30 | Ícones misturam preenchimento sólido e traços contornados apesar de a diretriz afirmar todos sólidos. | Parcial | Diretriz de ícones consolidada; uniformização visual fina requer screenshots. |
| 31 | Cores antigas/órfãs são referenciadas (`text-sakura`, `text-blue-ink`) sem tokens correspondentes no CSS atual. | Código ajustado | Aliases semânticos e tokens órfãos corrigidos. |
| 32 | CSS acumula declarações repetidas de `scroll-padding` e regras de temas/marcas antigas. | Código ajustado | Duplicações de scroll/CSS removidas; CSS consolidado na medida possível. |
| 33 | Texto azul e laranja do dark mode têm contraste de ~4,11:1 e ~3,50:1 sobre `#111714`. | Código ajustado | Tokens azul e laranja escuro revistos; revisão de tela renderizada pendente. |
| 34 | Parte do canvas de pronúncia pinta com cores absolutas (`#ffffff`, `#58cc02`) e não acompanha o tema. | Código ajustado | Canvas de pronúncia lê cores CSS do tema. |
| 35 | Cores vivas originais não podem ser aplicadas diretamente a texto comum: `#58CC02` em branco tem ~2,09:1. | Código ajustado | Marca vibrante separada de texto/botão com contraste mais forte. |
| 36 | Áudio japonês usa SpeechSynthesis sem aguardar `voiceschanged` ou garantir voz japonesa disponível no Safari. | Parcial | Adaptador speechSynthesis lida com vozes e eventos; Safari real ainda não validado. |
| 37 | Laboratório de pronúncia cria Blob como `audio/webm` independentemente do codec real do gravador. | Código ajustado | MediaRecorder identifica codec suportado e usa mimeType real. |
| 38 | AudioContext e MediaRecorder dependem de ativação/permissão no iPhone e carecem de teste de retomada/suspensão de áudio. | Parcial | AudioContext.resume e cleanup adicionados; permissões/retomada iOS precisam de aparelho. |
| 39 | Flashcard SRS com min-height 380/460px e `py-16` pode competir com header/sticky em tela pequena. | Código ajustado | Cartões SRS ajustados para viewport reduzido. |
| 40 | Simulador LINE possui altura mínima 660px, potencialmente desconfortável em celulares compactos. | Código ajustado | Altura fixa mínima do simulador reduzida. |
| 41 | No canvas de escrita os pontos são salvos em pixels CSS sem transformação ao redimensionar/orientar. | Código ajustado | Traços de escrita usam coordenadas relativas e redimensionamento. |
| 42 | `Learn` expõe visualizações de web/mídia no `tabpanel` sem aba ARIA correspondente ativa. | Código ajustado | Recursos complementares ganham aba ARIA ativa quando abertos. |
| 43 | Hook de foco encontra o primeiro `role=dialog` do documento, não a instância atual; problemático com overlays concorrentes. | Parcial | Foco busca último diálogo aberto; arquitetura universal de overlays ainda não implementada. |
| 44 | Navegação inferior/sticky e elementos de diálogo ainda não foram comprovados em 320px, landscape e teclado iOS. | Homologação externa | E2E e checklist definidos; exige inspeção em 320px, landscape, teclado iOS. |
| 45 | Exercícios impressos usam `window.print()` sem uma folha específica nem CSS `@media print`. | Código ajustado | CSS @media print e folha de exercícios A4. |
| 46 | A área de escrita não tem alternativa equivalente para usuário que não consegue desenhar com o dedo; papel existe, mas não está contextualizado. | Parcial | Prática no papel mantida; equivalência plena sem canvas exige validação de acessibilidade. |
| 47 | Resultado parcial de checkpoint e respostas avançadas vivem apenas em estado local React; refresh/update pode apagar trabalho não enviado. | Código ajustado | Rascunhos de checkpoint e respostas avançadas persistidos. |
| 48 | Falha de quota no localStorage apenas mostra toast; UI continua permitindo edição sem indicação persistente de progresso não salvo. | Código ajustado | Falha de quota exibe alerta persistente e exportação de emergência. |
| 49 | Backup usa chave `kotonoha.v1` com campos evoluindo, mas não há `schemaVersion` nem migrações explícitas auditáveis. | Código ajustado | schemaVersion=2 e normalização compatível com versões anteriores. |
| 50 | Normalização aceita alguns campos aninhados (notas, erros, recursos) quase sem validar formato/conteúdo. | Parcial | Sanitização adicional de notas, erros e recursos; schema completo por domínio ainda evolutivo. |
| 51 | Persistência clona e serializa todo o estado a cada update; edição longa de notas pode causar custo desnecessário no mobile. | Parcial | Gravação serializada com debounce; clonar estado inteiro continua existindo. |
| 52 | PWA usa `autoUpdate` do service worker sem proteger explicitamente exercícios em andamento contra atualização de página. | Parcial | PWA mudou autoUpdate para prompt e rascunhos persistem; UX de atualização pode evoluir. |
| 53 | Tutor AI sem chave fica indisponível no deploy (fallback `/api/ai` limitado ao proxy dev/preview); UX precisa assumir isso. | Parcial | IA continua opcional e sem backend Vercel por padrão; chave por sessão. |
| 54 | Conteúdo de UI ocioso e assets de design/animação (11MB) continuam no projeto, dificultando manutenção. | Parcial | Código antigo arquivado; assets históricos permanecem no repositório mas fora do bundle. |
| 55 | Build de produção não executou no ambiente: Vite não instalado; não há aprovação executada de Playwright. | Homologação externa | npm ci falhou no ambiente disponível; build/Playwright não executados. |
| 56 | CI configura apenas Chromium; não testa WebKit/Safari, Android nem iPhone, apesar de bugs de áudio e teclado relatados. | Código ajustado | CI agora configura Chromium/WebKit; Safari físico/Android ainda precisam testes. |
| 57 | Nome `1.0.0` e manifesto descrevem N5–N1 quando o produto ainda carece de homologação e conteúdo integral. | Código ajustado | Versão 0.9.0 e manifesto honesto quanto aos limites de N4–N1. |
| 58 | Mais de dez relatórios de fases e instruções antigas permanecem na raiz do projeto e podem confundir manutenção. | Código ajustado | Documentação canônica atualizada; relatórios antigos arquivados. |


## Riscos que impedem dizer “100% resolvido”

1. **Áudio e gravação iOS:** dependem de Safari físico, permissões e vozes japonesas instaladas. Não há áudio proprietário baixado ou garantido offline.
2. **Bundle e UI renderizada:** os testes de Node não substituem `npm run build`, Playwright, axe e inspeção das telas em 320px, landscape e teclado virtual.
3. **Complexidade residual:** algumas páginas de laboratórios e consulta têm componentes próprios; a funcionalidade foi preservada, sem remoção precipitada. Não seria correto afirmar que todo botão customizado já foi eliminado.
4. **Conteúdo:** N4–N1 permanecem prévias autorais. A refatoração não inventou milhares de lições ou provas oficiais completas.
5. **Fontes remotas:** Nunito e M PLUS Rounded são solicitadas por Google Fonts; há fallback local quando offline, mas os arquivos não estão embutidos.
6. **IA na Vercel:** `/api/ai` não tem endpoint de produção incluído, portanto a IA é opcional via chave do usuário; nenhuma chave privada foi incorporada ao pacote.

## Homologação que falta executar (bloqueia publicação definitiva)

Veja `docs/TEST_PLAN.md` para matriz detalhada e registros de evidência. A sequência mínima é `npm ci && npm test && npm run build && npx playwright install --with-deps chromium webkit && npm run test:e2e`, seguida de teste Safari físico para áudio, gravação, scroll, canvas e PWA. Se o CI encontrar falhas, resolvê-las antes de publicar como 1.0.

## Arquivos de entrada para manutenção

- `README.md` — contrato público da versão.
- `design-system/kotonoha/MASTER.md` — sistema visual.
- `docs/UX_ARCHITECTURE.md` — fluxo de produto único.
- `docs/TEST_PLAN.md` — checklist de aceitação.
- `CHANGELOG.md` — histórico atual.

**Regra de manutenção:** um novo botão que escolha outra lição, uma nova variável que represente a mesma meta ou uma nova rota que ignore pré-requisitos constitui regressão arquitetural. Não implementar sincronização em nuvem.
