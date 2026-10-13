# Arquitetura — Kotonoha

## Princípios

Kotonoha é um PWA React/Vite de estudo N5, com dados e progresso locais.
Seguimos **Feature-Sliced Design v2.1** com regra *pages first*: uma tela mantém a lógica que só ela usa. Só extraímos código quando a responsabilidade é compartilhada, estável e independente.

```text
src/
├── main.jsx                 Entrada React/Vite
├── app/
│   ├── App.jsx              Estado global, persistência e navegação
│   ├── Shell.jsx            Layout, rotas e tema
│   ├── index.css
│   └── ui/                  Modais e ações globais
├── pages/
│   ├── home/                Tela inicial e desafio diário
│   ├── learning-path/       Trilha
│   ├── lesson/              Microlição e WanaKana
│   ├── checkpoint/          Avaliações por unidade
│   ├── practice/            Prática e escuta
│   ├── library/             Biblioteca, caligrafia e KanjiVG
│   ├── progress/            Progresso, diagnósticos e revisão N5
│   ├── review/              SRS
│   ├── notebook/            Caderno
│   ├── settings/            Preferências e backups
│   ├── syntax/              Laboratório sintático
│   ├── conversation/        Conversação
│   └── pronunciation/       Pronúncia
├── entities/study/
│   ├── index.js             API pública do domínio
│   ├── content/             Conteúdo N5
│   └── model/               Progresso, lições, SRS e pedagogia
└── shared/
    ├── ui/                  Componentes visuais e layout reutilizáveis
    └── lib/                 Foco e navegação por teclado
```

## Regras

- Direção de importação: `app → pages → entities → shared`.
- Pages não importam outras pages. App importa cada page por `pages/<nome>/index.js`.
- Pages e app importam modelos pela API `entities/study/index.js`, não pelos seus internos.
- Infraestrutura comum não importa código de domínio.
- Regras de aprendizagem permanecem agrupadas em `entities/study`, pois compartilham estado e pré-requisitos. Dividir antes de resolver dependências entre SRS/curso/avaliação aumentaria o acoplamento.
- Atomic Design orienta composição visual (átomos como Button/Icon, conjuntos e blocos). **Não cria pastas vazias ou cópias dos componentes**; use o UI kit existente.

## Invariantes

Chave local `kotonoha.v1`, versões de backup, IDs de cartões e microlições, cálculo de progresso, rotas, UI/brand e conteúdo autoral mantidos. A arquitetura não libera N4 nem cria certificação.

## Quality gate

```bash
npm ci
npm test
npm run check:architecture
npm run audit:n5-course
npm run build
npm run test:e2e
```

O guard de arquitetura verifica caminhos ausentes, pastas legadas e limites de dependências. Ele não substitui testes de interface nem revisão linguística.
