import { handleTabKeys } from "../navigation.js";
import React, { useState, useEffect, useRef } from "react";
import { JLPT_PATHS } from "../data.js";
import { LEVELS, todayKey, markStudy } from "../state.js";
import Icon from "./Icon.jsx";
import JlptDiagnostic from "./JlptDiagnostic.jsx";
import { lessonsFor, isDone } from "../learning.js";
import { Card, Button, ProgressBar, Disclosure } from "./ui/index.jsx";
import { PageHeading } from "./UI.jsx";

export function Jlpt({
  state,
  update,
  toast,
  speak,
  changeLevel,
  openLearn,
  pathLesson,
}) {
  const selected = state.selectedLevel || "N5";
  const details = JLPT_PATHS[selected];
  const lessons = lessonsFor(selected);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [lessonFilter, setLessonFilter] = useState("all");
  const [score, setScore] = useState("");
  const [scoreError, setScoreError] = useState("");
  const scoreInput = useRef(null);
  const listHeading = useRef(null);

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId);
  const completed = lessons.filter((lesson) =>
    isDone(state, selected, lesson),
  ).length;
  const nextLesson =
    lessons.find((lesson) => !isDone(state, selected, lesson)) || lessons[0];
  const visibleLessons = lessons.filter(
    (lesson) =>
      lessonFilter === "all" ||
      (lessonFilter === "done"
        ? isDone(state, selected, lesson)
        : !isDone(state, selected, lesson)),
  );
  const mocks = state.mocks.filter((mock) => mock.level === selected);

  useEffect(() => {
    setActiveLessonId(
      lessons.some((lesson) => lesson.id === pathLesson) ? pathLesson : null,
    );
    setLessonFilter("all");
    setScore("");
    setScoreError("");
  }, [selected, pathLesson]);

  function start(lesson) {
    if (selected === "N5") openLearn(lesson.topic);
    else setActiveLessonId(lesson.id);
  }

  function back() {
    setActiveLessonId(null);
    requestAnimationFrame(() => {
      listHeading.current?.focus({ preventScroll: true });
      listHeading.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    });
  }

  function save() {
    const result = Number(score);
    if (
      !score.trim() ||
      !Number.isFinite(result) ||
      result < 0 ||
      result > 100
    ) {
      setScoreError("Informe um percentual entre 0 e 100.");
      scoreInput.current?.focus();
      return;
    }
    update((next) =>
      next.mocks.unshift({ level: selected, score: result, date: todayKey() }),
    );
    setScore("");
    setScoreError("");
    toast(`Simulado ${selected} registrado com sucesso.`);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Trilha JLPT */}
      <PageHeading
        title="Minha Trilha JLPT"
        description="Currículo estruturado do N5 ao N1 para conquistas sólidas."
        icon="jlpt"
        iconBg="bg-accent-soft"
        iconColor="text-primary"
      />

      {/* Seletor de Níveis JLPT */}
      <div
        className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 w-full min-w-0"
        role="tablist"
        aria-label="Níveis da trilha JLPT"
        onKeyDown={handleTabKeys}
      >
        {LEVELS.map(([id, label]) => {
          const group = lessonsFor(id);
          const count = group.filter((lesson) =>
            isDone(state, id, lesson),
          ).length;
          const isCurrent = id === selected;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`path-tab-${id}`}
              aria-selected={isCurrent}
              aria-controls="jlpt-panel"
              tabIndex={isCurrent ? 0 : -1}
              onClick={() => changeLevel(id)}
              className={`flex flex-col justify-between p-4 rounded-2xl border-2 border-b-4 text-left transition-all cursor-pointer select-none active:translate-y-px ${
                isCurrent
                  ? "border-primary bg-primary text-white border-b-primary-dark shadow-xs"
                  : "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xl sm:text-2xl font-black tabular-nums tracking-tight ${
                    isCurrent ? "text-white" : "text-ink-strong"
                  }`}
                >
                  {id}
                </span>
                {count === group.length && (
                  <span
                    className={`text-xs ${isCurrent ? "text-white" : "text-primary"}`}
                  >
                    <Icon name="check" />
                  </span>
                )}
              </div>
              <div className="mt-2.5">
                <span className={`block type-caption truncate ${isCurrent ? "text-white" : "text-muted"}`}>
                  {label}
                </span>
                <span className={`block text-[11px] font-bold mt-0.5 ${isCurrent ? "text-white/80" : "text-muted"}`}>
                  {count}/{group.length} {id === "N5" ? "blocos" : "lições"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div
        id="jlpt-panel"
        role="tabpanel"
        aria-labelledby={`path-tab-${selected}`}
      >
        {activeLesson && selected !== "N5" ? (
          <InteractiveLesson
            key={activeLesson.id}
            lesson={activeLesson}
            complete={!!state.lessons[activeLesson.id]}
            update={update}
            speak={speak}
            onBack={back}
          />
        ) : (
          <div className="space-y-6">
            {/* Visão Geral do Nível Atual */}
            <div className="rounded-3xl border-2 border-b-6 border-line bg-paper p-6 sm:p-8 grid md:grid-cols-12 gap-6 items-center shadow-xs">
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="type-caption text-primary">
                    {selected} · {LEVELS.find(([id]) => id === selected)?.[1]}
                  </span>
                  <span className="type-body-sm text-muted">
                    {selected === "N5"
                      ? "Kana, vocabulário e primeiras frases"
                      : "Lições guiadas com explicações"}
                  </span>
                </div>
                <h2
                  id="path-level-title"
                  className="type-display text-ink-strong"
                >
                  {details.name}
                </h2>
                <p className="type-body text-muted leading-relaxed">
                  {details.goal}
                </p>
              </div>

              <div className="md:col-span-5 bg-raised rounded-2xl p-5 border-2 border-line space-y-3">
                <div className="flex items-center justify-between type-caption text-ink">
                  <span>
                    Seu progresso em {selected}
                  </span>
                  <span className="text-primary font-black">
                    {completed} de {lessons.length}
                  </span>
                </div>
                <ProgressBar
                  value={(completed / (lessons.length || 1)) * 100}
                  label={`Progresso da trilha ${selected}`}
                />
                <div className="pt-2">
                  <small className="block type-caption text-muted mb-1">
                    {completed === lessons.length
                      ? "Trilha concluída"
                      : "Próximo passo recomendado:"}
                  </small>
                  <p className="type-h3 text-ink-strong truncate mb-3">
                    {nextLesson.title}
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => start(nextLesson)}
                  >
                    {completed === lessons.length
                      ? "Revisar Trilha"
                      : completed > 0
                        ? "Continuar Trilha"
                        : "Começar Trilha"}{" "}
                    →
                  </Button>
                </div>
              </div>
            </div>

            {/* Currículo e Lista de Lições */}
            <Card aria-labelledby="lesson-list-title" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-line">
                <div>
                  <h3
                    id="lesson-list-title"
                    ref={listHeading}
                    tabIndex={-1}
                    className="type-h2 text-ink-strong"
                  >
                    {selected === "N5"
                      ? "Sua base de japonês"
                      : `Lições do nível ${selected}`}
                  </h3>
                  <p className="type-body-sm text-muted">
                    {selected === "N5"
                      ? "Três blocos essenciais para começar com confiança."
                      : "Estude o exemplo prático, responda e entenda o raciocínio."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 bg-raised p-1.5 rounded-2xl border-2 border-line">
                  {[
                    ["all", "Todas", lessons.length],
                    ["pending", "Pendentes", lessons.length - completed],
                    ["done", "Concluídas", completed],
                  ].map(([value, label, count]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={lessonFilter === value}
                      onClick={() => setLessonFilter(value)}
                      className={`px-3 py-1.5 text-xs font-black uppercase rounded-xl cursor-pointer transition-all select-none ${
                        lessonFilter === value
                          ? "bg-paper text-ink-strong border-2 border-b-4 border-line shadow-xs active:translate-y-px"
                          : "text-muted hover:text-ink-strong"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Lições */}
              <div className="space-y-3" aria-live="polite">
                {visibleLessons.length ? (
                  visibleLessons.map((lesson) => {
                    const done = isDone(state, selected, lesson);
                    const index = lessons.indexOf(lesson);
                    return (
                      <div
                        key={lesson.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 border-b-4 border-line bg-paper transition-all hover:border-edge active:translate-y-px ${
                          done ? "bg-accent-soft/20 border-primary/40" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black border-2 ${
                              done
                                ? "bg-primary border-primary-dark text-white"
                                : "bg-raised border-line text-ink-strong"
                            }`}
                          >
                            {done ? (
                              <Icon name="check" className="w-4 h-4 text-white" />
                            ) : (
                              String(index + 1).padStart(2, "0")
                            )}
                          </span>
                          <div>
                            <h4 className="type-h3 text-ink-strong">
                              {lesson.title}
                            </h4>
                            <p className="type-body-sm text-muted mt-0.5">
                              {lesson.focus}
                            </p>
                            <small className="type-caption text-muted block mt-1">
                              {selected === "N5"
                                ? lesson.detail
                                : `${lesson.questions.length} questões com explicação detalhada`}
                            </small>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t-2 sm:border-t-0 border-line">
                          <span
                            className={`type-caption ${
                              done
                                ? "text-primary"
                                : lesson.id === nextLesson.id
                                  ? "text-blue"
                                  : "text-muted"
                            }`}
                          >
                            {done ? (
                              <span className="flex items-center gap-1">
                                <Icon name="check" className="w-3.5 h-3.5 text-primary" />
                                <span>Concluída</span>
                              </span>
                            ) : lesson.id === nextLesson.id ? (
                              "● Próximo passo"
                            ) : (
                              "Disponível"
                            )}
                          </span>
                          <Button
                            variant={lesson.id === nextLesson.id && !done ? "primary" : "secondary"}
                            size="sm"
                            onClick={() => start(lesson)}
                          >
                            {done
                              ? "Refazer"
                              : selected === "N5"
                                ? "Explorar"
                                : "Começar"}{" "}
                            →
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted">
                    <p className="text-sm">
                      Nenhuma lição encontrada para o filtro selecionado.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setLessonFilter("all")}
                    >
                      Ver todas as lições
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Disclosure
              title="Tempo, atividade e meta diária"
              description="Consulte seus registros sem interromper a trilha."
            >
              <JlptDiagnostic
                state={state}
                update={update}
                toast={toast}
                changeLevel={changeLevel}
              />
            </Disclosure>
            {/* Suporte: Recursos Oficiais & Diário de Simulados */}
            <Disclosure
              title="Preparação para a prova"
              description="Materiais oficiais e registro dos seus simulados."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
                <Card
                  aria-labelledby="path-resources-title"
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2"></div>
                  <h3
                    id="path-resources-title"
                    className="text-lg font-bold text-ink"
                  >
                    Pratique para a prova oficial
                  </h3>
                  <p className="text-xs text-muted">
                    Exemplos e áudios disponibilizados pela organização do JLPT
                    para complementar seus estudos.
                  </p>

                  <div className="divide-y divide-line/60 pt-2">
                    {[
                      [
                        "samples/sampleindex.html",
                        "Cadernos oficiais de questões",
                        "Questões selecionadas com áudio nativo",
                      ],
                      [
                        "samples/forlearners.html",
                        "Exemplos práticos por nível",
                        "Conheça a estrutura das questões",
                      ],
                    ].map(([url, title, hint]) => (
                      <a
                        key={url}
                        href={`https://www.jlpt.jp/e/${url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between py-3 text-left group hover:text-primary transition-colors"
                      >
                        <div>
                          <strong className="block text-sm font-semibold text-ink group-hover:text-primary">
                            {title}
                          </strong>
                          <small className="block text-xs text-muted">
                            {hint}
                          </small>
                        </div>
                        <Icon name="external" />
                      </a>
                    ))}
                  </div>
                </Card>

                <Card aria-labelledby="path-mocks-title" className="space-y-4">
                  <div className="flex items-center gap-2"></div>
                  <h3
                    id="path-mocks-title"
                    className="text-lg font-bold text-ink"
                  >
                    Registre seus resultados ({selected})
                  </h3>
                  <p className="text-xs text-muted">
                    Acompanhe seus acertos nos testes práticos que realizar.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      save();
                    }}
                    className="flex gap-2 items-start"
                  >
                    <div className="flex-1">
                      <input
                        id="mock-score"
                        ref={scoreInput}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Acertos (%)"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full min-h-11 px-3 rounded-lg border border-edge bg-surface text-sm text-ink focus:outline-primary"
                      />
                      {scoreError && (
                        <p className="text-xs text-danger mt-1">{scoreError}</p>
                      )}
                    </div>
                    <Button variant="primary" type="submit">
                      Registrar
                    </Button>
                  </form>

                  <div className="pt-2">
                    <strong className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">
                      Últimos registros
                    </strong>
                    {mocks.length ? (
                      <div className="space-y-1.5">
                        {mocks.slice(0, 4).map((mock, idx) => (
                          <div
                            key={`${mock.date}-${idx}`}
                            className="flex items-center justify-between p-2 rounded-lg bg-paper text-xs"
                          >
                            <span className="font-bold text-ink">
                              {mock.level}
                            </span>
                            <span className="text-muted">{mock.date}</span>
                            <span className={`text-xs font-black tabular-nums ${mock.score >= 70 ? "text-[#58cc02]" : "text-[#ff9600]"}`}>
                              {mock.score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted py-2">
                        Nenhum resultado registrado para o nível {selected}{" "}
                        ainda.
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </Disclosure>
          </div>
        )}
      </div>
    </div>
  );
}

function InteractiveLesson({ lesson, complete, update, speak, onBack }) {
  const [wasComplete] = useState(complete);
  const lessonRoot = useRef(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [finished, setFinished] = useState(false);
  const questionHeading = useRef(null);
  const question = lesson.questions[index];

  useEffect(() => {
    questionHeading.current?.focus({ preventScroll: true });
    if (index > 0 || finished)
      questionHeading.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
  }, [index, finished]);

  useEffect(() => {
    lessonRoot.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, []);

  if (finished) {
    return (
      <Card
        className="w-full min-w-0 text-center space-y-4 py-8"
        aria-labelledby="lesson-finished-title"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success text-2xl font-bold">
          <Icon name="check" />
        </div>
        <h2
          ref={questionHeading}
          id="lesson-finished-title"
          tabIndex={-1}
          className="text-2xl font-bold text-ink"
        >
          {lesson.title}
        </h2>
        <p className="text-sm text-muted">
          {wasComplete
            ? "Revisão concluída com sucesso!"
            : "Lição concluída! Seu progresso foi salvo com precisão."}
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Button variant="primary" onClick={onBack}>
            Voltar às lições da Trilha →
          </Button>
        </div>
      </Card>
    );
  }

  function next() {
    if (answer === null) return;
    if (index === lesson.questions.length - 1) {
      update((state) => {
        state.lessons[lesson.id] = true;
        markStudy(state);
      });
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer(null);
  }

  const isCorrect = answer === question.answer;

  return (
    <Card ref={lessonRoot} className="space-y-6 w-full min-w-0">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Voltar às lições {lesson.level}
        </Button>
        <span className="text-xs font-bold text-muted tabular-nums">
          Questão {String(index + 1).padStart(2, "0")} /{" "}
          {String(lesson.questions.length).padStart(2, "0")}
        </span>
      </div>

      <div>
        <span className="text-xs font-black text-[#58cc02] uppercase tracking-wider">{lesson.level} · Lição Guiada</span>
        <h2 className="text-xl font-bold text-ink mt-1">{lesson.title}</h2>
        <p className="text-sm text-muted mt-1 leading-relaxed">
          {lesson.explanation}
        </p>
      </div>

      <div className="rounded-xl bg-paper p-4 border border-line space-y-1">
        <p className="font-jp text-lg font-bold text-primary-strong" lang="ja">
          {lesson.example}
        </p>
        <span className="text-xs text-muted block">{lesson.translation}</span>
      </div>

      <div className="space-y-4 pt-2">
        <ProgressBar
          value={((index + 1) / lesson.questions.length) * 100}
          label={`Questão ${index + 1} de ${lesson.questions.length}`}
        />

        <h3
          ref={questionHeading}
          tabIndex={-1}
          className="text-base font-bold text-ink"
        >
          {question.prompt}
        </h3>

        {question.sentence && (
          <div className="flex items-center justify-between gap-3 bg-surface p-3 rounded-lg border border-edge">
            <p className="font-jp text-lg font-medium text-ink" lang="ja">
              {question.sentence}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => speak(question.sentence)}
            >
              <Icon name="sound" /> Ouvir
            </Button>
          </div>
        )}

        <div
          className="grid gap-2"
          role="group"
          aria-label="Opções de resposta"
        >
          {question.choices.map((choice, optionIndex) => {
            const selected = answer === optionIndex;
            const correctChoice =
              answer !== null && optionIndex === question.answer;
            return (
              <button
                key={choice}
                type="button"
                disabled={answer !== null}
                onClick={() => setAnswer(optionIndex)}
                className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left text-sm font-medium transition-all ${
                  correctChoice
                    ? "border-success bg-success-soft text-success font-bold"
                    : selected && !isCorrect
                      ? "border-danger bg-danger-soft text-danger"
                      : answer !== null
                        ? "border-line bg-paper/50 text-muted opacity-60"
                        : "border-edge bg-surface text-ink hover:bg-accent-soft active:translate-y-px"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper text-xs font-bold text-ink border border-line">
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {answer !== null && (
          <div
            className={`p-4 rounded-xl border ${
              isCorrect
                ? "border-success bg-success-soft text-ink"
                : "border-secondary bg-secondary-soft text-ink"
            }`}
            role="status"
            aria-live="polite"
          >
            <strong className="block text-sm font-bold text-ink">
              {isCorrect
                ? "Isso mesmo!"
                : `A resposta correta é a letra ${String.fromCharCode(65 + question.answer)}.`}
            </strong>
            <p className="text-xs text-ink/90 mt-1">{question.explanation}</p>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button variant="primary" onClick={next} disabled={answer === null}>
            {index === lesson.questions.length - 1
              ? "Concluir lição"
              : "Próxima questão"}{" "}
            →
          </Button>
        </div>
      </div>
    </Card>
  );
}
