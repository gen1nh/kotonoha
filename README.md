# Kotonoha — Japonês com jornada guiada

PWA pessoal para aprender japonês com microlições, prática contextual, checkpoints, revisão espaçada (SRS), biblioteca de referência, escrita e laboratórios opcionais. **Versão 0.9.0 — preparação da 1.0 N5, lançamento bloqueado até homologação.**

## Como funciona

A **Trilha é o único currículo**. A Home retoma o próximo passo. Cada unidade inclui uma quantidade pequena de conteúdo, prática e um checkpoint para liberar a seguinte. A aba Praticar disponibiliza revisão e ferramentas extras, mas não cria uma segunda jornada. A Biblioteca apenas consulta conteúdos; escolher um nível de referência **não** desbloqueia lições.

A navegação mobile contém quatro áreas: **Início, Trilha, Praticar, Progresso**. As tarefas imersivas ocultam a barra inferior. O design system usa **Nunito** em português, **M PLUS Rounded 1c** em japonês e componentes arredondados/táteis inspirados na identidade original do projeto. Tema claro/escuro disponível.

O conteúdo N5 inclui fundamentos em microlições de hiragana, katakana, vocabulário e gramática. N4–N1 continuam sendo **prévia autoral limitada**; ainda não são cursos completos ou provas JLPT oficiais.

## Projeto rumo à 1.0 N5

O fluxo de aprendizagem já separa conclusão de microlições e **aprovação interna de nível**. Concluir checkpoints permite continuar estudando, mas **não libera o N4** sem uma avaliação que cubra vocabulário/kanji, gramática, leitura e compreensão auditiva.

- O painel **Progresso → Preparação N5** exibe os fundamentos estudados e os itens editoriais ainda necessários.
- A avaliação N5 só aparece quando existir um banco amplo com itens revisados e áudios locais licenciados. Atualmente esse banco está vazio: **não há prova de passagem aprovada**.
- O catálogo editorial está em `src/pedagogy/n5Curriculum.js`, a fila de revisão em `data/editorial/n5-draft-questions.json` e o importador JMdict em `scripts/import_jmdict.py`.
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
npm run build
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

`npm run build` gera `dist/`. Para visualizar localmente: `npm run preview`.

> Na geração deste pacote, **77 testes de lógica passaram** e arquivos JS/JSX foram analisados sintaticamente, mas o acesso ao npm falhou neste ambiente. Consequentemente, o **build real do Vite e o Playwright não foram executados**; a primeira publicação depende de passar no CI ou na sua máquina. WebKit emulado não substitui testes físicos em Safari/iOS.

## Publicar na Vercel

Importar o repositório como **Vite**, diretório raiz `./`, comando de instalação `npm ci`, build `npm run build`, saída `dist`. O projeto inclui `vercel.json` com fallback para rotas SPA.

Não publique nenhuma chave de IA em variáveis `VITE_*`. A integração Groq opcional funciona com chave na sessão do próprio usuário; o caminho `/api/ai` só funciona se houver proxy/backend configurado. No deploy estático, não há backend de IA por padrão.

## Dados, offline e segurança

- O progresso permanece no dispositivo, em `localStorage` com a chave legada `kotonoha.v1` para preservar dados de versões anteriores.
- O esquema dos backups foi versionado (`schemaVersion: 2`) com migração de dados históricos, novas microlições, rascunhos de checkpoint e validação.
- Exportação/importação JSON em Preferências; recomenda-se exportar antes de mudar de versão. A alteração do aplicativo **não sincroniza** progresso entre celular e computador.
- Depois da primeira carga e do cache do PWA, conteúdos locais podem funcionar offline; voz do sistema, IA, links externos e mídia dependem das capacidades do aparelho e da rede.
- **Sincronização em nuvem e autenticação não fazem parte do escopo**, por decisão de produto.

## Estrutura relevante

| Caminho | Responsabilidade |
| --- | --- |
| `src/courseUnits.js` | Unidades pequenas do N5 e identificação dos cartões |
| `src/learning.js` | Nível conquistado, conclusão e próxima ação |
| `src/routeAccess.js` | Regras de acesso também para URL direta |
| `src/checkpoints.js` | Questões e critérios de avaliação |
| `src/state.js` | Estado, SRS, normalização e backups |
| `src/App.jsx` | Persistência e navegação |
| `src/Shell.jsx` | Layout, quatro destinos, tarefas imersivas |
| `src/components` | Home, Trilha, Lição, Revisão, Caderno, Prática etc. |
| `src/index.css` | Tokens de cor/tema, Nunito e estilos responsivos |
| `design-system/kotonoha/MASTER.md` | Especificação visual vigente |
| `tests` | Testes de lógica e E2E |

## Documentação vigente

- [Sistema visual](design-system/kotonoha/MASTER.md)
- [Arquitetura da experiência](docs/UX_ARCHITECTURE.md)
- [Plano de QA e homologação](docs/TEST_PLAN.md)
- [Relatório da refatoração](RELATORIO-REFATORACAO-KOTONOHA.md)
- [Histórico de mudanças](CHANGELOG.md)

Relatórios e componentes anteriores sem uso permanecem arquivados em `docs/history/`, não como especificação vigente.
