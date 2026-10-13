import React, { useState } from "react";
import Icon from "../../../shared/ui/Icon.jsx";

export const CURATED_RESOURCES = [
  {
    id: "r1",
    title: "Guia de Gramática do Tae Kim (em Português)",
    author: "Tae Kim",
    level: "N5–N3",
    language: "Português",
    type: "Gramática & Guia",
    description:
      "A abordagem mais lógica e respeitada para aprender a estrutura do japonês do ponto de vista japonês, sem tentar forçar as regras da gramática ocidental. Tradução completa em português.",
    url: "https://guidetojapanese.org/portuguese/",
    isFree: true,
    highlights: [
      "Explicações em Português",
      "Ordem lógica",
      "Exercícios práticos",
    ],
  },
  {
    id: "r2",
    title: "NHK Easy Japanese (Lições em Português)",
    author: "NHK World Japan",
    level: "N5",
    language: "Português",
    type: "Curso & Áudio",
    description:
      "48 lições em áudio e texto produzidas pela emissora pública japonesa, acompanhando a história de Anna, uma intercambista em Tóquio. Explicações completas em português brasileiro com PDFs para baixar.",
    url: "https://www.nhk.or.jp/lesson/pt/",
    isFree: true,
    highlights: ["Áudio nativo com atores", "PDFs gratuitos", "Diálogos úteis"],
  },
  {
    id: "r3",
    title: "NHK News Web Easy",
    author: "NHK",
    level: "N5–N4",
    language: "Japonês Fácil",
    type: "Leitura & Notícias",
    description:
      "Notícias reais do cotidiano japonês reescritas em vocabulário e gramática simplificados, com furigana sobre todos os kanjis e áudio de leitura com fala natural pausada.",
    url: "https://www3.nhk.or.jp/news/easy/",
    isFree: true,
    highlights: [
      "Furigana interativo",
      "Áudio da notícia",
      "Vocabulário do dia a dia",
    ],
  },
  {
    id: "r4",
    title: "Tadoku Graded Readers (Leituras Gratuitas)",
    author: "NPO Tadoku",
    level: "N5–N1",
    language: "Japonês",
    type: "Leitura Graduada",
    description:
      "Filosofia de leitura extensiva: dezenas de livros infantis e contos ilustrados graduados por dificuldade. Começa no Nível 0 (poucas palavras por página com ilustrações) até o Nível 4.",
    url: "https://tadoku.org/japanese/en/free-books/",
    isFree: true,
    highlights: [
      "Livros ilustrados",
      "Níveis bem calibrados",
      "Áudio incluído",
    ],
  },
  {
    id: "r5",
    title: "Nihongo con Teppei (Podcast)",
    author: "Teppei Sensei",
    level: "N5–N4",
    language: "Japonês",
    type: "Podcast & Escuta",
    description:
      "O podcast mais recomendado no mundo para iniciantes. Teppei fala de forma clara e descontraída sobre assuntos do dia a dia, repetindo palavras-chave para criar compreensão natural.",
    url: "https://nihongoconteppei.com/",
    isFree: true,
    highlights: [
      "Episódios curtos de 5 min",
      "Repetição natural",
      "Excelente para rotina",
    ],
  },
  {
    id: "r6",
    title: "Jisho.org (Dicionário Poderoso)",
    author: "Kim Ahlström / Comunidade",
    level: "Todos",
    language: "Inglês / Japonês",
    type: "Dicionário",
    description:
      "A principal referência de busca de vocabulário e kanji. Permite buscar por kanji desenhado, radicais, nível JLPT (ex: #jlpt-n5) e decomposição morfológica de frases.",
    url: "https://jisho.org/",
    isFree: true,
    highlights: ["Ordem dos traços animada", "Tags JLPT", "Busca por radicais"],
  },
  {
    id: "r7",
    title: "Comprehensible Japanese",
    author: "Yuki Sensei",
    level: "N5–N3",
    language: "Japonês",
    type: "Vídeos Imersivos",
    description:
      "Vídeos de imersão compreensível no YouTube onde a professora desenha e gesticula enquanto fala em japonês nativo, permitindo que até iniciantes entendam sem tradução.",
    url: "https://cijapanese.com/",
    isFree: true,
    highlights: [
      "Desenhos em tempo real",
      "Sem legendas em inglês forçadas",
      "Histórias culturais",
    ],
  },
  {
    id: "r8",
    title: "Tangorin (Exemplos do JLPT)",
    author: "Tangorin",
    level: "Todos",
    language: "Inglês / Japonês",
    type: "Dicionário & Frases",
    description:
      "Dicionário especializado em encontrar centenas de frases de exemplo reais para cada palavra ou estrutura gramatical, com separação por nível de prova.",
    url: "https://tangorin.com/",
    isFree: true,
    highlights: [
      "Frases de exemplo ricas",
      "Filtro de kanji por série escolar",
      "Vocabulário temático",
    ],
  },
];

export default function WebResources({ state, update, toast }) {
  const [filterType, setFilterType] = useState("all");
  const [filterLang, setFilterLang] = useState("all");
  const [search, setSearch] = useState("");

  const savedResources = state.savedWebResources || [];

  const handleToggleSave = (resource) => {
    update((s) => {
      if (!s.savedWebResources) s.savedWebResources = [];
      const exists = s.savedWebResources.includes(resource.id);
      if (exists) {
        s.savedWebResources = s.savedWebResources.filter(
          (id) => id !== resource.id,
        );
      } else {
        s.savedWebResources.push(resource.id);
        // Também adiciona ao Kanban na coluna "Quero Aprender"
        if (!s.notebook) s.notebook = { notes: [], kanban: [], doubts: [] };
        if (!s.notebook.kanban) s.notebook.kanban = [];
        s.notebook.kanban.unshift({
          id: `kanban-res-${Date.now()}`,
          title: `Explorar: ${resource.title}`,
          tag: "Recurso Web",
          level: resource.level,
          notes: resource.description.slice(0, 100) + "...",
          status: "want_to_learn",
        });
      }
    });
    if (toast) {
      const isSaved = !savedResources.includes(resource.id);
      toast(
        isSaved
          ? "Salvo na sua lista e no seu Kanban!"
          : "Removido dos salvos.",
      );
    }
  };

  const filtered = CURATED_RESOURCES.filter((res) => {
    const matchesSearch = (res.title + " " + res.description + " " + res.author)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      filterType === "all" ||
      res.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesLang =
      filterLang === "all" ||
      (filterLang === "pt" && res.language === "Português") ||
      (filterLang === "ja" && res.language !== "Português");
    return matchesSearch && matchesType && matchesLang;
  });

  return (
    <div className="w-full space-y-6">
      <header className="p-6 rounded-2xl border border-line bg-paper space-y-2">
        <div className="inline-flex items-center gap-2 text-primary-strong text-xs font-bold">
          <Icon name="external" />
          <span>CURADORIA GRATUITA DA WEB</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink">
          Fontes Essenciais de Japonês Gratuitas
        </h2>
        <p className="text-sm text-muted leading-relaxed max-w-3xl">
          Os melhores materiais abertos e de qualidade comprovada na internet
          para complementar seu estudo no Kotonoha, com destaque para
          explicações em português.
        </p>
      </header>

      {/* Filtros e Busca */}
      <div className="p-4 rounded-xl border border-line bg-paper/60 space-y-3">
        <input
          type="text"
          placeholder="Buscar recurso por nome, assunto ou autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-sm text-ink placeholder:text-muted focus:outline-edge"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-muted uppercase tracking-wider text-[10px] mr-1">
              Idioma:
            </span>
            {[
              ["all", "Todos"],
              ["pt", "🇧🇷 Em Português"],
              ["ja", "🇯🇵 Imersão em Japonês"],
            ].map(([k, label]) => (
              <button
                key={k}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  filterLang === k
                    ? "border-primary bg-accent-soft/60 text-primary-strong font-bold"
                    : "border-line bg-surface text-muted hover:text-ink"
                }`}
                onClick={() => setFilterLang(k)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-muted uppercase tracking-wider text-[10px] mr-1">
              Tipo:
            </span>
            {["all", "Gramática", "Leitura", "Podcast", "Dicionário"].map(
              (t) => (
                <button
                  key={t}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    filterType === t
                      ? "border-primary bg-accent-soft/60 text-primary-strong font-bold"
                      : "border-line bg-surface text-muted hover:text-ink"
                  }`}
                  onClick={() => setFilterType(t)}
                >
                  {t === "all" ? "Todos os formatos" : t}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Grid de Recursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
        {filtered.map((res) => {
          const isSaved = savedResources.includes(res.id);
          return (
            <article
              key={res.id}
              className="p-5 rounded-2xl border border-line bg-surface flex flex-col justify-between space-y-4 hover:border-edge transition-colors select-none"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-index text-ink border border-line">
                      {res.level}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        res.language === "Português"
                          ? "bg-accent-soft/60 text-primary-strong border-primary/20"
                          : "bg-paper text-muted border-line"
                      }`}
                    >
                      {res.language}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-paper text-muted border border-line">
                      {res.type}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-success uppercase tracking-wider">
                    Gratuito
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-ink">{res.title}</h3>
                  <small className="text-xs text-muted block mt-0.5">
                    Por {res.author}
                  </small>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  {res.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {res.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold text-muted"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-line text-xs">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary text-white font-bold cursor-pointer hover:bg-primary-strong transition-colors"
                >
                  <Icon name="external" /> Acessar Fonte
                </a>
                <button
                  className={`py-2 px-3 rounded-lg border font-semibold cursor-pointer transition-colors ${
                    isSaved
                      ? "border-secondary bg-secondary-soft text-secondary-ink font-bold"
                      : "border-line bg-surface text-muted hover:text-ink hover:bg-paper"
                  }`}
                  onClick={() => handleToggleSave(res)}
                >
                  {isSaved ? "★ Salvo" : "☆ Salvar"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
