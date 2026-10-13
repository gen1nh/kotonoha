import Icon from "./components/Icon.jsx";
import React, { useEffect, useState } from "react";
import { LEVELS, markStudy, todayKey } from "./state.js";
import { CURRICULUM, HOME_QUESTION } from "./curriculum.js";
import { Learn, Review, Paper, Jlpt, Settings } from "./components/Views.jsx";

function DailyQuestion({ state, update, go }) {
  const level = state.selectedLevel || "N5";
  const question = HOME_QUESTION[level];
  const key = `${todayKey()}:${level}`;
  const [selected, setSelected] = useState(
    () => state.dailyAnswers?.[key] ?? null,
  );
  useEffect(() => {
    setSelected(state.dailyAnswers?.[key] ?? null);
  }, [key, state.dailyAnswers]);

  function answer(index) {
    if (selected !== null) return;
    setSelected(index);
    update((next) => {
      const alreadyAnswered = Number.isInteger(next.dailyAnswers?.[key]);
      next.dailyAnswers ||= {};
      next.dailyAnswers[key] = index;
      if (!alreadyAnswered) {
        next.stats.reviews += 1;
        if (index === question.answer) next.stats.correct += 1;
        markStudy(next);
      }
    });
  }

  const complete = selected !== null;
  const correct = selected === question.answer;
  return (
    <section className="daily-question" aria-labelledby="dailyQuestionTitle">
      <div className="daily-question-head">
        <div>
          <h2 id="dailyQuestionTitle">{question.prompt}</h2>
        </div>
        <span className="question-count">01 / 01</span>
      </div>
      <p className="daily-sentence" lang="ja">
        {question.sentence}
      </p>
      <div
        className="daily-choices"
        role="group"
        aria-label="Escolha uma resposta"
      >
        {question.choices.map((choice, index) => {
          const isAnswer = index === question.answer;
          const isSelected = index === selected;
          return (
            <button
              key={choice}
              className={`daily-choice${complete && isAnswer ? " is-correct" : ""}${isSelected && !correct ? " is-incorrect" : ""}`}
              aria-pressed={isSelected}
              disabled={complete}
              onClick={() => answer(index)}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              {choice}
            </button>
          );
        })}
      </div>
      {complete && (
        <div
          className={`daily-feedback${correct ? " correct" : " incorrect"}`}
          role="status"
          aria-live="polite"
        >
          <b>{correct ? "Resposta certa." : "Vamos revisar este ponto."}</b>
          <p>{question.explanation}</p>
          <button className="button button-primary" onClick={() => go("jlpt")}>
            Continuar a trilha {level} <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default function Shell({
  view,
  state,
  study,
  update,
  toast,
  navigate,
  shared,
  message,
  install,
  installPrompt,
}) {
  const cards = Object.values(state.cards);
  const due = cards.filter(
    (card) => card.seen && card.due <= Date.now(),
  ).length;
  const selectedLevel = state.selectedLevel || "N5";
  return (
    <>
      <div className="app-shell" onClick={navigate}>
        <a className="skip-link" href="#main-content">
          Pular para o conteúdo
        </a>
        <aside className="sidebar" aria-label="Navegação principal">
          <a
            className="brand"
            href="#inicio"
            data-view="home"
            aria-current={view === "home" ? "page" : undefined}
            aria-label="Kotonoha, início"
          >
            <img
              className="brand-logo"
              src={`${import.meta.env.BASE_URL}brand/logo.svg`}
              alt="Kotonoha"
              width="180"
              height="48"
            />
          </a>
          <div className="side-label">SEU ESTUDO</div>
          <nav className="side-nav">
            <button
              className={"nav-item" + (view === "home" ? " active" : "")}
              data-view="home"
              aria-current={view === "home" ? "page" : undefined}
            >
              <Icon name="home" className="nav-icon" />
              Visão geral
            </button>
            <button
              className={"nav-item" + (view === "learn" ? " active" : "")}
              data-view="learn"
              aria-current={view === "learn" ? "page" : undefined}
            >
              <Icon name="learn" className="nav-icon" />
              Aprender
            </button>
            <button
              className={"nav-item" + (view === "review" ? " active" : "")}
              data-view="review"
              aria-current={view === "review" ? "page" : undefined}
            >
              <Icon name="review" className="nav-icon" />
              Revisar
            </button>
            <button
              className={"nav-item" + (view === "paper" ? " active" : "")}
              data-view="paper"
              aria-current={view === "paper" ? "page" : undefined}
            >
              <Icon name="paper" className="nav-icon" />
              No papel
            </button>
            <button
              className={"nav-item" + (view === "jlpt" ? " active" : "")}
              data-view="jlpt"
              aria-current={view === "jlpt" ? "page" : undefined}
            >
              <Icon name="jlpt" className="nav-icon" />
              JLPT N5–N1
            </button>
          </nav>
          <div className="sidebar-bottom">
            <div className="offline-note">
              <span className="status-dot"></span>
              <span>
                <b>Seu estudo é seu</b>
                <small>Salvo neste dispositivo</small>
              </span>
            </div>
            <button
              className={
                "nav-item settings-link" +
                (view === "settings" ? " active" : "")
              }
              data-view="settings"
              aria-current={view === "settings" ? "page" : undefined}
            >
              <Icon name="settings" className="nav-icon" />
              Preferências
            </button>
          </div>
        </aside>

        <main className="main-area" id="main-content" tabIndex={-1}>
          <header className="topbar">
            <button
              className={"mobile-brand" + (view === "home" ? " active" : "")}
              data-view="home"
              aria-current={view === "home" ? "page" : undefined}
            >
              <img
                className="brand-logo"
                src={`${import.meta.env.BASE_URL}brand/logo.svg`}
                alt="Kotonoha, início"
                width="150"
                height="40"
              />
            </button>
            <div className="topbar-right">
              <button
                className="level-pill"
                data-view="jlpt"
                aria-label={`Selecionar nível. Atual: ${selectedLevel}`}
              >
                <span className="level-dot"></span>TRILHA {selectedLevel}{" "}
                <span aria-hidden="true">⌄</span>
              </button>
              <button
                className="icon-button"
                id="installBtn"
                onClick={install}
                title="Instalar app"
                aria-label="Instalar app"
                hidden={!installPrompt}
              >
                <Icon name="download" />
              </button>
              <button
                className={
                  "icon-button profile-button" +
                  (view === "settings" ? " active" : "")
                }
                data-view="settings"
                aria-current={view === "settings" ? "page" : undefined}
                title="Preferências"
                aria-label="Abrir preferências"
              >
                <Icon name="settings" />
              </button>
            </div>
          </header>

          <section
            className={view === "home" ? "view active" : "view"}
            id="view-home"
            aria-labelledby="homeTitle"
          >
            <div className="welcome-row">
              <div>
                <h1 id="homeTitle">Uma pergunta para começar.</h1>
                <p className="lead">
                  Leia, escolha e veja por que a resposta funciona.
                </p>
              </div>
              <div className="streak-chip">
                <Icon name="flame" />
                <strong id="streakCount">{state.streak.days}</strong>
                <small>dias de estudo</small>
              </div>
            </div>
            <div className="home-question-layout">
              <aside className="home-question-context">
                <div className="context-level">{selectedLevel}</div>
                <p>
                  {selectedLevel === "N5"
                    ? "Base inicial"
                    : CURRICULUM[selectedLevel][0].title}
                </p>
                <div className="context-rule"></div>
                <p className="small-note">
                  Seu progresso fica neste dispositivo e acompanha você offline.
                </p>
                <button className="text-button" data-view="jlpt">
                  Ver as lições {selectedLevel} →
                </button>
              </aside>
              <DailyQuestion state={state} update={update} go={shared.go} />
            </div>

            <div className="section-heading">
              <div>
                <h2>Plano de hoje</h2>
              </div>
              <button
                className={"text-button" + (view === "review" ? " active" : "")}
                data-view="review"
                aria-current={view === "review" ? "page" : undefined}
              >
                Ver revisão{" "}
                <span id="dueBadge" className="count-badge">
                  {due}
                </span>
              </button>
            </div>
            <div className="today-grid">
              <button
                className={"task-card" + (view === "review" ? " active" : "")}
                data-view="review"
                aria-current={view === "review" ? "page" : undefined}
              >
                <span className="task-icon green-icon">
                  <Icon name="review" />
                </span>
                <span className="task-copy">
                  <b>Revisão espaçada</b>
                  <small id="reviewTaskText">
                    {due
                      ? `${due} itens para revisar`
                      : "Seu próximo bloco de revisão está pronto"}
                  </small>
                </span>
                <Icon name="arrow" className="task-arrow" />
              </button>
              <button
                className={"task-card" + (view === "learn" ? " active" : "")}
                data-view="learn"
                aria-current={view === "learn" ? "page" : undefined}
              >
                <span className="task-icon yellow-icon">
                  <Icon name="learn" />
                </span>
                <span className="task-copy">
                  <b>Aprender algo novo</b>
                  <small>Kana, vocabulário e gramática da base N5</small>
                </span>
                <Icon name="arrow" className="task-arrow" />
              </button>
              <button
                className={"task-card" + (view === "paper" ? " active" : "")}
                data-view="paper"
                aria-current={view === "paper" ? "page" : undefined}
              >
                <span className="task-icon lilac-icon">
                  <Icon name="paper" />
                </span>
                <span className="task-copy">
                  <b>Prática no papel</b>
                  <small>Escreva para lembrar melhor</small>
                </span>
                <Icon name="arrow" className="task-arrow" />
              </button>
            </div>
            <div className="lower-grid">
              <div className="panel path-panel">
                <div className="section-heading compact">
                  <div>
                    <h2>Do começo ao avançado</h2>
                  </div>
                  <button
                    className={
                      "text-button" + (view === "jlpt" ? " active" : "")
                    }
                    data-view="jlpt"
                    aria-current={view === "jlpt" ? "page" : undefined}
                  >
                    Ver níveis →
                  </button>
                </div>
                <div id="levelRoadmap" className="roadmap">
                  {LEVELS.map(([level, label], i) => (
                    <div
                      key={level}
                      className={`roadmap-item ${level === selectedLevel ? "current" : ""}`}
                    >
                      <b>{level}</b>
                      <small>{label}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel principle-panel">
                <span className="principle-symbol">学</span>
                <h3>Recordar é aprender.</h3>
                <p>
                  Em vez de só reler, tente lembrar a resposta antes de
                  revelá-la. A revisão volta em intervalos maiores conforme você
                  aprende.
                </p>
                <button
                  className={
                    "text-button" + (view === "review" ? " active" : "")
                  }
                  data-view="review"
                  aria-current={view === "review" ? "page" : undefined}
                >
                  Começar revisão →
                </button>
              </div>
            </div>
            <footer className="footer-note">
              Feito para aprender com calma.{" "}
              <span>今日も一歩 — mais um passo hoje.</span>
            </footer>
          </section>

          <section
            className={view === "learn" ? "view active" : "view"}
            id="view-learn"
            aria-labelledby="learnTitle"
          >
            <div className="page-heading">
              <p className="eyebrow">CONTEÚDO DE BASE · N5</p>
              <h1 id="learnTitle">Aprender</h1>
              <p className="lead">
                Pratique kana, palavras e gramática inicial. Para estudar os
                níveis seguintes, abra a trilha N4–N1.
              </p>
            </div>
            {view === "learn" && (
              <Learn
                state={state}
                study={study}
                update={update}
                toast={toast}
              />
            )}
          </section>

          <section
            className={view === "review" ? "view active" : "view"}
            id="view-review"
            aria-labelledby="reviewTitle"
          >
            <div className="page-heading">
              <h1 id="reviewTitle">Hora de recordar</h1>
              <p className="lead">
                Pense na resposta antes de revelar. O esforço de lembrar ajuda a
                fixar.
              </p>
            </div>
            {view === "review" && <Review {...shared} />}
          </section>

          <section
            className={view === "paper" ? "view active" : "view"}
            id="view-paper"
            aria-labelledby="paperTitle"
          >
            <div className="page-heading">
              <p className="eyebrow">APRENDER TAMBÉM LONGE DA TELA</p>
              <h1 id="paperTitle">Caderno de prática</h1>
              <p className="lead">
                Exercícios de recuperação ativa para fazer com lápis e papel.
              </p>
            </div>
            {view === "paper" && <Paper {...shared} />}
          </section>

          <section
            className={view === "jlpt" ? "view active" : "view"}
            id="view-jlpt"
            aria-labelledby="jlptTitle"
          >
            <div className="page-heading">
              <h1 id="jlptTitle">Sua trilha até o JLPT</h1>
              <p className="lead">
                Cinco níveis, do primeiro contato até a compreensão avançada.
              </p>
            </div>
            {view === "jlpt" && <Jlpt {...shared} />}
          </section>

          <section
            className={view === "settings" ? "view active" : "view"}
            id="view-settings"
            aria-labelledby="settingsTitle"
          >
            <div className="page-heading">
              <p className="eyebrow">SEU ESPAÇO DE ESTUDO</p>
              <h1 id="settingsTitle">Preferências</h1>
              <p className="lead">
                Seu progresso fica salvo localmente neste navegador.
              </p>
            </div>
            {view === "settings" && <Settings {...shared} />}
          </section>
          <nav className="bottom-nav" aria-label="Navegação móvel">
            <button
              data-view="home"
              aria-current={view === "home" ? "page" : undefined}
            >
              <Icon name="home" />
              Início
            </button>
            <button
              data-view="learn"
              aria-current={view === "learn" ? "page" : undefined}
            >
              <Icon name="learn" />
              Aprender
            </button>
            <button
              data-view="review"
              aria-current={view === "review" ? "page" : undefined}
            >
              <Icon name="review" />
              Revisar
            </button>
            <button
              data-view="paper"
              aria-current={view === "paper" ? "page" : undefined}
            >
              <Icon name="paper" />
              No papel
            </button>
            <button
              data-view="jlpt"
              aria-current={view === "jlpt" ? "page" : undefined}
            >
              <Icon name="jlpt" />
              JLPT
            </button>
          </nav>
        </main>
      </div>
      <div
        id="toast"
        className={`toast ${message ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
    </>
  );
}
