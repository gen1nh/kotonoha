# Fundação pedagógica do Kotonoha

**Status: fundação em desenvolvimento.** A estrutura de avaliações não substitui o conteúdo completo, provas oficiais ou validação editorial. O conteúdo deve ser revisado antes de ativar qualquer desbloqueio por nivelamento.

- O módulo `src/entities/study/model/pedagogy/engine.js` mantém estados draft/review/approved/retired, proveniência e metadados de licença e revisão independente.
- Avaliações internas cobrem vocabulário, gramática, leitura e áudio e recusam gerar prova se faltar qualquer grupo necessário.
- Regras quantitativas são apenas valores iniciais para desenvolvimento; não equivalem à pontuação oficial escalonada do JLPT.
- Nível de estudo, nível de competência validado internamente e certificação oficial são conceitos distintos.
- Falta construir banco pedagógico amplo, importações licenciadas, avaliadores e interfaces de prova/nivelamento. A `main` do repositório ainda está em base antiga.
- Sem nuvem/sincronização. Progresso e backups permanecem locais.

## Verificação

`node --test tests/*.test.js`

66 testes unitários passaram localmente no projeto refatorado (56 antigos + 10 do motor). Build e testes em Safari não foram executados.
