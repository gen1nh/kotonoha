import React, { useState, useEffect } from "react";
import Icon from "./Icon.jsx";
import { Card, Button } from "./ui/index.jsx";
import { PageHeading } from "./UI.jsx";
import { HIRAGANA, KATAKANA, VOCAB, GRAMMAR } from "../data.js";
import { CURRICULUM, VOCAB_BY_LEVEL } from "../curriculum.js";
import { markStudy } from "../state.js";
import { handleTabKeys } from "../navigation.js";
import WebResources from "./WebResources.jsx";
import MediaLab from "./MediaLab.jsx";
import Drawing from "./Drawing.jsx";
export function Learn({
  state,
  study,
  update,
  toast,
  go,
  speak,
  learnTopic = "hiragana",
}) {
  const [tab, setTab] = useState(learnTopic);
  useEffect(() => {
    setTab(learnTopic);
    setCharacter(learnTopic === "katakana" ? "ア" : "あ");
  }, [learnTopic]);

  const [quiz, setQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [character, setCharacter] = useState(
    learnTopic === "katakana" ? "ア" : "あ",
  );
  const [search, setSearch] = useState("");
  const array = tab === "hiragana" ? HIRAGANA : KATAKANA;
  const type = tab === "hiragana" ? "Hiragana" : "Katakana";
  const selectedLevel = state.selectedLevel || "N5";
  const vocabulary =
    selectedLevel === "N5" ? VOCAB : VOCAB_BY_LEVEL[selectedLevel] || VOCAB;
  const vocabularyType = `Vocabulário ${selectedLevel}`;
  const filteredWords = vocabulary.filter((word) =>
    word
      .join(" ")
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(
        search
          .trim()
          .toLocaleLowerCase("pt-BR")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      ),
  );

  function changeTab(next) {
    setTab(next);
    setQuiz(false);
    setAnswers({});
    setCharacter(next === "katakana" ? "ア" : "あ");
  }

  const LEARN_TABS = [
    { id: "hiragana", label: "Hiragana", glyph: "あ", count: "46", color: "text-sakura" },
    { id: "katakana", label: "Katakana", glyph: "ア", count: "46", color: "text-sakura" },
    {
      id: "vocabulary",
      label: `Palavras ${selectedLevel}`,
      glyph: "語",
      count: String(vocabulary.length),
      color: "text-amber-ink",
    },
    { id: "grammar", label: "Gramática", glyph: "文", color: "text-indigo-ink" },
    { id: "web_resources", label: "Fontes Web", glyph: "網", color: "text-review" },
    { id: "media_lab", label: "Mídia & Animes", glyph: "画", color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Biblioteca */}
      <PageHeading
        title="Biblioteca & Alfabetos Kana"
        description="Matriz dos 46 caracteres, lousa de caligrafia digital e vocabulário."
        icon="learn"
        iconBg="bg-blue-soft"
        iconColor="text-blue"
      />

      {/* Abas da Biblioteca */}
      <div
        className="flex flex-wrap gap-2 p-1.5 bg-paper rounded-2xl border-2 border-b-4 border-line"
        role="tablist"
        aria-label="Conteúdos da biblioteca"
        onKeyDown={handleTabKeys}
      >
        {LEARN_TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              aria-controls="learn-panel"
              tabIndex={active ? 0 : -1}
              aria-selected={active}
              onClick={() => changeTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl type-caption transition-all cursor-pointer select-none active:translate-y-px ${
                active
                  ? "bg-accent-soft text-primary-strong border-2 border-b-4 border-primary border-b-primary-dark shadow-xs"
                  : "text-muted hover:text-ink hover:bg-raised border-2 border-transparent"
              }`}
            >
              <span
                className={`font-jp text-base ${item.color || "text-primary"}`}
                aria-hidden="true"
              >
                {item.glyph}
              </span>
              <span>{item.label}</span>
              {item.count && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-raised border border-line text-muted">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div id="learn-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "web_resources" ? (
          <WebResources state={state} update={update} toast={toast} />
        ) : tab === "media_lab" ? (
          <MediaLab state={state} update={update} speak={speak} toast={toast} />
        ) : ["hiragana", "katakana"].includes(tab) ? (
          <div className="space-y-6">
            <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-ink mt-1">
                  Matriz dos 46 caracteres {type}
                </h2>
                <p className="text-sm text-muted mt-0.5">
                  Toque para escutar a pronúncia e praticar o traço de escrita
                  no papel digital.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => study(type)}
                className="shrink-0"
              >
                Estudar 5 novos →
              </Button>
            </Card>

            {/* Grid dos Caracteres Kana */}
            <Card>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {array.map(([ch, ro]) => {
                  const card = Object.values(state.cards).find(
                    (c) => c.prompt === ch,
                  );
                  const isMastered = card?.reps >= 3;
                  const isSelected = character === ch;
                  return (
                    <button
                      key={ch}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`${ch}, ${ro}. Ouvir e praticar`}
                      onClick={() => {
                        setCharacter(ch);
                        speak(ch);
                      }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-b-4 transition-all cursor-pointer active:translate-y-px ${
                        isSelected
                          ? "border-[#58cc02] bg-[#58cc02] border-b-[#46a302] text-white font-black scale-105 z-10"
                          : "border-[#e5e5e5] bg-white text-[#3c3c3c] hover:bg-[#f7f7f7] hover:border-[#cecece]"
                      }`}
                    >
                      <span className="font-jp text-2xl font-black">{ch}</span>
                      <small
                        className={`text-xs mt-1 font-bold ${isSelected ? "text-white/90" : "text-[#777777]"}`}
                      >
                        {ro}
                      </small>
                      {isMastered && (
                        <span
                          className={`absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                            isSelected
                              ? "bg-surface text-primary"
                              : "bg-success text-white"
                          }`}
                          title="Caractere dominado"
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Prática de Escrita / Desenho */}
            <Card className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">
                      Prática de Caligrafia
                    </span>
                    <span className="text-xs font-black text-[#58cc02] uppercase tracking-wider">{type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-ink mt-1 flex items-center gap-2.5">
                    <span>Caractere:</span>
                    <span className="font-jp text-3xl font-extrabold text-primary">{character}</span>
                    <span className="text-sm font-semibold text-muted">
                      ({array.find(([c]) => c === character)?.[1]})
                    </span>
                  </h3>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => speak(character)}
                >
                  <Icon name="sound" /> Ouvir som ({character})
                </Button>
              </div>
              <Drawing
                character={character}
                random={() => {
                  const ch = array[Math.floor(Math.random() * array.length)][0];
                  setCharacter(ch);
                  speak(ch);
                }}
                save={() => {
                  update((s) => {
                    s.lessons[`draw:${character}`] = true;
                    s.stats.reviews++;
                    markStudy(s);
                  });
                  toast(`${character} praticado no papel digital.`);
                }}
              />
            </Card>
          </div>
        ) : tab === "vocabulary" ? (
          <div className="space-y-6">
            <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#ff9600] uppercase tracking-wider">JLPT {selectedLevel}</span>
                  <span className="text-xs text-muted">Memorização contextual</span>
                </div>
                <h2 className="text-xl font-bold text-ink mt-1">
                  Palavras essenciais para o seu nível
                </h2>
                <p className="text-sm text-muted mt-0.5">
                  Pratique a leitura em kanji e kana, ouça a pronúncia nativa e
                  adicione às revisões.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => study(vocabularyType)}
                className="shrink-0"
              >
                Estudar 4 novas →
              </Button>
            </Card>

            {/* Barra de busca */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-line">
              <input
                type="search"
                placeholder="Buscar por japonês, romaji ou português…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full min-h-11 px-3.5 rounded-lg border border-edge bg-paper text-sm text-ink focus:outline-primary"
              />
              <span className="text-xs font-semibold text-muted">
                {filteredWords.length} de {vocabulary.length} palavras
              </span>
            </div>

            {/* Lista de palavras */}
            <div className="grid gap-2 sm:grid-cols-2">
              {filteredWords.map(([kanji, kana, romaji, meaning]) => (
                <div
                  key={kanji}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-line bg-surface hover:border-edge transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-jp text-lg font-bold text-primary mr-1">
                        {kanji}
                      </span>
                      <span className="text-xs font-black text-[#ff9600] uppercase tracking-wider">
                        {selectedLevel}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-ink">
                      {kana}{" "}
                      <span className="text-xs text-muted font-normal">
                        ({romaji})
                      </span>
                    </span>
                    <p className="text-xs text-muted truncate">{meaning}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speak(kana)}
                    title={`Ouvir ${kana}`}
                  >
                    <Icon name="sound" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Gramática */
          <div className="space-y-6">
            <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider">Gramática · {selectedLevel}</span>
                </div>
                <h2 className="text-xl font-bold text-ink mt-1">
                  Estruturas e partículas fundamentais
                </h2>
                <p className="text-sm text-muted mt-0.5">
                  Veja como as frases são formadas com exemplos práticos
                  traduzidos.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() =>
                  selectedLevel === "N5" ? setQuiz(true) : go("jlpt")
                }
              >
                {selectedLevel === "N5"
                  ? "Praticar desafio"
                  : `Abrir lições ${selectedLevel}`}{" "}
                →
              </Button>
            </Card>

            <div className="space-y-3">
              {(selectedLevel === "N5"
                ? GRAMMAR
                : CURRICULUM[selectedLevel].map((lesson) => ({
                    title: lesson.title,
                    text: lesson.explanation,
                    example: lesson.example,
                    meaning: lesson.translation,
                  }))
              ).map((g, index) => (
                <details
                  key={g.title}
                  open={index === 0}
                  className="group rounded-xl border border-line bg-surface p-4 transition-all open:border-edge"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-ink list-none">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{g.title}</span>
                      <span className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider">
                        Padrão
                      </span>
                    </div>
                    <span className="transition-transform group-open:rotate-180 text-muted">
                      <Icon name="chevron" />
                    </span>
                  </summary>
                  <div className="mt-3 pt-3 border-t border-line/60 space-y-2">
                    <p className="text-sm text-muted leading-relaxed">
                      {g.text}
                    </p>
                    <div className="p-3 rounded-lg bg-paper border border-line flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="font-jp text-base font-bold text-primary-strong"
                          lang="ja"
                        >
                          {g.example}
                        </p>
                        <span className="text-xs text-muted block mt-0.5">
                          {g.meaning}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speak(g.example)}
                        title="Ouvir exemplo"
                      >
                        <Icon name="sound" />
                      </Button>
                    </div>
                  </div>
                </details>
              ))}
            </div>

            {quiz && selectedLevel === "N5" && (
              <Card className="border-primary/40 bg-accent-soft/20 space-y-3">
                <h3 className="text-base font-bold text-ink">
                  Qual partícula marca o tópico principal da frase?
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[2, 0, 3, 1].map((i) => (
                    <Button
                      key={i}
                      variant="secondary"
                      onClick={() => {
                        setAnswers((a) => ({
                          ...a,
                          [i]: i === 0 ? "correct" : "incorrect",
                        }));
                        if (i === 0) {
                          update((s) => {
                            s.lessons.grammar = true;
                            markStudy(s);
                          });
                          toast("Correto! は (wa) marca o tópico.");
                        } else {
                          toast(
                            "Tente lembrar: a partícula fica logo após o tópico.",
                          );
                        }
                      }}
                    >
                      {GRAMMAR[i].title}
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
