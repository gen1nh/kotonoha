# Análise e organização do Kotonoha

## Resultado

O fluxo estava fragmentado: caminhos de estudo tinham destinos inconsistentes, a UI repetia metadados e havia código/testes de versões anteriores. A revisão corrigiu essas ligações, simplificou apresentação e preservou dados existentes em `kotonoha.v1`.

## Problemas corrigidos

| Problema encontrado | Correção |
|---|---|
| Início mostrava próximo conteúdo do nível selecionado, mas iniciava uma sessão aleatória N5 | N5 identifica a sessão introdutória; N4–N1 abrem sua lição real |
| Revisão da sessão revelava cartões sem atualizar agendamento | Avaliação explícita com reagendamento; fila estável durante a sessão |
| Seis destinos apertados no celular | Cinco destinos; conversa disponível pela biblioteca e agenda |
| Controles e metadados pareciam chips indistintos | Metadados textuais; controles preservam estado selecionado |
| Tipografia de interface dependia de fallback e alternava fontes decorativas | Inter variável local e fallback japonês sans-serif; numerais tabulares para contagens |
| Cores verde/amarelo dominavam superfícies e botões | Neutros, carvão e sakura; verde restrito ao feedback de acerto |
| Títulos repetidos por rótulos acima | Removidos na biblioteca, trilha, progresso e preferências |
| Testes importavam módulos .js que tinham virado .jsx; npm test não executava testes | Módulos puros voltaram a .js; testes de lógica restaurados e browser suite migrada para controles atuais |
| Componentes antigos duplicavam os novos componentes compartilhados | Removidos SectionHeading, ProgressLine e TopicTile sem consumidores |
| Views.jsx reunia áreas sem relação | Separado em Learn, Drawing, Review e Settings |
| Preferências configurava Groq, mas conversação ignorava essa configuração | Um cliente usa chave/modelo da sessão; fallback local por proxy |
| Credencial local referenciada por variável pública Vite | Removida do cliente; configuração do proxy fica no servidor |
| Novo perfil já trazia itens marcados como dominados | Sugestões iniciais começam em Quero aprender; perfis salvos não foram alterados |
| Progresso chamava atividade registrada de domínio | Texto distingue atividade, meta de horas e prontidão para prova |
| Gravação mantinha microfone e URLs temporárias após uso | Liberação das faixas e URLs; formato fornecido pelo navegador |
| Abas sem navegação por setas, diálogos sem foco contido | Utilitários compartilhados de teclado e foco; Escape e retorno ao controle de origem |
| Notas sem seleção por teclado e editor com main aninhado | Seleção por teclado, título rotulado e landmark corrigido |

## Remoções verificadas

- Arte rejeitada `public/brand/study-nook.png`, sem referências ativas.
- Arquivos da antiga fonte Noto Sans JP não carregada pelo app.
- Scripts de migração `design/ui-refine.cjs`, `design/audit-ui.mjs` e log obsoleto que apontavam para CSS/seletores inexistentes.
- Agregador Views.jsx, substituído por módulos de área.
- Quatro arquivos E2E com seletores da antiga UI, substituídos por testes dos fluxos atuais.
- Imports sem consumidores e exports de interface duplicados.

Skills instaladas, dados do navegador e configuração local foram preservados. Evidências históricas em `.impeccable` não são carregadas pelo aplicativo nem distribuídas integralmente no ZIP.

## Fluxo atual

Início → sessão N5 ou próxima lição N4–N1. Biblioteca → kana, palavras, gramática, conversa, recursos e mídia. Revisar → revelar e avaliar cartões. Trilha → conteúdo, atividade registrada e simulados. Caderno → Kanban, notas e dúvidas. Preferências → backup e configuração de IA.

## Limitações reais e prioridades seguintes

1. **Conteúdo:** sessão guiada contém três microlições N5; N4–N1 ainda não são um curso completo. Expandir após definir sequência pedagógica e revisão editorial.
2. **Diagnóstico:** horas e cartões vistos não medem domínio do idioma. Falta um teste diagnóstico calibrado; não há previsão confiável de aprovação.
3. **Caderno:** editor textual com modelos, não um editor por blocos. Notas e cartões Kanban ainda são coleções independentes; falta ligação entre eles e desfazer exclusão.
4. **Continuidade:** progresso local não sincroniza automaticamente entre iPhone e desktop. Sessão fecha sem retomada exata de etapa; não é apresentada como pausada.
5. **Mídia:** exemplos e ferramentas de prática não equivalem a um catálogo completo de cortes licenciados, músicas e vídeos. Fontes externas dependem da rede e disponibilidade.
6. **IA:** Groq exige rede. Proxy local exige serviço configurado no computador; hospedagem estática precisa de backend equivalente ou chave da sessão. Chamadas reais não foram feitas nesta verificação.
7. **Navegação:** navegação interna ainda não oferece URLs por lição e histórico completo do botão Voltar do navegador.
8. **Dispositivos:** validação móvel feita em Chromium emulado. Voz japonesa, microfone e instalação devem ser conferidos em iPhone físico; não há alegação de teste Safari real.

## Validação

Build de produção aprovado; 11 testes de lógica; 7 testes de navegador. Fluxos de nível, lição, teclado, Katakana, SRS, sessão, notas, backup e modo offline cobertos. Seis telas em desktop e celular sem violações na verificação automatizada axe WCAG A/AA e sem overflow horizontal. Isso não substitui auditoria manual completa de acessibilidade. Revisão visual independente aprovou a correção dos rótulos redundantes.
