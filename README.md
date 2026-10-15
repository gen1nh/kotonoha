# Kotonoha — Japonês com jornada guiada

PWA pessoal para aprender japonês com microlições, prática contextual, checkpoints, revisão espaçada (SRS), biblioteca de referência, escrita e laboratórios opcionais. **Versão 0.10.0 — candidata a curso N5 pessoal. Ainda requer revisão linguística e homologação mobile antes da 1.0.**

## Como funciona

A **Trilha é o único currículo**. A Home retoma o próximo passo. Cada unidade inclui uma quantidade pequena de conteúdo, prática e um checkpoint para liberar a seguinte. A aba Praticar disponibiliza revisão e ferramentas extras, mas não cria uma segunda jornada. A Biblioteca apenas consulta conteúdos; escolher um nível de referência **não** desbloqueia lições.

A navegação mobile contém quatro áreas: **Início, Trilha, Praticar, Progresso**. As tarefas imersivas ocultam a barra inferior. O design system usa **Nunito** em português, **Zen Maru Gothic** em japonês (com fallback local) e componentes arredondados/táteis inspirados na identidade original do projeto. Tema claro/escuro disponível.

O conteúdo N5 inclui 220 microlições de hiragana, katakana, vocabulário, kanji em contexto, gramática, leitura e escuta. As seções usam capítulos recolhíveis para navegação mobile. O material expandido é uma base autoral candidata ainda não revisada linguisticamente por especialista. N4–N1 continuam sendo **prévia autoral limitada**; ainda não são cursos completos ou provas JLPT oficiais.

## Projeto rumo à 1.0 N5

O fluxo de aprendizagem já separa conclusão de microlições e **aprovação interna de nível**. Concluir checkpoints marca **o curso pessoal N5 como concluído**, mas **não libera o N4** sem uma avaliação independente abrangente. A revisão final pessoal possui 32 perguntas e nunca concede aprovação JLPT ou destrava níveis. A avaliação certificadora permanece separada e indisponível.

- O painel **Progresso → Preparação N5** exibe o que já foi estudado, revisões e próximos passos. Pendências editoriais permanecem na documentação técnica, não na interface do aluno.
- A **revisão final pessoal N5** aparece após concluir todos os capítulos; apresenta 32 questões formativas distribuídas entre vocabulário, gramática, leitura e escuta via voz do navegador, sem conceder certificado. A **avaliação certificadora independente** só aparece quando existir um banco extenso com itens revisados e áudios devidamente autorizados; atualmente está vazia.
- O catálogo editorial está em `src/entities/study/model/pedagogy/n5Curriculum.js`, a fila de revisão em `data/editorial/n5-draft-questions.json` e o importador JMdict em `scripts/import_jmdict.py`.
- Auditoria com falha proposital caso a 1.0 não possa ser publicada: `npm run audit:n5-release`.
- Critérios completos e pendências em [docs/KOTONOHA_V1_0_RELEASE_GATE.md](docs/KOTONOHA_V1_0_RELEASE_GATE.md).

## Executar localmente

É necessário Node.js 22.12+ e conexão para instalar os pacotes npm:

```bash
npm ci
npm run dev
```

### Qualidade e build

```bash
npm test
npm run check:quality
npm run audit:n5-course
npm run build
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

`npm run audit:dead-code` lista módulos potencialmente não utilizados, sem excluí-los. `npm run check:quality` executa as verificações de arquitetura, alcance dos módulos e conteúdo N5. O script de código morto é informativo; qualquer exclusão exige inspeção de referências dinâmicas e testes.

`npm run build` gera `dist/`. Para visualizar localmente: `npm run preview`.

> As validações de qualidade, build e navegador são executadas no GitHub Actions a cada push e pull request. Consulte o resultado do commit que pretende publicar; WebKit emulado não substitui testes em Safari físico.

## Publicar na Vercel

Importar o repositório como **Vite**, diretório raiz `./`, comando de instalação `npm ci`, build `npm run build`, saída `dist`. O projeto inclui `vercel.json` com fallback para rotas SPA.

Não publique nenhuma chave de IA em variáveis `VITE_*`. A integração Groq opcional funciona com chave na sessão do próprio usuário; o caminho `/api/ai` só funciona se houver proxy/backend configurado. No deploy estático, não há backend de IA por padrão.

## Dados, offline e segurança

- O progresso permanece no dispositivo, em `localStorage` com a chave legada `kotonoha.v1` para preservar dados de versões anteriores.
- O esquema dos backups foi versionado (`schemaVersion: 2`) com migração de dados históricos, novas microlições, rascunhos de checkpoint e validação.
- Exportação/importação JSON em Preferências; recomenda-se exportar antes de mudar de versão. A sincronização opcional entre aparelhos requer conta Google e Supabase configurados. O usuário escolhe a versão em caso de conflito; não existe mesclagem automática.
- Os backups de conflito guardam até cinco cópias de recuperação **neste navegador**, não na nuvem. Faça downloads periódicos. Preferências de voz e efeitos permanecem específicas do aparelho.
- Depois da primeira carga e do cache do PWA, conteúdos locais podem funcionar offline; voz do sistema, IA, links externos e mídia dependem das capacidades do aparelho e da rede.
- **Conta e sincronização Supabase são opcionais**; ver `docs/SUPABASE_SETUP.md`. Não há sincronização com o app fechado, nem garantia de atualização instantânea. A qualidade do áudio de voz depende do dispositivo.

## Estrutura relevante

| Caminho | Responsabilidade |
| --- | --- |
| `src/entities/study/model/courseUnits.js` | Unidades N5 e agrupamentos temáticos com IDs legados preservados |
| `src/entities/study/content/` | Dados autorais N5: palavras, kanji, gramática, leitura e escuta |
| `src/entities/study/model/pedagogy/n5Review.js` | Revisão pessoal formativa sem certificação |
| `scripts/audit-n5-course.mjs` | Auditoria estrutural do conteúdo e da progressão |
| `src/entities/study/model/learning.js` | Nível conquistado, conclusão e próxima ação |
| `src/entities/study/model/routeAccess.js` | Regras de acesso também para URL direta |
| `src/entities/study/model/checkpoints.js` | Questões e critérios de avaliação |
| `src/entities/study/model/state.js` | Estado, SRS, normalização e backups |
| `src/app/App.jsx` | Persistência e navegação |
| `src/app/Shell.jsx` | Layout, quatro destinos, tarefas imersivas |
| `src/pages/` | Home, Trilha, Lição, Revisão, Caderno, Prática etc. |
| `src/app/index.css` | Tokens de cor/tema, Nunito e estilos responsivos |
| `design-system/kotonoha/MASTER.md` | Especificação visual vigente |
| `tests` | Testes de lógica e E2E |

## Documentação vigente

- [Sistema visual](design-system/kotonoha/MASTER.md)
- [Arquitetura da experiência](docs/UX_ARCHITECTURE.md)
- [Plano de QA e homologação](docs/TEST_PLAN.md)
- [Relatório da refatoração](RELATORIO-REFATORACAO-KOTONOHA.md)
- [Histórico de mudanças](CHANGELOG.md)

Relatórios e componentes anteriores sem uso permanecem arquivados em `docs/history/`, não como especificação vigente.

Estrutura e importações: [Arquitetura FSD](docs/ARCHITECTURE.md).
