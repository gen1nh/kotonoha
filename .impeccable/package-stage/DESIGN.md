---
name: Kotonoha
description: Um caderno editorial para estudar japonês, uma pergunta de cada vez.
colors:
  primary: "#A83B32"
  paper: "#F3F0E8"
  surface: "#F8F6F0"
  surface-raised: "#E9E5DB"
  ink: "#1D1E1C"
  muted: "#5D605A"
  line: "#C9C3B8"
  line-strong: "#99958C"
  red-soft: "#F0E0DC"
  success: "#315F49"
  success-soft: "#E2E9E2"
  danger: "#8B2924"
  focus: "#87332C"
typography:
  display:
    fontFamily: '"Noto Sans JP", "Yu Gothic UI", Meiryo, sans-serif'
    fontSize: "clamp(31px, 3.3vw, 43px)"
    fontWeight: 680
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Noto Sans JP", "Yu Gothic UI", Meiryo, sans-serif'
    fontSize: "clamp(22px, 2.5vw, 30px)"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: '"Noto Sans JP", "Yu Gothic UI", Meiryo, sans-serif'
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: '"Noto Sans JP", "Yu Gothic UI", Meiryo, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  control: "2px"
  card: "3px"
  square: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "28px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 15px"
    height: "44px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 15px"
    height: "44px"
  answer-choice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 14px"
    height: "54px"
  study-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 15px"
---

# Design System: Kotonoha

## Overview

**Creative North Star: “O Caderno Editorial Japonês”**

Kotonoha apresenta o estudo como uma página de caderno: papel claro, tinta escura, divisórias finas e um acento vermelho usado com medida. A interface mantém controles familiares e deixa o conteúdo japonês e a prática conduzirem a experiência. Sua cadência é deliberada: uma pergunta, uma resposta, uma explicação breve e um próximo passo.

O espaço de estudo é pessoal e local-first. O progresso permanece no dispositivo, e a composição funciona em celular e desktop. A marca usa o wordmark vetorial existente; a interface não depende de ilustrações.

**Key Characteristics:**
- Papel claro e tinta escura, com painéis tonais discretos.
- Vermelho reservado a seleção, foco e progresso atual.
- Tipografia sans legível, com fallback japonês do sistema.
- Controles web convencionais e estados acessíveis.

## Colors

A paleta combina neutros quentes de papel com vermelho editorial; verde e vermelho de retorno ficam restritos a estados de resposta.

### Primary
- **Vermelho editorial** (`{colors.primary}`): identifica navegação ativa, progresso, links e ações principais; use-o como acento pontual.

### Neutral
- **Papel claro** (`{colors.paper}`): fundo geral da aplicação.
- **Superfície de leitura** (`{colors.surface}`): campos, cartões e painéis de conteúdo.
- **Papel elevado** (`{colors.surface-raised}`): painel de pergunta, exemplos e contexto destacado.
- **Tinta** (`{colors.ink}`): texto principal e divisórias de hierarquia.
- **Tinta secundária** (`{colors.muted}`): instruções, metadados e texto auxiliar.
- **Linha de papel** (`{colors.line}`): bordas e separadores discretos.
- **Linha marcada** (`{colors.line-strong}`): contornos de escolha e divisórias de maior contraste.
- **Vermelho lavado** (`{colors.red-soft}`): fundo de resposta incorreta.
- **Verde de acerto** (`{colors.success}`): confirmação correta e conclusão.
- **Verde lavado** (`{colors.success-soft}`): fundo para confirmação correta.
- **Vermelho de erro** (`{colors.danger}`): contorno de resposta incorreta.
- **Foco escuro** (`{colors.focus}`): contorno visível de foco e borda de campo focado.

**A Regra do Vermelho Editorial.** O vermelho sinaliza estado e ação; a cor não é o único meio de comunicar acerto, erro ou seleção. Associe-a a texto e semântica acessíveis.

## Typography

**Display Font:** Noto Sans JP local (subset latino variável), com “Yu Gothic UI”, Meiryo e sans-serif como fallbacks.
**Body Font:** A mesma pilha sans, permitindo que os fallbacks do sistema cubram os caracteres japoneses ausentes do arquivo local.
**Label/Mono Font:** ui-monospace, SFMono-Regular, Consolas, monospace para contadores e metadados curtos.

**Character:** A sans de traço firme mantém a leitura direta em português e japonês. A hierarquia usa tamanho, peso e espaçamento, sem depender de uma fonte de display separada.

### Hierarchy
- **Display** (peso 680, 31–43px responsivo, entrelinha 1.08): títulos de página e boas-vindas.
- **Headline** (peso 600, 22–30px responsivo, entrelinha 1.2): cabeçalho da pergunta e títulos de lição.
- **Title** (peso 600, 20px, entrelinha 1.3): subtítulos de seção.
- **Body** (peso 400, 16px, entrelinha 1.5): texto geral, instruções e explicações; parágrafos explicativos limitados a cerca de 72–78ch.
- **Label** (peso 400, 12px, tracking 0.04em): contagens e metadados curtos em monoespaçada.

**A Regra da Leitura Japonesa.** Use Noto Sans JP local para os glifos latinos cobertos e deixe os fallbacks do sistema atenderem ao japonês; não presuma que o subset latino contenha kana ou kanji. O arquivo local acompanha a licença SIL Open Font License 1.1 em `src/assets/OFL-NotoSansJP.txt`.

## Layout

O shell usa uma barra superior horizontal familiar e uma área de conteúdo com largura máxima de 1290px. No início, o contexto de nível ocupa uma coluna estreita ao lado da pergunta principal; a grade muda para uma coluna em telas de até 760px, com contexto acima da questão. O conteúdo usa margens fluidas de 20–60px em telas amplas e 16px nas menores. Navegação móvel fixa cinco destinos na base, respeitando a área segura do dispositivo; controles preservam alvos de toque de ao menos 44px quando definidos pela camada de refinamentos.

## Elevation & Depth

O sistema é plano por padrão: sombras são removidas, e a profundidade vem de tons de papel, bordas finas e linhas superiores coloridas. O cartão principal da pergunta recebe uma faixa vermelha superior; cartões de tarefa usam contornos, e estados de resposta acrescentam cor e texto. O campo focado usa uma aura de fundo de 3px, enquanto o foco de teclado global mantém contorno de 3px com deslocamento de 3px.

**A Regra da Superfície Plana.** Use tom e divisória para separar superfícies; sombras não fazem parte do repouso visual.

## Shapes

As superfícies usam cantos quase quadrados. Campos, escolhas e a maioria dos cartões têm raio de 2px; cartões nomeados pelo token geral têm 3px; navegação ativa, painéis de pergunta e linhas editoriais ficam sem arredondamento. Bordas de 1px e faixas de 2–3px formam as bordas de papel recorrentes.

## Components

### Buttons
- **Caráter:** ações diretas com forma contida e rótulos claros.
- **Shape:** cantos discretamente arredondados (2px); altura mínima de toque de 44px pela camada de refinamentos.
- **Primary:** fundo vermelho editorial, texto claro, padding horizontal de 15px e sem sombra.
- **Hover / Focus:** hover escurece o vermelho; foco de teclado usa o contorno global de 3px com afastamento de 3px. Estados desabilitados reduzem a opacidade e mostram cursor indisponível.
- **Outline / text:** outline fica transparente com linha marcada e passa a vermelho no hover; ações textuais usam vermelho sem caixa.

### Cards / Containers
- **Caráter:** cartões funcionais e planos, com divisórias que orientam a leitura.
- **Corner Style:** normalmente 2px; o token geral de cartão é 3px; superfícies editoriais maiores podem ter cantos retos.
- **Background:** superfície clara ou papel elevado para conteúdo em destaque.
- **Shadow Strategy:** sem sombras no repouso; ver Elevation & Depth.
- **Border:** linha de papel fina, ou faixa superior para pergunta, revisão e lição ativa.
- **Internal Padding:** tarefas compactas usam 14–15px; blocos de pergunta escalam entre 22–34px em telas amplas e 16–26px em lições.

### Inputs / Fields
- **Style:** fundo de superfície, contorno de linha de papel e raio de 2px.
- **Focus:** a borda muda para foco escuro e recebe halo de 3px em vermelho lavado; o foco visível global continua claro.
- **Error / Disabled:** os estados seguem texto de status e paleta sem depender apenas da cor; controles desabilitados usam opacidade reduzida.

### Navigation
- **Style:** barra superior horizontal sobre o papel, com rótulos sans de 13–14px; ícones podem acompanhar os rótulos em telas amplas.
- **Default / Active:** item inativo usa tinta secundária; ativo usa vermelho e sublinhado de 2px, sem cápsula ou sombra.
- **Mobile:** navegação inferior fixa com cinco destinos, rótulos compactos e o destino atual em vermelho.

### Pergunta diária
O bloco de estudo central destaca uma questão por vez em superfície de papel elevado, com faixa superior vermelha e escolhas rotuladas. Depois da seleção, o retorno apresenta explicação e continuação; acerto e erro usam fundo, borda e texto apropriados.

## Do's and Don'ts

### Do:
- **Do** mantenha a página em papel claro, com tinta escura e divisórias finas.
- **Do** reserve o vermelho editorial para ação, seleção e progresso atual.
- **Do** mostre uma pergunta por vez e acompanhe a resposta com explicação breve e próximo passo.
- **Do** mantenha rótulos explícitos, foco visível e alvos de toque confortáveis em celular e desktop.
- **Do** preserve a marca existente em `public/brand/logo.svg`.

### Don't:
- **Don't** acrescente ilustrações decorativas; a direção confirmada não usa ilustrações.
- **Don't** comunique estados apenas por cor.
- **Don't** use sombras como profundidade padrão nem troque as superfícies de papel por cartões arredondados e pesados.
- **Don't** use o vermelho como cor dominante de grandes áreas; mantenha-o como acento de estado e ação.
