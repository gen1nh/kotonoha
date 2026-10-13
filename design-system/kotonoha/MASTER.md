# Kotonoha — Master Design System & Diretrizes de Interface

Este documento é a fonte única da verdade para decisões visuais, arquitetura de tokens, tipografia responsiva e componentes da interface do **Kotonoha**.

---

## 1. Identidade & Filosofia Visual (Padrão Duolingo Gamificado)

- **Estilo Geral**: Tátil, alegre, encorajador, limpo e de alto contraste.
- **Botões 3D Físicos**: Todos os botões de ação e cartões interativos possuem relevo tridimensional (`border-2 border-b-4` ou `border-b-4`) com mecânica física de afundamento no clique (`active:border-b-2 active:translate-y-[2px]`).
- **Eliminação de Hardcodes**: Proibido uso de hexadecimais arbitrários inline (`[#...]`). Todos os estilos devem consumir tokens CSS nativos e classes utilitárias semânticas.
- **Sem Tags Flutuantes**: Nada de badges ou etiquetas soltas despadronizadas; a informação de status é direta e integrada à hierarquia de texto.

---

## 2. Tipografia e Escala Responsiva (Mobile & Web)

### 2.1 Fontes Globais
- **Texto Ocidental (Latim)**: `Nunito` (pesos 600, 700, 800, 900, 1000). Herança estrita e universal (`:root`, `html`, `body`, `button`, `input`, `select`, `dialog`).
- **Texto Japonês (Kanji / Kana)**: `M PLUS Rounded 1c` (`font-jp`, pesos 700, 800, 900). Aplicada automaticamente em qualquer elemento com `lang="ja"`.

### 2.2 Escala de Tipografia Padronizada
| Token / Classe | Mobile (telas < 640px) | Web (telas >= 640px) | Peso / Estilo | Uso Principal |
| :--- | :--- | :--- | :--- | :--- |
| `.type-display` | `1.625rem` (26px) / leading 1.15 | `2.25rem` (36px) / leading 1.2 | `900`, tracking -0.02em | Hero banner, grandes chamadas |
| `.type-h1` | `1.25rem` (20px) / leading 1.25 | `1.75rem` (28px) / leading 1.25 | `900`, tracking -0.02em | Títulos de página (`PageHeading`) |
| `.type-h2` | `1.0625rem` (17px) / leading 1.3 | `1.25rem` (20px) / leading 1.3 | `900`, tracking -0.01em | Títulos de seção na Home e Labs |
| `.type-h3` | `0.9375rem` (15px) / leading 1.35 | `1.0625rem` (17px) / leading 1.35 | `900` | Títulos de cards, badges e diálogos |
| `.type-body` | `0.875rem` (14px) / leading 1.5 | `0.9375rem` (15px) / leading 1.5 | `700`, text-ink | Texto corrido e parágrafos explicativos |
| `.type-body-sm` | `0.75rem` (12px) / leading 1.45 | `0.8125rem` (13px) / leading 1.45 | `700`, text-muted | Subtítulos de apoio, metadados de lição |
| `.type-caption` | `0.6875rem` (11px) / leading 1.2 | `0.75rem` (12px) / leading 1.2 | `900`, uppercase, tracking 0.04em | Rótulos de contadores, tags de nível |
| `.type-button` | `0.875rem` (14px) / leading 1.2 | `0.9375rem` (15px) / leading 1.2 | `900`, uppercase, tracking 0.03em | Rótulo de botões e seletores |

---

## 3. Paleta Oficial de Tokens Semânticos

| Token CSS | Classe Tailwind | Hex Equivalente | Significado Semântico |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `bg-primary`, `text-primary` | `#58cc02` | Verde Duolingo: Ação primária, acerto, avanço |
| `--color-primary-dark` | `border-primary-dark` | `#58a700` | Sombra 3D da borda inferior do botão verde |
| `--color-accent-soft` | `bg-accent-soft` | `#d7ffb8` | Fundo suave de cards de sucesso e badges |
| `--color-blue` | `bg-blue`, `text-blue` | `#1cb0f6` | Azul Macaw: Revisões SRS, sintaxe e explicações |
| `--color-blue-dark` | `border-blue-dark` | `#1899d6` | Sombra 3D inferior do botão azul |
| `--color-blue-soft` | `bg-blue-soft` | `#ddf4ff` | Fundo suave para cards e abas selecionadas |
| `--color-flame` | `bg-flame`, `text-flame` | `#ff9600` | Laranja Fox: Ofensiva diária (Streak) e Pitch Accent |
| `--color-flame-soft` | `bg-flame-soft` | `#ffebd1` | Fundo suave para contadores de fogo |
| `--color-danger` | `bg-danger`, `text-danger` | `#ff4b4b` | Vermelho Cardinal: Erros, avisos críticos |
| `--color-danger-soft` | `bg-danger-soft` | `#ffdada` | Fundo suave para blocos de erro |
| `--color-purple` | `bg-purple`, `text-purple` | `#ce82ff` | Roxo Ametista: Sensei Hiroshi e Diálogo |
| `--color-purple-soft` | `bg-purple-soft` | `#f5e6ff` | Fundo suave do Sensei Hiroshi |
| `--color-purple-ink` | `text-purple-ink` | `#892bd4` | Texto de destaque do Sensei Hiroshi |
| `--color-paper` | `bg-paper` | `#ffffff` | Branco puro para superfícies e cartões |
| `--color-raised` | `bg-raised` | `#f7f7f7` | Fundo ligeiramente elevado/cinza claro |
| `--color-line` | `border-line` | `#e5e5e5` | Linhas e bordas limpas e nítidas de 2px |
| `--color-edge` | `border-edge` | `#cecece` | Linhas de contraste secundário |
| `--color-ink-strong`| `text-ink-strong` | `#3c3c3c` | Texto principal com máximo contraste e legibilidade |
| `--color-ink` | `text-ink` | `#4b4b4b` | Texto normal de leitura |
| `--color-muted` | `text-muted` | `#777777` | Legendas, metadados e textos secundários |

---

## 4. Grade dos 6 Laboratórios e Práticas de Estudo

Todos os 6 cartões de fixação na tela inicial compartilham a **MESMA grade unificada**:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
  {/* Card 1: Contraste Sintático SOV (Azul) */}
  {/* Card 2: Simulador LINE / Roleplay (Verde) */}
  {/* Card 3: Pitch Accent & Fonética (Laranja) */}
  {/* Card 4: Diário de Bordo de Erros (Roxo) */}
  {/* Card 5: Repetição Espaçada SRS (Azul) */}
  {/* Card 6: Trilha Oficial JLPT N5 (Verde com barra de progresso) */}
</div>
```
- **Uniformidade**: Espaçamento horizontal e vertical idêntico (`gap-4`), mesma estrutura de padding (`p-5`), raio de borda (`rounded-2xl border-2 border-b-4 border-line`) e ícones de 48x48px com cantos arredondados (`rounded-2xl`).
- **Zero Discrepância**: Nunca separar os cards 5 e 6 em uma seção isolada com `space-y-8` ou `md:grid-cols-2`, pois isso causaria espaçamento vertical desigual entre as linhas de cards.

---

## 5. Ícones Padronizados

- Proibido o uso de emojis soltos no corpo de botões e rótulos de navegação.
- Todos os ícones são renderizados via `<Icon name="..." />` utilizando SVGs vetoriais preenchidos sólidos (`fill="currentColor"`).
