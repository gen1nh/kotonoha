import React, { useState, useEffect } from "react";
import {useSubpageNavigation} from "../../../shared/lib/useSubpageNavigation.js";
import Icon from "../../../shared/ui/Icon.jsx";
import { Card, Button, NavigationTile, AudioRateControl } from "../../../shared/ui/index.jsx";
import {speakJapanese,useReadingPreferences} from "../../../entities/study/index.js";
import { PageHeading } from "../../../shared/ui/index.jsx";
import { HIRAGANA, KATAKANA, VOCAB, GRAMMAR } from "../../../entities/study/index.js";
import { CURRICULUM, VOCAB_BY_LEVEL } from "../../../entities/study/index.js";
import WebResources from "./WebResources.jsx";
import MediaLab from "./MediaLab.jsx";
import Drawing from "./Drawing.jsx";
import { N5_KANJI } from "../../../entities/study/index.js";
export function Learn({
  state,
  study,
  update,
  toast,
  go,
  speak,
  learnTopic = "hiragana",
  openGuidedLesson,
  changeLevel,
}) {
  const [tab, setTab] = useState(learnTopic);
  const readingPreferences=useReadingPreferences();
  const [speechRate,setSpeechRate]=useState(()=>readingPreferences.speechRate);
  const playJapanese=text=>speakJapanese(text,toast,{rate:speechRate});
  const [page,setPage,backCategory]=useSubpageNavigation('learn','menu',['menu','hiragana','katakana','kanji','vocabulary','grammar','web_resources','media_lab']);
  const showCategories=page==='menu';
  useEffect(() => {
    if(learnTopic!=='hiragana' && ['katakana','kanji','vocabulary','grammar','web_resources','media_lab'].includes(learnTopic))setPage(learnTopic);
    setTab(learnTopic);
    setCharacter(learnTopic === "katakana" ? "ア" : learnTopic === "kanji" ? N5_KANJI[0].glyph : "あ");
  }, [learnTopic]);

  useEffect(()=>{
    if(page!=='menu' && page!==tab) {
      setTab(page);
      setCharacter(page==='katakana'?'ア':page==='kanji'?N5_KANJI[0].glyph:'あ');
    }
  },[page]);
    const [quiz, setQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [character, setCharacter] = useState(
    learnTopic === "katakana" ? "ア" : learnTopic === "kanji" ? N5_KANJI[0].glyph : "あ",
  );
  const [search, setSearch] = useState("");
  const array = tab === "kanji" ? N5_KANJI.map(row=>[row.glyph,row.reading]) : tab === "hiragana" ? HIRAGANA : KATAKANA;
  const type = tab === "kanji" ? "Kanji N5" : tab === "hiragana" ? "Hiragana" : "Katakana";
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
    setPage(next);
    setQuiz(false);
    setAnswers({});
    setCharacter(next === "katakana" ? "ア" : next === "kanji" ? N5_KANJI[0].glyph : "あ");
  }

  const LEARN_TABS = [
    { id: "hiragana", label: "Hiragana", glyph: "あ", count: "46", color: "text-primary-strong" },
    { id: "katakana", label: "Katakana", glyph: "ア", count: "46", color: "text-primary-strong" },
    { id: "kanji", label: "Kanji N5", glyph: "日", count: String(N5_KANJI.length), color: "text-primary-strong" },
    {
      id: "vocabulary",
      label: `Palavras ${selectedLevel}`,
      glyph: "語",
      count: String(vocabulary.length),
      color: "text-amber-ink",
    },
    { id: "grammar", label: "Gramática", glyph: "文", color: "text-indigo-ink" },

  ];
  // Materiais opcionais só entram na barra de abas quando abertos. Assim todo
  // painel ativo possui uma aba ARIA correspondente e navegável pelo teclado.
  const optionalTab = tab === "web_resources"
    ? { id: "web_resources", label: "Fontes web", glyph: "本", color: "text-blue" }
    : tab === "media_lab"
      ? { id: "media_lab", label: "Mídia", glyph: "音", color: "text-blue" }
      : null;
  const visibleTabs = optionalTab ? [...LEARN_TABS, optionalTab] : LEARN_TABS;

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Biblioteca */}
      <PageHeading
        title="Biblioteca & Alfabetos Kana"
        description="Consulte caracteres, frases e significados; a Trilha controla a progressão."
        icon="learn"
        iconBg="bg-blue-soft"
        iconColor="text-blue"
      />

      {showCategories&&<section className="space-y-3" aria-label="Categorias da Biblioteca">
        <button type="button" className="min-h-11 text-sm font-bold text-primary-strong" onClick={()=>go("practice")}>← Voltar a Praticar</button>
        <h2 className="text-base font-bold text-ink-strong">O que você quer consultar?</h2>
        <div className="grid grid-cols-2 gap-3">
          {LEARN_TABS.map(item=><NavigationTile key={item.id} symbol={item.glyph} title={item.label}
            description={item.id==='hiragana'?'Alfabeto básico.':item.id==='katakana'?'Palavras estrangeiras.':item.id==='kanji'?'Caracteres e leituras.':item.id==='vocabulary'?'Palavras do seu nível.':'Estruturas e partículas.'}
            meta={item.count?item.count+' itens':null} onClick={()=>changeTab(item.id)}/>)}
        </div>
        <details className="rounded-2xl border border-line bg-paper p-4">
          <summary className="min-h-11 cursor-pointer font-bold text-sm text-ink-strong">Materiais complementares</summary>
          <div className="grid grid-cols-2 gap-3 pt-3">
            <NavigationTile symbol="本" title="Fontes Web" description="Materiais para consultar." onClick={()=>changeTab('web_resources')}/>
            <NavigationTile symbol="音" title="Mídia" description="Explorar japonês na cultura." onClick={()=>changeTab('media_lab')}/>
          </div>
        </details>
      </section>}
      {!showCategories&&<>
        <button type="button" className="min-h-11 font-bold text-sm text-primary-strong" onClick={backCategory}>← Todas as categorias</button>
        <details className="rounded-xl border border-line bg-paper p-3">
          <summary className="min-h-11 cursor-pointer text-sm font-bold text-ink-strong">Ajustar áudio desta consulta</summary>
          <div className="pt-2"><AudioRateControl rate={speechRate} onChange={setSpeechRate} defaultRate={readingPreferences.speechRate}/></div>
        </details>
      <div className="rounded-2xl border border-line bg-paper p-4 space-y-2" aria-label="Orientação de estudo">
        <p className="font-bold text-ink-strong">Estude sem se perder</p>
        <p className="text-sm text-muted">Leia os exemplos, ouça a pronúncia e pratique. Para avançar, retorne à lição guiada na Trilha. As fontes e mídias abaixo são materiais opcionais.</p>
        <div className="flex flex-wrap gap-3 items-center">
          <button type="button" onClick={() => go('path')} className="text-sm font-bold text-primary underline underline-offset-4">← Voltar para minha trilha</button>
          <button type="button" onClick={() => go('practice')} className="rounded-xl border-2 border-primary px-3 py-2 text-sm font-bold text-primary-strong">Prática livre →</button>
        </div>
        <p className="text-xs text-muted">Esta área é de consulta. Para conquistar competências, use a Trilha.</p>
        <label className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink-strong">Nível de referência <select className="min-h-11 rounded-xl border border-line bg-paper px-3 text-ink-strong" value={selectedLevel} onChange={e=>changeLevel(e.target.value)}>{['N5','N4','N3','N2','N1'].map(level=><option key={level} value={level}>{level}</option>)}</select></label>
      </div>
      <details className="rounded-xl border border-line bg-paper p-3">
        <summary className="cursor-pointer font-bold text-sm text-muted">Materiais complementares (opcional)</summary>
        <div className="flex flex-wrap gap-2 mt-3">
          <button type="button" className="rounded-lg border border-line px-3 py-2 text-sm text-primary" onClick={() => changeTab('web_resources')}>Fontes Web</button>
          <button type="button" className="rounded-lg border border-line px-3 py-2 text-sm text-primary" onClick={() => changeTab('media_lab')}>Mídia & Animes</button>
        </div>
      </details>
      <div id="learn-panel" aria-label="Conteúdo selecionado da biblioteca">
        {tab === "web_resources" ? (
          <WebResources state={state} update={update} toast={toast} />
        ) : tab === "media_lab" ? (
          <MediaLab state={state} update={update} speak={speak} toast={toast} />
        ) : ["hiragana", "katakana", "kanji"].includes(tab) ? (
          <div className="space-y-6">
            <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-ink mt-1">
                  {tab === "kanji" ? "105 kanji com guia de traços" : `Matriz dos 46 caracteres ${type}`}
                </h2>
                <p className="text-sm text-muted mt-0.5">
                  Toque para escutar a pronúncia e praticar o traço de escrita
                  no papel digital.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => tab === "kanji" ? go("path") : study(type)}
                className="shrink-0"
              >
                {tab === "kanji" ? "Abrir minha Trilha →" : "Estudar 5 novos →"}
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
                        playJapanese(ch);
                      }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-b-4 transition-all cursor-pointer active:translate-y-px ${
                        isSelected
                          ? "border-primary bg-primary border-b-primary-dark text-white font-black scale-105 z-10"
                          : "border-line bg-paper text-ink-strong hover:bg-raised hover:border-edge"
                      }`}
                    >
                      <span className="font-jp text-2xl font-black">{ch}</span>
                      <small
                        className={`text-xs mt-1 font-bold ${isSelected ? "text-white/90" : "text-muted"}`}
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
                    <span className="text-xs font-black text-primary-strong uppercase tracking-wider">{type}</span>
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
                  onClick={() => playJapanese(character)}
                >
                  <Icon name="sound" /> Ouvir som ({character})
                </Button>
              </div>
              <Drawing
                character={character}
                random={() => {
                  const ch = array[Math.floor(Math.random() * array.length)][0];
                  setCharacter(ch);
                  playJapanese(ch);
                }}
                save={() => {
                  update((s) => {
                    s.lessons[`draw:${character}`] = true;
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
                  <span className="text-xs font-black text-flame-ink uppercase tracking-wider">JLPT {selectedLevel}</span>
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
                      <span className="text-xs font-black text-flame-ink uppercase tracking-wider">
                        {selectedLevel}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-ink">
                      {kana}{" "}
                      <span className="text-xs text-muted font-normal">
                        {readingPreferences.showRomaji?`(${romaji})`:null}
                      </span>
                    </span>
                    <p className="text-xs text-muted truncate">{meaning}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playJapanese(kana)}
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
                  <span className="text-xs font-black text-blue-ink uppercase tracking-wider">Gramática · {selectedLevel}</span>
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
                  selectedLevel === "N5" ? setQuiz(true) : go("path")
                }
              >
                {selectedLevel === "N5"
                  ? "Praticar desafio"
                  : `Consultar minha Trilha`}{" "}
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
                      <span className="text-xs font-black text-blue-ink uppercase tracking-wider">
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
                        onClick={() => playJapanese(g.example)}
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
      </>}
    </div>
  );
}
