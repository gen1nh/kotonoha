/**
 * Kotonoha — Guia de Ordem dos Traços (Kakijun / 書き順)
 * Mapeamento completo dos 46 Hiraganas e 46 Katakanas com posições percentuais (0-100)
 * de início de cada traço, direção e orientações pedagógicas para a lousa de escrita.
 */

export const KANA_STROKES = {
  // === HIRAGANA (46) ===
  "あ": {
    count: 3,
    steps: [
      { n: 1, x: 26, y: 32, dir: "→", hint: "1º Traço: Linha horizontal curta no topo (esquerda para a direita)" },
      { n: 2, x: 50, y: 16, dir: "↓", hint: "2º Traço: Linha vertical cruzando o centro, curvando levemente" },
      { n: 3, x: 38, y: 44, dir: "↷", hint: "3º Traço: Começa no centro, faz um laço amplo para a direita e fecha" },
    ],
  },
  "い": {
    count: 2,
    steps: [
      { n: 1, x: 30, y: 26, dir: "↓", hint: "1º Traço: Linha curva esquerda descendo, com gancho suave no final" },
      { n: 2, x: 70, y: 36, dir: "↓", hint: "2º Traço: Linha direita mais curta, paralela à esquerda" },
    ],
  },
  "う": {
    count: 2,
    steps: [
      { n: 1, x: 48, y: 18, dir: "↘", hint: "1º Traço: Ponto curto superior diagonal" },
      { n: 2, x: 34, y: 38, dir: "↷", hint: "2º Traço: Curva ampla arredondada em forma de C invertido" },
    ],
  },
  "え": {
    count: 2,
    steps: [
      { n: 1, x: 48, y: 18, dir: "↘", hint: "1º Traço: Ponto diagonal superior curto" },
      { n: 2, x: 28, y: 38, dir: "→ ↙ →", hint: "2º Traço: Traço contínuo em zigue-zague com base ondulada" },
    ],
  },
  "お": {
    count: 3,
    steps: [
      { n: 1, x: 22, y: 32, dir: "→", hint: "1º Traço: Linha horizontal curta no topo" },
      { n: 2, x: 50, y: 18, dir: "↓ ⤹", hint: "2º Traço: Vertical descendente com laço inferior arredondado" },
      { n: 3, x: 76, y: 32, dir: "↘", hint: "3º Traço: Ponto solto no quadrante superior direito" },
    ],
  },
  "か": {
    count: 3,
    steps: [
      { n: 1, x: 26, y: 30, dir: "↷", hint: "1º Traço: Curva principal com gancho inferior" },
      { n: 2, x: 48, y: 18, dir: "↓", hint: "2º Traço: Linha vertical central cortando a curva" },
      { n: 3, x: 74, y: 24, dir: "↘", hint: "3º Traço: Ponto diagonal no canto superior direito" },
    ],
  },
  "き": {
    count: 3,
    steps: [
      { n: 1, x: 30, y: 30, dir: "→", hint: "1º Traço: Linha horizontal superior inclinada levemente para cima" },
      { n: 2, x: 26, y: 44, dir: "→", hint: "2º Traço: Linha horizontal inferior paralela" },
      { n: 3, x: 58, y: 18, dir: "↙ ↷", hint: "3º Traço: Linha diagonal cortante com arco inferior aberto" },
    ],
  },
  "く": {
    count: 1,
    steps: [
      { n: 1, x: 62, y: 22, dir: "↙ ↘", hint: "1º Traço: Traço único contínuo dobrando em ângulo agudo (<)" },
    ],
  },
  "け": {
    count: 3,
    steps: [
      { n: 1, x: 26, y: 20, dir: "↓", hint: "1º Traço: Linha vertical esquerda com gancho suave" },
      { n: 2, x: 52, y: 34, dir: "→", hint: "2º Traço: Linha horizontal curta no centro" },
      { n: 3, x: 72, y: 18, dir: "↓", hint: "3º Traço: Linha vertical direita cortando a horizontal e curvando" },
    ],
  },
  "こ": {
    count: 2,
    steps: [
      { n: 1, x: 30, y: 32, dir: "→", hint: "1º Traço: Linha horizontal superior com gancho sutil" },
      { n: 2, x: 30, y: 68, dir: "→", hint: "2º Traço: Linha horizontal inferior curvando suavemente para cima" },
    ],
  },
  "さ": {
    count: 3,
    steps: [
      { n: 1, x: 26, y: 36, dir: "→", hint: "1º Traço: Linha horizontal inclinada para cima" },
      { n: 2, x: 62, y: 20, dir: "↙", hint: "2º Traço: Linha diagonal descendo" },
      { n: 3, x: 36, y: 72, dir: "↷", hint: "3º Traço: Arco inferior aberto da esquerda para a direita" },
    ],
  },
  "し": {
    count: 1,
    steps: [
      { n: 1, x: 42, y: 20, dir: "↓ ↗", hint: "1º Traço: Linha vertical descendo e virando em gancho amplo para cima" },
    ],
  },
  "す": {
    count: 2,
    steps: [
      { n: 1, x: 20, y: 32, dir: "→", hint: "1º Traço: Linha horizontal superior longa" },
      { n: 2, x: 54, y: 16, dir: "↓ ⤹", hint: "2º Traço: Linha vertical com laço circular central descendo" },
    ],
  },
  "せ": {
    count: 3,
    steps: [
      { n: 1, x: 22, y: 38, dir: "→", hint: "1º Traço: Linha horizontal longa" },
      { n: 2, x: 72, y: 22, dir: "↓", hint: "2º Traço: Linha vertical direita com gancho" },
      { n: 3, x: 42, y: 20, dir: "↓ →", hint: "3º Traço: Linha vertical esquerda curvando na base" },
    ],
  },
  "そ": {
    count: 1,
    steps: [
      { n: 1, x: 30, y: 22, dir: "→ ↙ → ↷", hint: "1º Traço: Traço único em zigue-zague superior seguido de arco em C" },
    ],
  },
  "た": {
    count: 4,
    steps: [
      { n: 1, x: 22, y: 34, dir: "→", hint: "1º Traço: Linha horizontal superior esquerda" },
      { n: 2, x: 38, y: 20, dir: "↙", hint: "2º Traço: Linha diagonal cortante" },
      { n: 3, x: 56, y: 40, dir: "→", hint: "3º Traço: Linha horizontal superior direita (parte do 'ko')" },
      { n: 4, x: 54, y: 64, dir: "→", hint: "4º Traço: Linha inferior curvada à direita" },
    ],
  },
  "ち": {
    count: 2,
    steps: [
      { n: 1, x: 24, y: 34, dir: "→", hint: "1º Traço: Linha horizontal superior" },
      { n: 2, x: 50, y: 18, dir: "↓ ↷", hint: "2º Traço: Linha vertical cortando e fazendo uma curva em forma de 5" },
    ],
  },
  "つ": {
    count: 1,
    steps: [
      { n: 1, x: 26, y: 30, dir: "→ ↷", hint: "1º Traço: Traço único com arco suave arredondado" },
    ],
  },
  "て": {
    count: 1,
    steps: [
      { n: 1, x: 26, y: 30, dir: "→ ↷", hint: "1º Traço: Linha horizontal virando em arco descendente amplo" },
    ],
  },
  "と": {
    count: 2,
    steps: [
      { n: 1, x: 42, y: 20, dir: "↘", hint: "1º Traço: Linha diagonal curta para baixo e direita" },
      { n: 2, x: 32, y: 42, dir: "↷", hint: "2º Traço: Arco em C amplo abraçando o primeiro traço" },
    ],
  },
  "な": {
    count: 4,
    steps: [
      { n: 1, x: 22, y: 32, dir: "→", hint: "1º Traço: Linha horizontal curta no topo esquerdo" },
      { n: 2, x: 42, y: 18, dir: "↙", hint: "2º Traço: Linha diagonal cortando" },
      { n: 3, x: 68, y: 26, dir: "↘", hint: "3º Traço: Ponto curto no topo direito" },
      { n: 4, x: 62, y: 52, dir: "↓ ⤹", hint: "4º Traço: Linha vertical inferior com pequeno laço à direita" },
    ],
  },
  "に": {
    count: 3,
    steps: [
      { n: 1, x: 26, y: 22, dir: "↓", hint: "1º Traço: Linha vertical esquerda com gancho" },
      { n: 2, x: 56, y: 36, dir: "→", hint: "2º Traço: Linha horizontal superior direita" },
      { n: 3, x: 52, y: 68, dir: "→", hint: "3º Traço: Linha horizontal inferior direita" },
    ],
  },
  "ぬ": {
    count: 2,
    steps: [
      { n: 1, x: 38, y: 22, dir: "↘", hint: "1º Traço: Linha diagonal descendente" },
      { n: 2, x: 26, y: 36, dir: "↷ ⤹", hint: "2º Traço: Curva abrangente com laço no final à direita" },
    ],
  },
  "ね": {
    count: 2,
    steps: [
      { n: 1, x: 28, y: 18, dir: "↓", hint: "1º Traço: Linha vertical esquerda firme" },
      { n: 2, x: 22, y: 34, dir: "→ ↙ ↷ ⤹", hint: "2º Traço: Zigue-zague seguido de arco central terminando em laço" },
    ],
  },
  "の": {
    count: 1,
    steps: [
      { n: 1, x: 50, y: 22, dir: "↙ ↷", hint: "1º Traço: Traço único diagonal virando em espiral ampla" },
    ],
  },
  "は": {
    count: 3,
    steps: [
      { n: 1, x: 24, y: 18, dir: "↓", hint: "1º Traço: Linha vertical esquerda com gancho" },
      { n: 2, x: 48, y: 34, dir: "→", hint: "2º Traço: Linha horizontal curta no topo direito" },
      { n: 3, x: 62, y: 20, dir: "↓ ⤹", hint: "3º Traço: Linha vertical cortante com laço inferior à direita" },
    ],
  },
  "ひ": {
    count: 1,
    steps: [
      { n: 1, x: 26, y: 28, dir: "→ ↷", hint: "1º Traço: Linha horizontal curta, mergulho em U e volta" },
    ],
  },
  "ふ": {
    count: 4,
    steps: [
      { n: 1, x: 48, y: 16, dir: "↘", hint: "1º Traço: Ponto/gancho superior central" },
      { n: 2, x: 46, y: 34, dir: "↓ ↷", hint: "2º Traço: Linha central ondulada" },
      { n: 3, x: 26, y: 52, dir: "↙", hint: "3º Traço: Ponto/traço curvo esquerdo" },
      { n: 4, x: 74, y: 52, dir: "↘", hint: "4º Traço: Ponto/traço curvo direito" },
    ],
  },
  "へ": {
    count: 1,
    steps: [
      { n: 1, x: 20, y: 60, dir: "↗ ↘", hint: "1º Traço: Subida curta inclinada e descida longa (montanha)" },
    ],
  },
  "ほ": {
    count: 4,
    steps: [
      { n: 1, x: 24, y: 18, dir: "↓", hint: "1º Traço: Linha vertical esquerda com gancho" },
      { n: 2, x: 46, y: 26, dir: "→", hint: "2º Traço: Linha horizontal superior" },
      { n: 3, x: 48, y: 46, dir: "→", hint: "3º Traço: Linha horizontal inferior paralela" },
      { n: 4, x: 64, y: 18, dir: "↓ ⤹", hint: "4º Traço: Vertical cruzando as linhas com laço inferior" },
    ],
  },
  "ま": {
    count: 3,
    steps: [
      { n: 1, x: 28, y: 28, dir: "→", hint: "1º Traço: Linha horizontal superior" },
      { n: 2, x: 30, y: 46, dir: "→", hint: "2º Traço: Linha horizontal inferior" },
      { n: 3, x: 50, y: 16, dir: "↓ ⤹", hint: "3º Traço: Linha vertical central cortando ambas com laço inferior" },
    ],
  },
  "み": {
    count: 2,
    steps: [
      { n: 1, x: 28, y: 26, dir: "→ ↙ ⤹ →", hint: "1º Traço: Horizontal curta, descida com laço e saída para a direita" },
      { n: 2, x: 70, y: 32, dir: "↘", hint: "2º Traço: Traço diagonal cruzando o primeiro" },
    ],
  },
  "む": {
    count: 3,
    steps: [
      { n: 1, x: 24, y: 32, dir: "→", hint: "1º Traço: Linha horizontal curta" },
      { n: 2, x: 42, y: 18, dir: "↓ ⤹ ↗", hint: "2º Traço: Vertical com laço na base e gancho ascendente" },
      { n: 3, x: 74, y: 30, dir: "↘", hint: "3º Traço: Ponto no canto superior direito" },
    ],
  },
  "め": {
    count: 2,
    steps: [
      { n: 1, x: 42, y: 22, dir: "↘", hint: "1º Traço: Linha diagonal descendente" },
      { n: 2, x: 28, y: 36, dir: "↷", hint: "2º Traço: Curva ampla cruzando e fechando em arco oval" },
    ],
  },
  "も": {
    count: 3,
    steps: [
      { n: 1, x: 50, y: 18, dir: "↓ ↷", hint: "1º Traço: Linha vertical principal com gancho largo inferior (anzol)" },
      { n: 2, x: 30, y: 36, dir: "→", hint: "2º Traço: Linha horizontal superior cruzando o anzol" },
      { n: 3, x: 32, y: 52, dir: "→", hint: "3º Traço: Linha horizontal inferior cruzando" },
    ],
  },
  "や": {
    count: 3,
    steps: [
      { n: 1, x: 28, y: 34, dir: "↷", hint: "1º Traço: Curva principal superior com gancho" },
      { n: 2, x: 42, y: 20, dir: "↘", hint: "2º Traço: Ponto curto superior central" },
      { n: 3, x: 68, y: 18, dir: "↙", hint: "3º Traço: Linha diagonal longa cortando a curva" },
    ],
  },
  "ゆ": {
    count: 2,
    steps: [
      { n: 1, x: 34, y: 22, dir: "↓ ⤹ ↷", hint: "1º Traço: Vertical descendo com laço largo à direita" },
      { n: 2, x: 60, y: 16, dir: "↓", hint: "2º Traço: Linha vertical central longa cortando o arco" },
    ],
  },
  "よ": {
    count: 2,
    steps: [
      { n: 1, x: 26, y: 30, dir: "→", hint: "1º Traço: Linha horizontal superior curta" },
      { n: 2, x: 54, y: 18, dir: "↓ ⤹", hint: "2º Traço: Linha vertical direita com laço fechado para a esquerda" },
    ],
  },
  "ら": {
    count: 2,
    steps: [
      { n: 1, x: 46, y: 20, dir: "↘", hint: "1º Traço: Ponto curto superior" },
      { n: 2, x: 34, y: 38, dir: "↓ ↷", hint: "2º Traço: Linha vertical curta virando em arco arredondado" },
    ],
  },
  "り": {
    count: 2,
    steps: [
      { n: 1, x: 34, y: 24, dir: "↓", hint: "1º Traço: Linha vertical esquerda curta com gancho suave" },
      { n: 2, x: 64, y: 18, dir: "↓ ↷", hint: "2º Traço: Linha vertical direita longa curvando no final" },
    ],
  },
  "る": {
    count: 1,
    steps: [
      { n: 1, x: 30, y: 26, dir: "→ ↙ ↷ ⤹", hint: "1º Traço: Traço contínuo em zigue-zague terminando em pequeno laço circular" },
    ],
  },
  "れ": {
    count: 2,
    steps: [
      { n: 1, x: 30, y: 18, dir: "↓", hint: "1º Traço: Linha vertical esquerda reta" },
      { n: 2, x: 24, y: 34, dir: "→ ↙ ↷ ↗", hint: "2º Traço: Zigue-zague seguido de arco ascendente com gancho" },
    ],
  },
  "ろ": {
    count: 1,
    steps: [
      { n: 1, x: 30, y: 26, dir: "→ ↙ ↷", hint: "1º Traço: Similar ao 'る', mas aberto na base (sem laço final)" },
    ],
  },
  "わ": {
    count: 2,
    steps: [
      { n: 1, x: 30, y: 18, dir: "↓", hint: "1º Traço: Linha vertical esquerda" },
      { n: 2, x: 24, y: 34, dir: "→ ↙ ↷", hint: "2º Traço: Zigue-zague seguido de arco amplo arredondado (sem laço)" },
    ],
  },
  "を": {
    count: 3,
    steps: [
      { n: 1, x: 26, y: 28, dir: "→", hint: "1º Traço: Linha horizontal curta" },
      { n: 2, x: 48, y: 18, dir: "↓ ↷", hint: "2º Traço: Linha vertical virando em arco à direita" },
      { n: 3, x: 36, y: 56, dir: "↷", hint: "3º Traço: Arco inferior cortante" },
    ],
  },
  "ん": {
    count: 1,
    steps: [
      { n: 1, x: 36, y: 22, dir: "↓ ↗ ↘ ↗", hint: "1º Traço: Traço único ondulado elegante similar à letra 'n' cursiva" },
    ],
  },

  // === KATAKANA (46) ===
  "ア": {
    count: 2,
    steps: [
      { n: 1, x: 26, y: 28, dir: "→ ↙", hint: "1º Traço: Linha horizontal dobrando em diagonal descendente" },
      { n: 2, x: 56, y: 38, dir: "↙", hint: "2º Traço: Linha curva diagonal esquerda" },
    ],
  },
  "イ": {
    count: 2,
    steps: [
      { n: 1, x: 50, y: 18, dir: "↙", hint: "1º Traço: Linha diagonal descendente para a esquerda" },
      { n: 2, x: 42, y: 44, dir: "↓", hint: "2º Traço: Linha vertical reta para baixo" },
    ],
  },
  "ウ": {
    count: 3,
    steps: [
      { n: 1, x: 50, y: 16, dir: "↓", hint: "1º Traço: Ponto/traço vertical superior central" },
      { n: 2, x: 28, y: 34, dir: "↓", hint: "2º Traço: Ponto vertical esquerdo" },
      { n: 3, x: 28, y: 38, dir: "→ ↙", hint: "3º Traço: Linha horizontal superior dobrando em diagonal" },
    ],
  },
  "エ": {
    count: 3,
    steps: [
      { n: 1, x: 30, y: 24, dir: "→", hint: "1º Traço: Linha horizontal superior curta" },
      { n: 2, x: 50, y: 24, dir: "↓", hint: "2º Traço: Linha vertical central" },
      { n: 3, x: 22, y: 76, dir: "→", hint: "3º Traço: Linha horizontal inferior longa (base)" },
    ],
  },
  "オ": {
    count: 3,
    steps: [
      { n: 1, x: 24, y: 32, dir: "→", hint: "1º Traço: Linha horizontal no topo" },
      { n: 2, x: 52, y: 18, dir: "↓", hint: "2º Traço: Linha vertical central com gancho à esquerda" },
      { n: 3, x: 50, y: 44, dir: "↘", hint: "3º Traço: Linha diagonal descendente para a direita" },
    ],
  },
  "カ": {
    count: 2,
    steps: [
      { n: 1, x: 26, y: 30, dir: "→ ↙", hint: "1º Traço: Linha horizontal dobrando em diagonal com gancho" },
      { n: 2, x: 56, y: 20, dir: "↙", hint: "2º Traço: Linha diagonal cortante para a esquerda" },
    ],
  },
  "キ": {
    count: 3,
    steps: [
      { n: 1, x: 28, y: 30, dir: "→", hint: "1º Traço: Linha horizontal superior inclinada" },
      { n: 2, x: 24, y: 48, dir: "→", hint: "2º Traço: Linha horizontal inferior mais longa" },
      { n: 3, x: 58, y: 18, dir: "↙", hint: "3º Traço: Linha diagonal cortando ambas para a esquerda" },
    ],
  },
  "ク": {
    count: 2,
    steps: [
      { n: 1, x: 44, y: 20, dir: "↙", hint: "1º Traço: Linha diagonal curta" },
      { n: 2, x: 34, y: 36, dir: "→ ↙", hint: "2º Traço: Linha horizontal dobrando em arco amplo descendente" },
    ],
  },
  "ケ": {
    count: 3,
    steps: [
      { n: 1, x: 46, y: 18, dir: "↙", hint: "1º Traço: Linha diagonal superior esquerda" },
      { n: 2, x: 26, y: 44, dir: "→", hint: "2º Traço: Linha horizontal central cruzando" },
      { n: 3, x: 62, y: 44, dir: "↙", hint: "3º Traço: Linha curva longa descendente à esquerda" },
    ],
  },
  "コ": {
    count: 2,
    steps: [
      { n: 1, x: 30, y: 28, dir: "→ ↓", hint: "1º Traço: Linha horizontal virando em ângulo de 90° para baixo" },
      { n: 2, x: 30, y: 72, dir: "→", hint: "2º Traço: Linha horizontal inferior fechando a caixa" },
    ],
  },
  "サ": {
    count: 3,
    steps: [
      { n: 1, x: 22, y: 34, dir: "→", hint: "1º Traço: Linha horizontal longa" },
      { n: 2, x: 38, y: 22, dir: "↓", hint: "2º Traço: Linha vertical esquerda curta" },
      { n: 3, x: 64, y: 20, dir: "↓ ↙", hint: "3º Traço: Linha vertical direita longa curvando à esquerda" },
    ],
  },
  "シ": {
    count: 3,
    steps: [
      { n: 1, x: 32, y: 28, dir: "↘", hint: "1º Traço: Ponto superior esquerdo" },
      { n: 2, x: 26, y: 48, dir: "↘", hint: "2º Traço: Ponto central esquerdo alinhado" },
      { n: 3, x: 22, y: 74, dir: "↗", hint: "3º Traço: Traço longo ascendente subindo da esquerda para direita" },
    ],
  },
  "ス": {
    count: 2,
    steps: [
      { n: 1, x: 26, y: 30, dir: "→ ↙", hint: "1º Traço: Linha horizontal virando em diagonal acentuada" },
      { n: 2, x: 50, y: 44, dir: "↘", hint: "2º Traço: Linha diagonal partindo do meio para baixo e direita" },
    ],
  },
  "セ": {
    count: 2,
    steps: [
      { n: 1, x: 26, y: 36, dir: "→ ↓", hint: "1º Traço: Linha horizontal virando para baixo com gancho" },
      { n: 2, x: 62, y: 22, dir: "↓ →", hint: "2º Traço: Linha vertical cortando e virando na base" },
    ],
  },
  "ソ": {
    count: 2,
    steps: [
      { n: 1, x: 34, y: 30, dir: "↘", hint: "1º Traço: Ponto inclinado superior esquerdo" },
      { n: 2, x: 66, y: 22, dir: "↙", hint: "2º Traço: Traço diagonal descendo de cima para baixo à esquerda" },
    ],
  },
  "タ": {
    count: 3,
    steps: [
      { n: 1, x: 40, y: 20, dir: "↙", hint: "1º Traço: Linha diagonal superior esquerda" },
      { n: 2, x: 28, y: 38, dir: "→ ↙", hint: "2º Traço: Linha horizontal dobrando em arco para esquerda" },
      { n: 3, x: 42, y: 52, dir: "↘", hint: "3º Traço: Ponto/traço curto diagonal interno" },
    ],
  },
  "チ": {
    count: 3,
    steps: [
      { n: 1, x: 64, y: 20, dir: "↙", hint: "1º Traço: Linha horizontal inclinada descendente" },
      { n: 2, x: 24, y: 42, dir: "→", hint: "2º Traço: Linha horizontal central longa" },
      { n: 3, x: 50, y: 24, dir: "↓ ↷", hint: "3º Traço: Linha vertical cortante curvando à esquerda" },
    ],
  },
  "ツ": {
    count: 3,
    steps: [
      { n: 1, x: 30, y: 24, dir: "↘", hint: "1º Traço: Ponto superior esquerdo quase vertical" },
      { n: 2, x: 48, y: 30, dir: "↘", hint: "2º Traço: Ponto central superior quase vertical" },
      { n: 3, x: 74, y: 22, dir: "↙", hint: "3º Traço: Traço longo descendo de cima para baixo à esquerda" },
    ],
  },
  "テ": {
    count: 3,
    steps: [
      { n: 1, x: 30, y: 26, dir: "→", hint: "1º Traço: Linha horizontal superior curta" },
      { n: 2, x: 22, y: 46, dir: "→", hint: "2º Traço: Linha horizontal central mais longa" },
      { n: 3, x: 50, y: 46, dir: "↙ ↷", hint: "3º Traço: Linha curva descendente partindo do meio" },
    ],
  },
  "ト": {
    count: 2,
    steps: [
      { n: 1, x: 40, y: 18, dir: "↓", hint: "1º Traço: Linha vertical longa" },
      { n: 2, x: 40, y: 44, dir: "↘", hint: "2º Traço: Linha diagonal partindo da vertical para baixo e direita" },
    ],
  },
  "ナ": {
    count: 2,
    steps: [
      { n: 1, x: 24, y: 38, dir: "→", hint: "1º Traço: Linha horizontal" },
      { n: 2, x: 54, y: 20, dir: "↙", hint: "2º Traço: Linha diagonal cortante descendo para a esquerda" },
    ],
  },
  "ニ": {
    count: 2,
    steps: [
      { n: 1, x: 32, y: 36, dir: "→", hint: "1º Traço: Linha horizontal superior" },
      { n: 2, x: 24, y: 64, dir: "→", hint: "2º Traço: Linha horizontal inferior mais longa" },
    ],
  },
  "ヌ": {
    count: 2,
    steps: [
      { n: 1, x: 30, y: 30, dir: "→ ↙", hint: "1º Traço: Linha horizontal virando em diagonal acentuada" },
      { n: 2, x: 44, y: 24, dir: "↘", hint: "2º Traço: Linha diagonal longa cruzando o primeiro traço" },
    ],
  },
  "ネ": {
    count: 4,
    steps: [
      { n: 1, x: 50, y: 16, dir: "↓", hint: "1º Traço: Ponto vertical superior" },
      { n: 2, x: 34, y: 34, dir: "↓", hint: "2º Traço: Linha vertical esquerda" },
      { n: 3, x: 34, y: 38, dir: "→ ↙", hint: "3º Traço: Linha horizontal dobrando em diagonal" },
      { n: 4, x: 52, y: 56, dir: "↘", hint: "4º Traço: Ponto/traço diagonal inferior direito" },
    ],
  },
  "ノ": {
    count: 1,
    steps: [
      { n: 1, x: 62, y: 20, dir: "↙", hint: "1º Traço: Linha curva diagonal suave descendo da direita para esquerda" },
    ],
  },
  "ハ": {
    count: 2,
    steps: [
      { n: 1, x: 38, y: 28, dir: "↙", hint: "1º Traço: Linha diagonal descendente para a esquerda" },
      { n: 2, x: 62, y: 28, dir: "↘", hint: "2º Traço: Linha diagonal descendente para a direita" },
    ],
  },
  "ヒ": {
    count: 2,
    steps: [
      { n: 1, x: 30, y: 30, dir: "→", hint: "1º Traço: Linha horizontal curta no topo" },
      { n: 2, x: 30, y: 30, dir: "↓ →", hint: "2º Traço: Linha vertical descendo e virando em ângulo reto para direita" },
    ],
  },
  "フ": {
    count: 1,
    steps: [
      { n: 1, x: 30, y: 28, dir: "→ ↙", hint: "1º Traço: Traço único horizontal virando em diagonal descendente curva" },
    ],
  },
  "ヘ": {
    count: 1,
    steps: [
      { n: 1, x: 22, y: 62, dir: "↗ ↘", hint: "1º Traço: Subida curta para o pico e descida longa (igual ao hiragana)" },
    ],
  },
  "ホ": {
    count: 4,
    steps: [
      { n: 1, x: 26, y: 30, dir: "→", hint: "1º Traço: Linha horizontal superior" },
      { n: 2, x: 50, y: 18, dir: "↓", hint: "2º Traço: Linha vertical central com gancho" },
      { n: 3, x: 32, y: 46, dir: "↙", hint: "3º Traço: Ponto diagonal esquerdo" },
      { n: 4, x: 68, y: 46, dir: "↘", hint: "4º Traço: Ponto diagonal direito" },
    ],
  },
  "マ": {
    count: 2,
    steps: [
      { n: 1, x: 30, y: 28, dir: "→ ↙", hint: "1º Traço: Linha horizontal dobrando em diagonal acentuada" },
      { n: 2, x: 44, y: 52, dir: "↘", hint: "2º Traço: Ponto diagonal cruzando a saída" },
    ],
  },
  "ミ": {
    count: 3,
    steps: [
      { n: 1, x: 36, y: 26, dir: "↘", hint: "1º Traço: Traço diagonal superior" },
      { n: 2, x: 32, y: 46, dir: "↘", hint: "2º Traço: Traço diagonal central paralelo" },
      { n: 3, x: 28, y: 66, dir: "↘", hint: "3º Traço: Traço diagonal inferior mais longo" },
    ],
  },
  "ム": {
    count: 2,
    steps: [
      { n: 1, x: 48, y: 20, dir: "↙ →", hint: "1º Traço: Linha diagonal descendo e virando em ângulo fechado para direita" },
      { n: 2, x: 68, y: 58, dir: "↘", hint: "2º Traço: Ponto diagonal no canto inferior direito" },
    ],
  },
  "メ": {
    count: 2,
    steps: [
      { n: 1, x: 64, y: 22, dir: "↙", hint: "1º Traço: Linha diagonal longa da direita para esquerda" },
      { n: 2, x: 34, y: 34, dir: "↘", hint: "2º Traço: Linha diagonal curta cortando a primeira" },
    ],
  },
  "モ": {
    count: 3,
    steps: [
      { n: 1, x: 30, y: 32, dir: "→", hint: "1º Traço: Linha horizontal superior" },
      { n: 2, x: 24, y: 50, dir: "→", hint: "2º Traço: Linha horizontal inferior" },
      { n: 3, x: 46, y: 18, dir: "↓ →", hint: "3º Traço: Linha vertical cortando e virando em gancho na base" },
    ],
  },
  "ヤ": {
    count: 2,
    steps: [
      { n: 1, x: 28, y: 34, dir: "→ ↓", hint: "1º Traço: Linha horizontal virando em gancho vertical" },
      { n: 2, x: 68, y: 20, dir: "↙", hint: "2º Traço: Linha diagonal longa cortando" },
    ],
  },
  "ユ": {
    count: 2,
    steps: [
      { n: 1, x: 30, y: 28, dir: "→ ↓ →", hint: "1º Traço: Horizontal virando em vertical e depois base horizontal" },
      { n: 2, x: 50, y: 18, dir: "↓", hint: "2º Traço: Linha vertical central longa cortando" },
    ],
  },
  "ヨ": {
    count: 3,
    steps: [
      { n: 1, x: 32, y: 28, dir: "→ ↓", hint: "1º Traço: Linha horizontal superior virando para baixo (espinha)" },
      { n: 2, x: 32, y: 50, dir: "→", hint: "2º Traço: Linha horizontal intermediária" },
      { n: 3, x: 32, y: 72, dir: "→", hint: "3º Traço: Linha horizontal inferior (base da prateleira)" },
    ],
  },
  "ラ": {
    count: 2,
    steps: [
      { n: 1, x: 34, y: 24, dir: "→", hint: "1º Traço: Linha horizontal superior curta" },
      { n: 2, x: 34, y: 44, dir: "→ ↷", hint: "2º Traço: Linha horizontal dobrando em arco descendente amplo" },
    ],
  },
  "リ": {
    count: 2,
    steps: [
      { n: 1, x: 34, y: 24, dir: "↓", hint: "1º Traço: Linha vertical esquerda reta" },
      { n: 2, x: 66, y: 18, dir: "↓ ↷", hint: "2º Traço: Linha vertical direita longa curvando na base" },
    ],
  },
  "ル": {
    count: 2,
    steps: [
      { n: 1, x: 38, y: 20, dir: "↓ ↙", hint: "1º Traço: Linha vertical esquerda levemente inclinada" },
      { n: 2, x: 58, y: 18, dir: "↓ ↗", hint: "2º Traço: Linha vertical direita longa com gancho ascendente" },
    ],
  },
  "レ": {
    count: 1,
    steps: [
      { n: 1, x: 36, y: 20, dir: "↓ ↗", hint: "1º Traço: Linha vertical descendo e virando em gancho acentuado para cima" },
    ],
  },
  "ロ": {
    count: 3,
    steps: [
      { n: 1, x: 30, y: 28, dir: "↓", hint: "1º Traço: Linha vertical esquerda" },
      { n: 2, x: 30, y: 28, dir: "→ ↓", hint: "2º Traço: Linha horizontal virando em ângulo de 90° para baixo" },
      { n: 3, x: 30, y: 72, dir: "→", hint: "3º Traço: Linha horizontal fechando o quadrado" },
    ],
  },
  "ワ": {
    count: 2,
    steps: [
      { n: 1, x: 32, y: 32, dir: "↓", hint: "1º Traço: Linha vertical esquerda curta" },
      { n: 2, x: 32, y: 36, dir: "→ ↙", hint: "2º Traço: Linha horizontal dobrando em arco descendente para a esquerda" },
    ],
  },
  "ヲ": {
    count: 3,
    steps: [
      { n: 1, x: 26, y: 28, dir: "→", hint: "1º Traço: Linha horizontal superior" },
      { n: 2, x: 26, y: 50, dir: "→ ↙", hint: "2º Traço: Linha horizontal central dobrando em diagonal" },
      { n: 3, x: 48, y: 56, dir: "↙", hint: "3º Traço: Linha curva diagonal cruzando" },
    ],
  },
  "ン": {
    count: 2,
    steps: [
      { n: 1, x: 34, y: 34, dir: "↘", hint: "1º Traço: Ponto inclinado superior esquerdo" },
      { n: 2, x: 24, y: 68, dir: "↗", hint: "2º Traço: Traço longo ascendente subindo da esquerda para direita" },
    ],
  },
};

/**
 * Retorna dados de traço para qualquer caractere, com fallback inteligente.
 */
export function getStrokeData(char) {
  if (KANA_STROKES[char]) return KANA_STROKES[char];
  return {
    count: 1,
    steps: [
      { n: 1, x: 50, y: 25, dir: "↓", hint: "Regra padrão: comece do topo e siga da esquerda para a direita" },
    ],
  };
}
