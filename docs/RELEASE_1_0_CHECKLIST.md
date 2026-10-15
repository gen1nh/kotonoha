# Fechamento da versão 1.0 pessoal — N5

Escopo: aprender e revisar N5 em português, no iPhone e desktop, com dados locais, backup e sincronização opcional. N4–N1 continuam prévias. Sem novas ferramentas antes de resolver os itens abaixo.

## 1. Currículo

- [x] Inventário reproduzível de todas as 220 unidades, conteúdos e questões: `N5_CURRICULUM_MAP.md` e `data/editorial/n5-course-review.json`.
- [x] Objetivo e método por etapa, com cobertura exata dos IDs existentes.
- [x] Sequência situacional implementada (revisão independente pendente): primeiros passos → apresentações → rotina → situações práticas → consolidação.
- [x] Fila auditável por unidade para revisar dependências linguísticas (gerador `editorial:prerequisites`, sem aprovação automática).
- [ ] Conferir e aprovar pré-requisitos reais por estrutura/palavra em cada texto e áudio; não inferir suficiência pela sequência de acesso.
- [x] Migração explícita da sequência com testes de todos os 220 limites de progresso legado e acesso a unidades já concluídas.

Cinco etapas situacionais agora intercalam vocabulário e gramática. Exemplos de aplicação com áudio aparecem nas etapas iniciais; os blocos completos de leitura e escuta ficam na consolidação porque misturam estruturas avançadas. A revisão independente dos pré-requisitos linguísticos continua pendente.

## 2. Trilha e orientação

- [x] Etapas recolhíveis; etapa atual aberta, objetivo, contagem e critério de conclusão.
- [x] Separação de explicação, prática e checkpoint.
- [x] Digitação retirada das lições e disponível apenas em Praticar → Digitação japonesa (tela opcional própria).
- [x] Unidades de digitação limitadas às acessíveis; não desbloqueia currículo.
- [x] Estados derivados de checkpoints, sem converter exposição em aprovação.

## 3. Conteúdo

- [x] Leitura/escuta em exemplos individuais com resposta comentada.
- [x] Feedback de gramática só é revelado após confirmação explícita e permite consultar a explicação sem perder a resposta.
- [x] Pacote editorial reúne conteúdo, alternativas e gabarito de todas as unidades, marcado pendente.
- [ ] Revisão linguística independente do japonês, traduções e alternativas.
- [x] Feedback pós-checkpoint percorrível em todas as questões, com contrastes baseados nos próprios cartões quando disponíveis.
- [ ] Revisão editorial específica das confusões de kana/kanji e de cada distrator; feedback automático não substitui o especialista.
- [ ] Resolver todos os achados da revisão sem marcar automaticamente registros como aprovados.

## 4. Prática e avaliação

- [x] Revisão de cartões explica a autoavaliação.
- [x] Praticar mantém uma única chamada de revisão e separa os treinos opcionais, sem duplicar o percurso da Trilha.
- [x] Checkpoint permite retornar à explicação depois de erro.
- [x] Revisão, exposição e aprovação mantêm significados diferentes.
- [x] Substituir a questão repetida de reconhecimento por aplicação em 21 unidades de gramática.
- [x] Introduzir alternativas de transferência em novas tentativas das quatro flexões verbais `grammar:14`–`grammar:17` (candidatas editoriais, sem alterar a primeira tentativa).
- [ ] Revisar linguisticamente as novas frases e ampliar a transferência às demais unidades; completar uma frase conhecida ainda não comprova produção independente.
- [ ] Validar recomendações por habilidade com dados de estudo reais.
- [ ] Manter `audit:n5-release` fechado enquanto faltar a prova editorial exigida pelo projeto. Não contornar o gate para publicar 1.0.

## 5. Qualidade técnica

- [ ] Executar gates na candidata final: instalação limpa, testes, arquitetura, auditoria N5, build e navegador.
- [ ] Testar no iPhone real: fala japonesa, sons, teclado, instalação PWA, retorno do segundo plano e offline.
- [ ] Testar conta real em dois aparelhos: envio, recebimento e conflito, mantendo backups.
- [ ] Confirmar URLs de retorno do login no endereço publicado.

## 6. Uso e publicação

- [ ] Estudo diário real por 7–14 dias sugeridos; registrar tarefa, dificuldade, aparelho e resultado esperado.
- [ ] Corrigir obstáculos encontrados e repetir os testes afetados.
- [ ] Publicar 1.0 apenas depois dos critérios acima; manter correções de conteúdo, bugs e segurança após congelar funcionalidades.

## Limites desta entrega

A migração curricular situacional foi implementada. Não houve aprovação editorial independente nem publicação da 1.0. Nenhuma dessas verificações pode ser substituída pela passagem dos testes automatizados. O pacote editorial foi preparado para tornar a revisão concreta e rastreável.

Validação desta entrega: instalação limpa sem vulnerabilidades reportadas, 111 testes unitários e 33 cenários de navegador aprovados, arquitetura e auditoria N5 aprovadas, build aprovado. Um cenário offline WebKit segue deliberadamente ignorado; offline passou no Chromium. O aviso de bundle acima de 500 kB permanece. As validações da candidata final e de aparelho real continuam pendentes.

## Migração da sequência v2

Backups sem `curriculumVersion: 2` conservam os acessos do percurso antigo em `curriculumAccess`. Checkpoints e cartões não são alterados. Backups novos preservam a lista e não recalculam atalhos. Qualquer unidade já aprovada continua visitável. A recomendação diária aponta para a primeira unidade ainda não aprovada da nova ordem.

Referências de conferência das flexões para as questões autorais: [formas polidas](https://guidetojapanese.org/learn/grammar/polite), [adjetivos](https://guidetojapanese.org/learn/grammar/adjectives) e [pedidos](https://guidetojapanese.org/learn/grammar/requests), de Tae Kim. Consulta não equivale a aprovação editorial independente.
