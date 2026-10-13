# Fundação pedagógica do Kotonoha

> Status: **infraestrutura inicial em desenvolvimento**, sem liberação de níveis no aplicativo. Esta branch não é uma versão pronta para produção nem uma certificação JLPT.

## Princípios não negociáveis

1. **Estudar não é comprovar domínio.** Card visto, revisão SRS, lição concluída e prova aprovada devem ser eventos separados.
2. **Uma fonte de verdade para progressão.** Home, Trilha, sessão curta e checkpoints devem consultar o mesmo motor.
3. **Questões de alto impacto exigem revisão editorial independente.** Conteúdo recém-gerado por IA inicia como rascunho e não entra na avaliação de nível.
4. **Avaliação sempre cobre as habilidades pertinentes.** Se faltar banco de áudio licenciado ou outra seção obrigatória, a prova interna não é gerada e nenhum nível é desbloqueado.
5. **JLPT é a referência, não a certificação emitida.** A prova oficial possui pontuação escalonada não replicável por simples porcentagem de acertos; critérios internos devem ser rotulados como tais.
6. **Progresso local e compatibilidade de backup.** Não implementar Supabase, autenticação nem sincronização em nuvem nesta fase.

## Implementado nesta branch

- `src/pedagogy/engine.js`: contrato dos itens, estados de revisão, proveniência, regras de licenciamento, seleção de questões, cobertura por habilidade, correção determinística, colocação sequencial e estado pedagógico independente e versionado.
- `tests/pedagogy.test.js`: testes unitários da fundação.
- As regras-padrão `80% total / 60% por habilidade` e `3 questões por área` são **hipóteses técnicas apenas para desenvolvimento**, não evidência de validade pedagógica e não devem acionar promoção real.
- Não há banco real de itens aprovados importado; o banco usado em testes é sintético e não é conteúdo didático.

## Próximos requisitos para integrar ao produto

- Incorporar a última versão refatorada do aplicativo com migração e testes de regressão. O código da `main` atual não contém as mesmas microlições da última distribuição ZIP.
- Construir catálogo explícito e revisado de competências para N5, N4, N3, N2 e N1 (cobertura, pré-requisitos, objetivos, exemplares).
- Criar processo de importação editorial com relatório de origem, licenças, deduplicação, verificações estruturais, revisão humana e geração de pacote offline versionado.
- Implementar banco próprio de conteúdo N5 antes de ativar o mecanismo de nivelamento ou promoção.
- Criar provas distintas de aprendizagem, recuperação, nivelamento e passagem, com reserva de itens não exibidos antes.
- Integrar UI de provas, feedback e recomendações na Trilha e no Progresso, com armazenamento local e backup compatível.
- Validar áudio offline no Safari iOS, Playwright e acessibilidade; corrigir problemas antes de alterar a versão em produção.
- Calibrar dificuldade, cobertura de competências e qualidade dos itens com revisão linguística e análise posterior de respostas.

## Fontes e direitos

Fontes de referência: [JLPT](https://www.jlpt.jp/e/), [EDRDG / JMdict / KANJIDIC](https://www.edrdg.org/), [KanjiVG](https://kanjivg.tagaini.net/), [Tatoeba](https://tatoeba.org/) e [JF Standard](https://www.jfstandard.jpf.go.jp/).

**Não assuma que itens, traduções ou áudio podem ser redistribuídos:** verificar licença por fonte/arquivo, atribuição, condições share-alike e permissões de uso. Provas oficiais não devem ser copiadas automaticamente.

## Execução de testes

```bash
npm test
```

Esta fundação foi executada localmente no pacote refatorado com Node.js; 66 testes passaram (56 existentes e 10 novos). O novo código nesta branch ainda precisa ser reunido ao pacote refatorado e homologado. Não houve teste end-to-end nem build de produção desta branch.

## Escopo desta proposta

Este Pull Request é intencionalmente **draft**: ele introduz a fundação e não altera o aprendizado visível nem o progresso dos alunos. A integração posterior precisa preservar essa separação até que o conteúdo validado esteja disponível.
