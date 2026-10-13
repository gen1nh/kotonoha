# Kotonoha 1.0 — critérios reais de lançamento

Data de preparação: 2026-10-13. **Status: PRÉ-LANÇAMENTO BLOQUEADO, não é uma 1.0 homologada.**

## Objetivo de produto

A versão 1.0 deve ensinar japonês desde o começo do N5, oferecer práticas e revisões contextualizadas e validar o domínio N5 com avaliações internas que cobrem vocabulário, gramática, leitura e compreensão auditiva. **Nunca chamar uma aprovação do Kotonoha de aprovação oficial JLPT.**

## Estado confirmado nesta entrega

| Área | Estado e evidência |
|---|---|
| Refatoração/UX | Base local da última refatoração incorporada; fluxo de microlições/checkpoints preservado |
| Estado local | Dados pedagógicos adicionais migram em `normalizeState` sem descartar cartões e checkpoints antigos |
| Progressão | Trilha N5 não libera N4 só por completar micro-checkpoints; prova interna abrangente exigida |
| Labs | Laboratórios continuam liberados após os fundamentos, independentemente de certificação |
| Prova N5 | Motor/runner/resumo de competência implementados, mas não disponíveis sem banco aprovado |
| Currículo editorial | 11 grupos de competências planejados; NÃO representam currículo validado completo |
| Banco de questões | 12 itens introdutórios migrados para fila editorial DRAFT; **zero itens independentes aprovados** |
| Áudio | **Zero gravações N5 licenciadas e verificadas** para a prova final |
| Base lexical | 129 lemas-candidatos sem classificação JLPT oficial; importador JMdict offline e atribuição automática |
| Testes | 77 testes Node e verificação de sintaxe executados; build Vite/Playwright/iPhone físico não homologados |

## Critérios antes de marcar v1.0 como pronta

- [ ] Trilha N5 cobre efectivamente o roteiro, sem lacunas em kana variantes, partículas, tempos verbais, kanji, leitura e escuta.
- [ ] Banco de atividades é extenso e tem questões que avaliam compreensão, não memorização da resposta.
- [ ] Itens do exame N5 possuem revisão linguística independente, licença, atribuição e explicação.
- [ ] Áudios japoneses estão armazenados localmente, têm direitos claros e funcionam offline no Safari iOS.
- [ ] Aprovação final exige no mínimo 20 itens revisados por habilidade (80 no total) como piso editorial **provisório**, com cobertura de cada grupo de competências; limites de pontuação serão calibrados pedagogicamente.
- [ ] Questões repetidas, provas incompletas, falta de áudio e lacunas em qualquer habilidade não podem conceder aprovação.
- [ ] Teste de nivelamento distingue recomendação provisória de certificação, com instrumento validado e cobertura suficiente.
- [ ] Novas questões são importadas por fluxo editorial e publicadas apenas após aprovação.
- [ ] Verificação de backup antigo + novo, retomada de exame, offline/PWA, WebKit, teclado, acessibilidade e tamanhos móveis.
- [ ] Build e testes e2e de qualidade aprovados em CI e iPhone real antes do release.
- [ ] Branch de integração reconciliada com repositório GitHub; Pull Request revisto antes de alterar `main` e Vercel.

## Comandos

```bash
npm test
npm run editorial:n5
python3 scripts/import_jmdict.py --source /caminho/JMdict.xml
npm run audit:n5-release
npm ci && npm run build && npm run test:e2e
```

**Esperado hoje:** `npm run audit:n5-release` encerra com código `2` e aponta 20 itens faltantes em cada uma das 4 habilidades. Essa falha é intencional. Não desabilitar o bloqueio para publicar.

## Decisões de arquitetura

- Continuidade no design gamificado existente; não adicionar uma segunda UI de trilha.
- Banco editorial separado do estado de aprendizagem; aprovado apenas sob validação.
- Guardar progresso local, sem login nem sincronização em nuvem nesta fase.
- Limites internos de 80% total e 60% por área são apenas hipóteses de trabalho; usar validação antes de alegar prontidão JLPT.
- Bibliografia: JLPT (critérios do exame), JF Standard (competências), EDRDG/JMdict (vocabulário), KanjiVG (traços), Tatoeba (licenças por item). Importação restrita ao conteúdo permitido, nunca cópia automática das provas oficiais.

## Diferença entre entregas

A etapa atual é uma **fundação técnica funcional testada** + fluxo de progressão corrigido. Não inclui a totalidade do N5 homologada. Marcar `version: 1.0.0` agora induziria o aluno a acreditar que há curso completo, banco calibrado e áudio verificado — o que ainda não corresponde ao código.
