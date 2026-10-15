# Auditoria do fluxo de ensino — 15/10/2026

## Escopo e diagnóstico

Inspeção de LessonPlayer, Review, PracticeHub, CheckpointPlayer e da sequência canônica N5. Comparação com a documentação pública dos oito repositórios fornecidos; não é uma auditoria integral desses projetos nem validação pedagógica de seus conteúdos.

O problema principal era a falta de distinção entre apresentação, treino opcional, memorização e avaliação. O iniciante precisava descobrir sozinho a finalidade de cada componente. Acrescentar ferramentas ampliaria essa confusão.

| Problema observado | Consequência | Correção nesta entrega |
| --- | --- | --- |
| Exemplos, digitação e cartões na mesma página | Parece necessário digitar antes de compreender | Etapas explícitas: conhecer → praticar → checkpoint; digitação recolhida e opcional |
| Cartões sem instrução de autoavaliação | “Bom” pode ser confundido com botão de acerto | Explicação antes de revelar e descrições de lembrança em cada opção |
| Praticar oferece outra chamada para a mesma lição | Compete com a Trilha | Revisão como ação principal; link simples para conteúdo novo |
| Consulta aberta e muitos painéis simultâneos | Ferramentas competem com a tarefa principal | Consulta e ferramentas abertas apenas por escolha |
| Cinco textos/áudios exibidos juntos | Leitura longa e perda de foco | Um exemplo por vez, anterior/próximo e instrução contextual |
| Revisão encerrada tratada como aprendizagem consolidada | Confusão entre exposição e domínio | Mensagem separa prática de verificação no checkpoint |

## Contrato do percurso

1. **Conhecer:** objetivo e exemplo com resposta disponível; ouvir é apoio, não uma tarefa sem explicação.
2. **Praticar:** recuperar a informação da memória ou interpretar o exemplo de gramática. É permitido voltar à explicação.
3. **Verificar:** checkpoint mantém seus critérios existentes, feedback e possibilidade de nova tentativa.
4. **Revisar depois:** a revisão espaçada organiza reencontros com o material; não substitui o checkpoint.

Leitura e escuta seguem exemplos orientados → verificação. Não se força uma etapa de cartões onde ela não existe. Nenhuma nova etapa de interface concede aprovação ou altera IDs, dados persistidos, desbloqueios ou intervalos de revisão.

## Referências consideradas

| Repositório | Evidência pública e decisão para Kotonoha |
| --- | --- |
| [Flashcards](https://github.com/Rodriiandino/aprender-japones-flashcards) | Documenta cartões com leitura, sequência/aleatoriedade e feedback. Aproveitar foco no item e clareza da resposta; não misturar aleatoriamente o currículo inicial. |
| [AprendeJapones](https://github.com/Guarghuk/AprendeJapones) | Estrutura Android e screenshots; documentação acessível insuficiente para justificar mudanças curriculares. Não presumir equivalência com uma PWA. |
| [Aprender japonés online](https://github.com/matiasacostaguzman/aprenderjaponesonline) | Página de oferta de aulas, com FAQ e apresentação de serviços. Referência de comunicação, não motor de aprendizagem. |
| [Nazumo](https://github.com/acuatice/Nazumo) | Descreve reconhecimento, memória e escrita, com foco mobile. Diferenciar essas habilidades na interface, sem tratar digitação como pré-requisito universal. |
| [Aprenda japonês](https://github.com/caravo-way/aprenda-japones) | Artigos organizados em português para seguir um roteiro. Inspira explicações e orientação de próximo passo. |
| [Awesome Japanese](https://github.com/yudataguy/awesome-japanese) | Lista recursos por habilidade, nível e condições de uso. Usar como curadoria contextual; não despejar um catálogo inteiro na sessão. Inclui recursos pagos, portanto não é uma lista exclusivamente gratuita. |
| [KanaDojo](https://github.com/lingdojo/kana-dojo) | Separa Kana, Kanji e vocabulário, com modos de seleção e digitação. Inspira separar modalidade de treino e objetivo da lição. |
| [Read Frog](https://github.com/mengxi-ream/read-frog) | Leitura contextual que pode virar notas/cartões, com autoavaliação de revisão. Referência futura para ligar Caderno e leitura, não requisito de extensão ou IA para estudar. |

Nenhum código, banco de questões ou conteúdo didático externo foi incorporado nesta alteração. Os padrões de interação são referências, não evidência de eficácia educacional.

## Problemas curriculares ainda abertos

- A sequência N5 agrupa grandes blocos de kana, vocabulário e kanji antes de gramática/leitura/escuta. Isso adia o uso da língua em situações reais. Uma próxima revisão editorial deve propor unidades situacionais que combinem esses conhecimentos, com pré-requisitos explícitos.
- Alterar essa ordem exige plano de migração de desbloqueios e revisão das questões. Não reordenar silenciosamente as 220 unidades nem invalidar progresso existente.
- Há explicações ainda curtas e feedback de erro genérico. Próximo trabalho: objetivo observável, exemplo resolvido e explicação de distratores para cada unidade.
- A autoavaliação dos cartões mede a lembrança declarada, não proficiência. Os checkpoints e a revisão final continuam formativos; o gate editorial de certificação permanece fechado.
- A voz sintética continua sendo apoio; não substitui gravações nativas revisadas nem prova auditiva oficial.

## Validação

Validação executada: `npm ci` sem vulnerabilidades reportadas; 104 testes unitários aprovados; `check:quality` (arquitetura, alcance dos módulos e auditoria estrutural N5) aprovado; build aprovado; 31 cenários de navegador aprovados em Chromium/WebKit e 1 teste offline WebKit deliberadamente ignorado. O build mantém o aviso de bundle acima de 500 kB.

Cobertura inclui percurso lição → cartões → checkpoint, retorno à explicação sem perder resposta, gramática e navegação entre exemplos de leitura/escuta, backups, sincronização, responsividade e PWA offline Chromium. Tela Praticar também inspecionada visualmente no navegador local. Safari em aparelho físico continua exigindo homologação própria.

## Continuação verificada após a sequência situacional v2 (15/10/2026)

A `main` já continha a migração das 220 unidades para cinco etapas e o pacote editorial. Não refazer IDs, sequência, `curriculumVersion` ou `curriculumAccess`.

**Ajustes feitos nesta continuação:**
- A escolha da alternativa de gramática deixa de tocar o som de acerto/erro e de revelar o gabarito imediatamente. O aluno decide quando conferir; a conclusão só é liberada após confirmação correta. A explicação permanece consultável sem perda do rascunho.
- Praticar tem uma única ação principal de revisão e um menu curto de atividades opcionais. O desafio rápido deixa de ser duplicado, a chamada redundante para continuar a Trilha sai dessa tela e Biblioteca/Caderno ficam em uma área de consulta dedicada.
- A digitação abre em tela própria e continua opcional, acessível apenas para unidades já liberadas. Não participa da aprovação dos checkpoints.

**Ainda exige trabalho editorial independente:** mapa de pré-requisitos por exemplo, explicações de erros e distratores em todas as unidades, checagem de leitura e escuta e provas finais licenciadas. Não marcar o N5 como certificado nem mudar o gate `audit:n5-release`.
