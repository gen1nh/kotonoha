# Kotonoha — Sistema de design vigente

**Versão de referência:** refatoração estrutural de 13/10/2026. **Este arquivo substitui as diretrizes antigas** de seis laboratórios na Home e tipografia Inter. Antes de criar componentes, consulte este arquivo, `docs/UX_ARCHITECTURE.md` e `src/index.css`.

## Princípios

1. **Uma próxima ação**: o iniciante começa pela lição recomendada. A Trilha decide o que está disponível; Praticar é opcional; Progresso só apresenta resultados. A Biblioteca é referência, não outro curso.
2. **Gamificação com sobriedade**: sensação tátil, cantos arredondados, tipografia acolhedora e verde vibrante. Não transformar todas as superfícies em botões ou em cartões concorrentes.
3. **Mobile de verdade**: quatro abas fixas (**Início, Trilha, Praticar, Progresso**) em navegação comum. Em lição, revisão e checkpoint a aba inferior se oculta para diminuir distrações. Retorno contextual.
4. **Dados honestos**: `visto` ≠ `praticado` ≠ `checkpoint aprovado` ≠ `revisado`. Nunca calcular proficiência com minutos de tela ou tentativas isoladas.
5. **Acessível**: toque mínimo de 44×44 CSS px; feedback não dependente apenas de cor; foco visível; 4,5:1 para texto comum; leitura por teclado e VoiceOver; temas claro/escuro coerentes.

## Tipografia

- **UI em português:** `Nunito` (700/800/900 para títulos e ações; 400/600/700 para textos). Aplica-se em body, campos, botões e diálogos.
- **Kana e kanji:** `M PLUS Rounded 1c` por `[lang="ja"]`, com fallback `Hiragino Maru Gothic ProN`/Meiryo.
- Os estilos `.type-display`, `.type-h1`, `.type-h2`, `.type-h3`, `.type-body`, `.type-body-sm`, `.type-caption`, `.type-button` estão definidos em `src/index.css`.
- A fonte remota precisa de conexão na primeira carga. O aplicativo dispõe de alternativas locais legíveis durante o uso offline; **não afirmar que arquivos das fontes estão embutidos**.

## Cores semânticas

Os valores implementados estão em `src/index.css` (`@theme`); não introduzir hexadecimais novos em componentes. A marca usa **`--color-brand: #58cc02`** como realce. Para texto normal e botões preenchidos, use a variante de maior contraste: **`--color-primary: #2e7c26`**, `--color-primary-strong: #276f22`, `--color-primary-dark: #24641e`.

| Categoria | Tokens | Aplicação |
| --- | --- | --- |
| Fundo e borda | `paper`, `surface`, `raised`, `line`, `edge` | Superfícies, agrupamentos, divisão |
| Texto | `ink-strong`, `ink`, `muted` | Título, parágrafo, auxiliar |
| Ação | `brand`, `primary`, `primary-dark`, `accent-soft` | CTA, progresso, sucesso |
| Revisão/áudio | `blue`, `blue-soft`, `blue-ink` | Retenção e conteúdo auditivo |
| Aviso | `flame`, `flame-soft`, `danger`, `danger-soft` | Streak e erros |
| Apoio | `purple`, `purple-soft` | Tutor e conversação |

**Não** usar o verde `#58cc02` como texto pequeno sobre branco: o contraste é insuficiente. Em modo escuro, use as variantes semânticas do tema e teste contrastes novamente.

## Identidade de marca, logotipo e favicon

- **Símbolo aprovado:** Squircle tátil 3D (`#58cc02` com elevação física `#357300`) unindo folha de bambu (*sasa/kotonoha*) como primeiro traço do kanji 言, centelha dourada (*kokoro no tane*, `#ffb800` / `#ffe266`) e traços arredondados de alto contraste.
- **Logotipo horizontal (`public/brand/logo.svg`):** Símbolo tátil, tipografia Kotonoha em tom `ink-strong` (`#162019`) e selo vertical autêntico Hanko japonês em ouro Kokoro com a inscrição `言の葉`.
- **Favicon e PWA (`public/`):** SVG responsivo (`icon.svg`), ICO multi-tamanho (`favicon.ico` 16/32/48px), `apple-touch-icon.png` (180px), `icon-192.png`, `icon-512.png` e `maskable-512.png` com zona de segurança Android de 80%.

## Componentes e estados

- Reutilizar `src/components/ui/index.jsx`: `Button`, `Card`, `Badge`, controles, estados vazios. Botões primários têm borda inferior mais espessa e reação visual ao toque; links textuais continuam links.
- Ícones vetoriais centralizados em `src/components/Icon.jsx`. Predomínio de ícones preenchidos; o cadeado pode usar contorno por clareza. Tamanho e peso consistentes entre telas da mesma categoria.
- Estados obrigatórios: disponível, bloqueado com pré-requisito, em andamento, pronto para checkpoint, aprovado, revisão vencida, offline, erro e salvamento falho.
- Não usar indicadores interativos sobre uma superfície de desenho. Controles em uma região separada do canvas.
- Não criar sliders, overlays e abas customizados quando os elementos HTML semânticos resolvem a mesma tarefa. Todas as abas precisam de `aria-selected`, `aria-controls`, foco e painel correspondente.

## Arquitetura de telas

| Área | Conteúdo permitido | O que não deve aparecer |
| --- | --- | --- |
| Início | Uma ação principal, pequena visão da meta, revisões vencidas | Grade de laboratórios, currículo inteiro, filtros JLPT |
| Trilha | Microlições, pré-requisitos, checkpoints, progresso sequencial | Segundo motor de escolha de lição ou mudança de nível por filtro |
| Lição (imersiva) | Conteúdo, áudio, prática contextual e próximo checkpoint | Navegação inferior, biblioteca extensa, painéis concorrentes |
| Praticar | SRS primeiro, consulta e laboratórios opcionais agrupados | Uma trilha paralela ou meta alternativa |
| Progresso | Aprendizagens aprovadas, revisões e diagnóstico opcional | Repetição da timeline completa |
| Biblioteca | Consulta de escrita, palavras, gramática e mídia | Aprovar competências ou alterar desbloqueio |
| Caderno | Notas, erros, dúvidas, flashcards pessoais | Outro menu para o mesmo diário |
| Preferências | Meta, aparência, dados e IA opcional | Seletores que pareçam desbloquear níveis |

## Responsividade e iPhone

- Conteúdo até `max-w-3xl` para estudo; cards compactos; navegação inferior apenas fora de tarefas imersivas.
- Respeitar `env(safe-area-inset-bottom)` e `100dvh`; prevenir scroll horizontal; textarea e inputs mínimo 16px no iOS para evitar zoom inesperado.
- Revisão e caligrafia devem caber em 320px; testes visuais precisam confirmar o comportamento com teclado virtual e rotação.
- O áudio usa suporte do navegador e vozes japonesas instaladas; se indisponível, oferecer mensagem clara. **Não prometer que o Safari foi testado** sem evidência de aparelho real.

## Condições para considerar uma entrega pronta

1. `npm ci`, `npm test`, `npm run build` e `npm run test:e2e` verdes em ambiente com dependências e browsers.
2. Verificações mobile em 320, 375, 390, 430px, landscape e teclado virtual.
3. Teste real de Safari: fala, gravação, saída de background, canvas, atualização PWA e uso offline.
4. Backups anteriores importam sem perda de cartões, notas e checkpoints; não há sincronização em nuvem nesta versão.
5. Qualquer alteração de progresso acompanhada de teste de regressão e documentação.

## Preferências — conta e áudio

Conta em painel compacto acima dos ajustes. Meta, tema e áudio ficam visíveis; importação, IA, ajuda e reinício são expansíveis. Exportar backup continua acessível diretamente. Não repetir estatísticas da tela Progresso. Efeitos sonoros discretos, ajustáveis por aparelho, nunca substituem feedback textual nem interrompem a pronúncia.
