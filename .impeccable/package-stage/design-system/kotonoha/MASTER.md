# Kotonoha — sistema visual editorial

Direção escolhida pelo usuário: material de estudo japonês editorial, papel claro, tinta escura, vermelho discreto e tipografia forte, sem ilustrações decorativas. A marca existente permanece.

## Tokens

- Papel: `#F3F0E8`; superfície: `#F8F6F0`; painel: `#E9E5DB`.
- Tinta principal: `#1D1E1C`; texto secundário: `#5D605A`; linhas: `#C9C3B8`.
- Vermelho `#A83B32` indica seleção e ação; verde de estado só aparece para resposta correta. Significado nunca depende apenas da cor.
- Tipografia de sistema, com fallback japonês local; números e metadados usam monoespaçada de sistema. O app não busca fontes na rede.
- Espaçamento em múltiplos de 4/8 px; divisores finos, cantos quase retos, sem sombras decorativas, degradês ou textura de fundo.

## Composição e comportamento

- Navegação convencional no cabeçalho em desktop e barra inferior com cinco áreas em celular; Preferências seguem acessíveis no cabeçalho.
- A tela inicial abre com uma questão diária real. Estrutura: contexto e nível à esquerda, pergunta, opções e resposta explicada à direita. No celular, empilha contexto e exercício.
- A assinatura de interação é uma pergunta por vez: escolha por toque ou teclado, feedback imediato, explicação curta, próxima questão e estado de conclusão persistido localmente.
- A trilha JLPT mostra N5–N1; N4–N1 têm três lições de quatro questões cada e 16 cartões de vocabulário por nível. Conteúdo é didático e autoral, não uma lista oficial do JLPT.
- O vermelho também marca estado, mas cada seleção, erro e conclusão inclui texto ou contorno. Alvos de toque têm pelo menos 44 px; foco é visível e movimento respeita `prefers-reduced-motion`.
- No desenho, o canvas usa tinta escura e grade funcional. Não avalia caligrafia nem ordem dos traços.
- Dados permanecem no navegador; navegação, conteúdo e revisão funcionam offline após a instalação PWA em HTTPS. Integrações externas são opcionais e identificadas.

## Referências de implementação

Tokens e regras estão em `src/editorial.css`; estilos base em `src/styles.css` e refinamentos acessíveis em `src/ui-refinements.css`. O brief de produto está em `PRODUCT.md`; o contrato desta direção está em `.impeccable/surfaces/src-shell-jsx.md`. Capturas de validação estão em `.impeccable/review/`. A auditoria automática usa axe/Playwright em 375, 844 e 1440 px, além dos fluxos de teclado e dos testes offline.
