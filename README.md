# Kotonoha

App pessoal React + Vite para estudar japonês, com dados locais, revisão espaçada, lições, caderno, conversação guiada e prática com mídia. O conteúdo atual é introdutório; não é um curso completo N5–N1.

## Executar

Node.js 22.12+ ou 24+.

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
npm test
npx playwright install chromium
npm run test:e2e
```

## Organização

- `src/App.jsx`: estado, persistência e navegação.
- `src/Shell.jsx`: composição da aplicação e destinos.
- `src/components/UI.jsx`: marca, navegação e título de página.
- `src/components/ui/index.jsx`: controles e padrões compartilhados.
- `Learn.jsx`, `Drawing.jsx`, `Review.jsx`, `Settings.jsx`: áreas separadas.
- `Home.jsx`, `StudySession.jsx`, `Jlpt.jsx`, `JlptDiagnostic.jsx`: rotina e trilha.
- `Notebook.jsx`, `ConversationChat.jsx`, `MediaLab.jsx`, `WebResources.jsx`: ferramentas de estudo.
- `src/index.css`: fonte, tokens Tailwind e estilos globais.
- `state.js`, `progress.js`, `timer.js`, `learning.js`: lógica sem JSX.
- `data.js`, `curriculum.js`: conteúdo didático.
- `navigation.js`, `useDialogFocus.js`: teclado e foco.
- `tests/`: lógica e fluxos acessíveis no navegador.

## Dados e offline

O progresso permanece em `kotonoha.v1`, com exportação/importação em Preferências. Não há sincronização automática entre aparelhos. O PWA de produção permite uso offline do conteúdo armazenado após primeiro acesso. Instalação fora de localhost requer HTTPS. Vozes dependem do aparelho; fontes latinas são locais.

## IA opcional

A chave e o modelo Groq configurados em Preferências ficam no sessionStorage e são usados pelo cliente de IA. Sem essa chave, o app usa `/api/ai`, encaminhado pelo Vite ao OmniRoute local. Configure `OMNIROUTE_URL` e `OMNIROUTE_KEY` no ambiente do servidor. A variável antiga de chave continua aceita somente pelo proxy, para compatibilidade; não é referenciada no cliente. Nunca inclua `.env.local` em pacotes ou repositórios.

O proxy de desenvolvimento/preview não é incluído em hospedagem estática. Para publicar, configure backend equivalente ou use Groq na sessão. IA e materiais remotos não têm garantia de funcionamento offline.

## Documentação

[Análise do projeto](ANALISE-PROJETO.md), [produto](PRODUCT.md), [sistema visual](DESIGN.md) e [decisões de interface](design-system/kotonoha/MASTER.md).
