# Kotonoha — Entrega consolidada de UI/UX + QA

Data: 13/10/2026 | Base: `kotonoha-jornada-checkpoint.zip`

## Objetivo
Reduzir redundâncias e tornar o aplicativo utilizável por iniciantes, especialmente no celular, mantendo React + Vite + PWA, progresso local e identidade do Kotonoha. **Não foi adicionada sincronização entre dispositivos nem nuvem.**

## Implementações principais

1. **Uma única Trilha**: substituição dos percursos concorrentes por `PathTimeline`, com lições, práticas, checkpoints e pré-requisitos em sequência. Links antigos `?view=jlpt` e `?view=paper` levam para a Trilha, preservando links salvos. Material de consulta e autoavaliações migrou para Progresso.
2. **Lição focada**: `LessonPlayer` não abre a Biblioteca automaticamente. Apresenta conteúdo em blocos pequenos; cartões na revisão SRS; checkpoint de N5 após estudar os cartões; apoio contextual da Biblioteca como opção.
3. **Continuação N4–N1 preservada**: as poucas lições autorais existentes aparecem após N5, com exercícios e resultado mínimo de 75% para conclusão. Não são equivalentes a um currículo completo nem a exames oficiais. Concluir N5 não desbloqueia N3–N1 fora de ordem.
4. **Home para iniciantes**: um único CTA contextual (`lição` ou `checkpoint`), dois atalhos secundários e meta diária simples, sem ferramentas concorrentes no topo.
5. **Navegação mobile**: quatro destinos, `Início`, `Trilha`, `Praticar`, `Progresso`; ferramentas complementares em grupos expansíveis; navegação inferior oculta na lição, checkpoint e revisão; áreas de toque ampliadas e respeito às safe areas iOS.
6. **Correção de roteamento**: um clique cria uma única entrada de histórico. URLs e popstate obedecem pré-requisitos. Mudar o filtro do nível na biblioteca não desbloqueia laboratórios.
7. **Metas coerentes**: aprovação de checkpoint contabiliza uma atividade uma única vez; revisão conta uma vez por dia; desenhar não conta como revisão SRS; meta diária com 1, 2 ou 3 atividades. Referências opcionais de minutos ficam em Progresso, claramente separadas da meta.
8. **Ofensiva honesta**: novo aluno começa com 0 dias; atividades efetivamente registradas atualizam a ofensiva; o indicador de XP é derivado das revisões efetivas (não um prêmio inicial fictício).
9. **Caligrafia mobile**: canvas de toque livre, ordem dos traços apresentada fora da área de desenho, controles com alvos maiores.
10. **Tema claro/escuro**: tokens semânticos, variações com melhor contraste, atualização da cor da barra do navegador e persistência da preferência do tema.
11. **Onboarding simples**: somente a meta que de fato muda o aplicativo, instruções curtas e botão levando à Trilha. Sem alegações profissionais inventadas sobre o tutor de IA.
12. **Ferramentas preservadas sem duplicação de percurso**: caderno ligado ao diário de erros; diagnósticos e exercícios para imprimir dentro de Progresso; laboratórios opcionais em Praticar. Exercícios para impressão, simulados e histórico de resultados continuam disponíveis.
13. **Dados pessoais protegidos**: flashcards customizados do Caderno agora são restaurados por `normalizeState` e continuam elegíveis para revisão. Backup JSON local preservado; sem servidor.
14. **Acessibilidade**: heading principal em `<h1>`, contornos de foco, orientação de seleção por rótulos, preferência por movimento reduzido, alvos de toque mais confortáveis, diferenciação visual de bloqueios e uso consistente de ícones SVG.
15. **Testes**: regressões de meta, filtragem de nível, bloqueios, persistência de cartões pessoais, sequência de avanço e cálculo de nota; fluxo Playwright atualizado para quatro destinos, navegação, checkpoints, caligrafia, tema, responsividade, acessibilidade e offline.

## Verificação realizada nesta entrega

- `node --test tests/*.test.js`: **45 testes passaram, 0 falhas**.
- Parsing sintático via parser TypeScript de todo `src/` e `tests/`: **0 erros**.
- Resolução estática de caminhos de importação relativos: **0 referências ausentes**.
- O projeto contém `vercel.json` com Framework Vite, saída `dist` e fallback SPA.

### Verificações não realizadas / riscos residuais

- **Build Vite em produção não homologado:** não foi possível instalar pacotes no ambiente por indisponibilidade de acesso ao registro npm; portanto não declaro o build aprovado.
- **Playwright e axe não executados:** os cenários foram atualizados, mas dependem de `npm ci`, `npm run build` e navegador Playwright instalado.
- **Safari/iPhone físico não testado:** a síntese nativa `speechSynthesis` depende das vozes instaladas e das políticas do iOS. Correção e funcionamento não podem ser garantidos sem teste no aparelho.
- **Currículo completo N5–N1 não incluído**: o N5 atual é uma sequência introdutória e os níveis N4–N1 possuem amostras autorais, não cobertura oficial completa.
- **Progressão**: o N5 exige estudo dos cartões da base e checkpoints de cinco questões com 80%; cinco questões são insuficientes para comprovar proficiência JLPT, sendo checkpoints formativos do próprio app.

## Homologação / publicação sugerida

```bash
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Validar manualmente no iPhone: instalação PWA, reproduzir áudio japonês em Safari e standalone, desenho com o dedo, rolagem com barra inferior, teclado virtual e safe areas, tema do sistema, navegação Voltar, reentrada por URLs diretas e backup/importação.

## Publicação na Vercel

- Root directory: raiz do repositório (onde ficam `package.json` e `vercel.json`)
- Framework: Vite
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`
- **Groq:** cada usuário informa sua própria chave nas Preferências; nunca colocar segredo em variáveis `VITE_*`. Sem chave, o percurso de lições e revisão segue offline. Um servidor OmniRoute opcional só funciona no ambiente local de desenvolvimento.
- **Backup:** progresso fica no armazenamento local do navegador. Para alternar entre computador e telefone, exportar/importar JSON manualmente.

## Estratégia de migração

O identificador de storage segue `kotonoha.v1`, preservando dados anteriores. Recomenda-se exportar um backup JSON antes do primeiro uso da nova interface. Os recursos não migrados para navegação principal continuam como módulos opcionais; URLs antigas de Trilha são redirecionadas.
