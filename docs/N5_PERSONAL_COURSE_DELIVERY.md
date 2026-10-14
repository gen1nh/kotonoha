# Kotonoha 0.9.1 — Entrega candidata do curso N5 pessoal

## Visão

Foco no **N5**, sem construir N4–N1 agora. Os níveis superiores permanecem como prévias não concluídas. O aplicativo é estático, offline-first, sem backend, contas, custos fixos, banco de áudios nem exigência de API paga.

## Dados estruturados de aprendizagem

- 46 hiragana básicos e 46 katakana básicos, mais 58 combinações de sons por escrita; 104 sinais/combinações por sistema.
- 554 entradas de vocabulário temático candidatas (não são lista oficial JLPT); romaji é auxiliar e dispensável depois de aprender kana.
- 105 kanji introdutórios **em palavras contextualizadas**. Uma leitura ilustrada não corresponde a todas as leituras do mesmo ideograma.
- 46 tópicos de gramática, com explicações e exemplos originais; incluindo flexões, partículas e funções cotidianas.
- 25 pequenas atividades de leitura e 40 situações de compreensão auditiva com TTS do aparelho.
- 220 microlições sequenciais, blocos temáticos recolhíveis na Trilha e checkpoints para cada unidade.
- Uma revisão final formativa com 32 questões (8 por habilidade), retomada via progresso local e feedback por habilidade.
- Exercícios e revisão final não concedem aprovação JLPT, não provam habilidade auditiva plena com voz sintética, nem liberam o N4.

## Qualidade e continuidade

- A auditoria `npm run audit:n5-course` verifica completude estrutural, questões, IDs únicos, rotas de cartões, banco da revisão pessoal, migração e prevenção de promoção indevida. **Passar nessa auditoria não implica revisão pedagógica ou proficiência real**.
- O gate mais rigoroso `npm run audit:n5-release` continua bloqueado: zero questões editoriais aprovadas para certificação, sem gravações revisadas para prova de escuta.
- Checkpoints de tópicos legados continuam válidos **apenas para os passos antigos**; ninguém pula conteúdo novo apenas por uma aprovação antiga.
- Dados antigos do usuário são preservados na chave `kotonoha.v1`. `n5Practice` é opcional e sobrevive ao backup; sem contas nem sync.
- O app carrega somente código e dados textuais compactos; nenhuma biblioteca de mídia foi incorporada.

## Pendências antes de declarar N5 finalizado pedagogicamente

1. Revisar integralmente as traduções, leituras, exemplos e distratores, com atenção a homônimos, polissemia, flexões, duração vocálica e grau de formalidade. Revisão preferencialmente com pessoa competente em japonês; não mascarar revisão de IA como independente.
2. Auditar progressão didática: vocabulário apresentado depois de kana, mas antes de tópicos gramaticais pode produzir exemplos acima da habilidade; ajustar sequência e ensino prévio onde necessário.
3. Melhorar evidência de aprendizado: checkpoints de 4–5 itens e prova final formativa não são calibração de nível. Acrescentar novos exemplos, atividades de recuperação ativa e variantes de leitura/escuta caso usuários memorizem as respostas.
4. Testar Vite build, Playwright Chromium/WebKit e dispositivos reais (especialmente Safari iPhone, áudio local, acessibilidade, atualização offline e backup de versões anteriores).
5. Não declarar a prova certificadora equivalente ao JLPT. Quando houver real necessidade de N4, planejar novo conteúdo e uma avaliação justa. Não liberar N4 ao completar apenas a revisão formativa.

## Como validar

```bash
npm ci
npm test
npm run audit:n5-course
npm run build
npm run test:e2e
npm run audit:n5-release # falha intencionalmente até existir avaliação certificadora revisada
```

## Arquivos principais

- `src/entities/study/content/n5Kana.js`, `n5Words.js`, `n5WordsMore.js`, `n5Kanji.js`, `n5Grammar.js`, `n5Reading.js`, `n5Listening.js`
- `src/entities/study/model/courseUnits.js`, `src/entities/study/model/checkpoints.js`, `src/entities/study/model/lessonModel.js`, `src/entities/study/model/state.js`
- `src/pages/lesson/ui/LessonPlayer.jsx`, `CheckpointPlayer.jsx`, `PathTimeline.jsx`, `N5Readiness.jsx`, `N5PersonalExam.jsx`
- `src/entities/study/model/pedagogy/n5Review.js` e `scripts/audit-n5-course.mjs`
