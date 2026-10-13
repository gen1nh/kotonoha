import React, { useState, useEffect, useRef } from "react";
import { HIRAGANA, KATAKANA, VOCAB, GRAMMAR, JLPT_PATHS } from "../data.js";
import { CURRICULUM, VOCAB_BY_LEVEL } from "../curriculum.js";
import {
  LEVELS,
  todayKey,
  markStudy,
  rateCard,
  initialState,
  normalizeState,
} from "../state.js";

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "ja-JP";
  voice.rate = 0.82;
  window.speechSynthesis.speak(voice);
}

export function Learn({ state, study, update, toast }) {
  const [tab, setTab] = useState("hiragana");
  const [quiz, setQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [character, setCharacter] = useState("あ");
  const array = tab === "hiragana" ? HIRAGANA : KATAKANA;
  const type = tab === "hiragana" ? "Hiragana" : "Katakana";
  const selectedLevel = state.selectedLevel || "N5";
  const vocabulary =
    selectedLevel === "N5" ? VOCAB : VOCAB_BY_LEVEL[selectedLevel] || VOCAB;
  const vocabularyType = `Vocabulário ${selectedLevel}`;
  function changeTab(next) {
    setTab(next);
    setQuiz(false);
    setAnswers({});
    setCharacter(next === "katakana" ? "ア" : "あ");
  }
  return (
    <>
      <div
        className="learn-tabs"
        role="tablist"
        aria-label="Conteúdos da trilha"
      >
        {[
          ["hiragana", "Hiragana", "46"],
          ["katakana", "Katakana", "46"],
          [
            "vocabulary",
            `Palavras ${selectedLevel}`,
            String(vocabulary.length),
          ],
          ["grammar", "Gramática", ""],
        ].map(([id, label, count]) => (
          <button
            key={id}
            className={`learn-tab ${tab === id ? "active" : ""}`}
            role="tab"
            id={`tab-${id}`}
            aria-controls="learn-panel"
            tabIndex={tab === id ? 0 : -1}
            aria-selected={tab === id}
            onClick={() => changeTab(id)}
            onKeyDown={(e) => {
              const tabs = Array.from(
                e.currentTarget.parentElement.querySelectorAll('[role="tab"]'),
              );
              const current = tabs.indexOf(e.currentTarget);
              const next =
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? tabs.length - 1
                    : e.key === "ArrowRight"
                      ? (current + 1) % tabs.length
                      : e.key === "ArrowLeft"
                        ? (current + tabs.length - 1) % tabs.length
                        : null;
              if (next === null) return;
              e.preventDefault();
              tabs[next].click();
              tabs[next].focus();
            }}
          >
            {label} {count && <span>{count}</span>}
          </button>
        ))}
      </div>
      <div
        className="learn-content"
        id="learn-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
      >
        {["hiragana", "katakana"].includes(tab) ? (
          <>
            <div className="learn-overview">
              <div>
                <h2>{type} básico</h2>
                <p>
                  Toque em um caractere para ouvir o som. Comece com um pequeno
                  grupo por dia.
                </p>
              </div>
              <button
                className="button button-primary"
                onClick={() => study(type)}
              >
                Estudar 5 novos
              </button>
            </div>
            <div className="kana-grid">
              {array.map(([ch, ro]) => (
                <button
                  key={ch}
                  className="kana-cell"
                  aria-pressed={character === ch}
                  aria-label={`${ch}, ${ro}. Ouvir e praticar escrita`}
                  onClick={() => {
                    setCharacter(ch);
                    speak(ch);
                  }}
                >
                  <span className="jp">{ch}</span>
                  <small>{ro}</small>
                  {Object.values(state.cards).find((c) => c.prompt === ch)
                    ?.reps >= 3 && <span className="mastered">✓</span>}
                </button>
              ))}
            </div>
            <div className="section-heading">
              <div>
                <p className="eyebrow">PRÁTICA DE ESCRITA</p>
                <h2>Desenhe um caractere</h2>
              </div>
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
          </>
        ) : tab === "vocabulary" ? (
          <>
            <div className="learn-overview">
              <div>
                <h2>Vocabulário {selectedLevel}</h2>
                <p>
                  Leia a palavra, tente lembrar o significado e escute a
                  pronúncia.
                </p>
              </div>
              <button
                className="button button-primary"
                onClick={() => study(vocabularyType)}
              >
                Estudar 4 novas
              </button>
            </div>
            <div className="vocab-list">
              {vocabulary.map(([kanji, kana, romaji, meaning]) => (
                <div key={kanji} className="vocab-row">
                  <span className="vocab-kanji">{kanji}</span>
                  <span className="vocab-text">
                    <b>
                      {kana} <small>({romaji})</small>
                    </b>
                    <small>{meaning}</small>
                  </span>
                  <button
                    className="sound-btn"
                    onClick={() => speak(kana)}
                    aria-label={`Ouvir ${kana}`}
                  >
                    ♪
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="learn-overview">
              <div>
                <h2>Primeiras estruturas</h2>
                <p>
                  Entenda como as partes da frase se conectam. Os exemplos usam
                  vocabulário da trilha.
                </p>
              </div>
              <button
                className="button button-primary"
                onClick={() => setQuiz(true)}
              >
                Praticar
              </button>
            </div>
            <div className="grammar-list">
              {GRAMMAR.map((g) => (
                <article className="grammar-card" key={g.title}>
                  <h3>{g.title}</h3>
                  <p>{g.text}</p>
                  <div className="grammar-example">{g.example}</div>
                  <p>{g.meaning}</p>
                </article>
              ))}
            </div>
            {quiz && (
              <div className="panel" style={{ marginTop: 12 }}>
                <p className="eyebrow">RECORDAR ANTES DE RELER</p>
                <h3>Qual partícula marca o tópico da frase?</h3>
                <div className="mini-quiz">
                  {[2, 0, 3, 1].map((i) => (
                    <button
                      key={i}
                      className={`quiz-choice ${answers[i] || ""}`}
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
                          toast("Boa! Você recuperou a resposta.");
                        } else
                          toast(
                            "Tente lembrar: a partícula fica depois do tópico.",
                          );
                      }}
                    >
                      {GRAMMAR[i].title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Drawing({ character, random, save }) {
  const canvas = useRef(null),
    last = useRef(null);
  const clear = () => {
    const c = canvas.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
  };
  useEffect(() => {
    const c = canvas.current;
    const resize = () => {
      const rect = c.getBoundingClientRect(),
        dpr = window.devicePixelRatio || 1;
      c.width = Math.round(rect.width * dpr);
      c.height = Math.round(rect.height * dpr);
      const ctx = c.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.lineWidth = Math.max(3, rect.width * 0.012);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#1d1e1c";
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(c);
    return () => observer.disconnect();
  }, []);
  useEffect(clear, [character]);
  const point = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  return (
    <div className="draw-layout">
      <div className="draw-panel">
        <div className="draw-panel-head">
          <b>Seu traço</b>
          <div className="draw-actions">
            <button className="button button-outline" onClick={clear}>
              Limpar
            </button>
            <button className="button button-primary" onClick={save}>
              Pratiquei
            </button>
          </div>
        </div>
        <div className="draw-canvas-wrap">
          <span className="draw-model">{character}</span>
          <canvas
            ref={canvas}
            className="draw-canvas"
            aria-label="Área de treino de escrita"
            onPointerDown={(e) => {
              last.current = point(e);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!last.current) return;
              const ctx = canvas.current.getContext("2d"),
                p = point(e);
              ctx.beginPath();
              ctx.moveTo(last.current.x, last.current.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
              last.current = p;
            }}
            onPointerUp={() => {
              last.current = null;
            }}
            onPointerCancel={() => {
              last.current = null;
            }}
            onLostPointerCapture={() => {
              last.current = null;
            }}
          />
        </div>
      </div>
      <div className="draw-guide">
        <h3>Observe e tente</h3>
        <p>
          Use o modelo claro como referência: trace o caractere e depois tente
          escrevê-lo de memória. O app não avalia o desenho nem ensina a ordem
          dos traços nesta versão.
        </p>
        <div className="draw-character">{character}</div>
        <button
          className="button button-outline"
          onClick={() => {
            clear();
            random();
          }}
        >
          Sortear outro
        </button>
      </div>
    </div>
  );
}

export function Review({ state, queue, update, go, speak }) {
  const [index, setIndex] = useState(0),
    [revealed, setRevealed] = useState(false);
  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [queue]);
  const card = state.cards[queue[index]];
  if (!card)
    return (
      <div className="review-layout">
        <div className="empty-state">
          <div className="empty-symbol">✓</div>
          <h2>Bom trabalho por hoje</h2>
          <p>
            Um estudo curto e frequente funciona melhor do que tentar fazer tudo
            de uma vez.
          </p>
          <button className="button button-primary" onClick={() => go("learn")}>
            Aprender algo novo
          </button>
        </div>
      </div>
    );
  return (
    <div className="review-layout">
      <div className="review-summary">
        <small>
          Cartão {index + 1} de {queue.length}
        </small>
        <small>{card.type}</small>
      </div>
      <div className="review-card">
        <span className="review-category">{card.type.toUpperCase()}</span>
        <div className="review-prompt">{card.prompt}</div>
        <p className="review-question">
          {card.type.startsWith("Vocabulário")
            ? "Qual a leitura e o significado?"
            : "Que som este caractere representa?"}
        </p>
        <div className={`review-answer ${revealed ? "show" : ""}`}>
          {revealed ? card.answer : ""}
        </div>
      </div>
      <div className="review-tools">
        <button
          className="button button-outline"
          onClick={() => speak(card.spoken || card.prompt)}
        >
          ♪ Ouvir japonês
        </button>
        {!revealed && (
          <button
            className="button button-primary"
            onClick={() => setRevealed(true)}
          >
            Revelar resposta
          </button>
        )}
      </div>
      {revealed && (
        <div className="rate-buttons show">
          {[
            ["again", "Errei", "Rever em breve"],
            ["hard", "Difícil", "Intervalo curto"],
            ["good", "Bom", "Intervalo normal"],
            ["easy", "Fácil", "Intervalo longo"],
          ].map(([rating, label, hint]) => (
            <button
              key={rating}
              className={`rate-btn rate-${rating}`}
              onClick={() => {
                update((s) => rateCard(s, card.id, rating));
                setIndex((i) => i + 1);
                setRevealed(false);
              }}
            >
              <b>{label}</b>
              <small>{hint}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Paper({ state, update, toast, go }) {
  const [busy, setBusy] = useState(false),
    [output, setOutput] = useState("");
  async function generate() {
    const key = sessionStorage.getItem("kotonoha.groqKey"),
      model = sessionStorage.getItem("kotonoha.groqModel");
    if (!key || !model) {
      toast("Configure sua chave e escolha um modelo nas Preferências.");
      go("settings");
      return;
    }
    setBusy(true);
    setOutput("A IA está preparando uma atividade. Aguarde um instante.");
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "Você é um tutor de japonês criterioso. Responda em português brasileiro e confira a exatidão do japonês.",
              },
              {
                role: "user",
                content: `Crie um exercício de japonês para uma pessoa brasileira estudando o JLPT ${state.selectedLevel || "N5"}. Gere uma tarefa de escrita em papel de 5 minutos, 3 itens para responder sem consulta e um gabarito separado no fim. Use japonês correto adequado ao nível e traduções naturais.`,
              },
            ],
            temperature: 0.4,
            max_completion_tokens: 700,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error?.message || `Erro da API (${response.status}).`,
        );
      setOutput(
        data.choices?.[0]?.message?.content || "Não veio conteúdo na resposta.",
      );
    } catch (error) {
      setOutput(
        `Não consegui gerar agora: ${error.message}\n\nVocê ainda pode usar o exercício pronto sem conexão.`,
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="paper-grid">
      <article className="paper-card">
        <p className="eyebrow">EXERCÍCIO DE HOJE · 10 MIN</p>
        <h2>Feche a tela e puxe da memória.</h2>
        <p>
          Recuperar a informação sem olhar treina a lembrança. Só confira a
          resposta depois de tentar.
        </p>
        <div className="paper-prompt">
          <span className="paper-tag">LEITURA + ESCRITA</span>
          <h3>Monte seu mini ditado</h3>
          <ol>
            <li>Em uma folha, escreva sem consultar: あ・き・し・つ・ね.</li>
            <li>Ao lado, escreva o som de cada caractere em romaji.</li>
            <li>Crie três palavras com os sons e leia em voz alta.</li>
            <li>Confira na aba Hiragana e marque os que quer rever.</li>
          </ol>
        </div>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={!!state.paper[todayKey()]}
            onChange={(e) => {
              const checked = e.target.checked;
              update((s) => {
                if (checked) {
                  s.paper[todayKey()] = true;
                  markStudy(s);
                } else delete s.paper[todayKey()];
              });
              if (checked) toast("Prática de hoje marcada.");
            }}
          />{" "}
          Marcar a prática de hoje como concluída
        </label>
        <div className="paper-links">
          <a
            className="paper-link"
            href="#aprender"
            onClick={(e) => {
              e.preventDefault();
              go("learn");
            }}
          >
            Abrir tabela de hiragana →
          </a>
          <a
            className="paper-link"
            href="#revisar"
            onClick={(e) => {
              e.preventDefault();
              go("review");
            }}
          >
            Revisar cartões →
          </a>
        </div>
      </article>
      <aside className="ai-card">
        <p className="eyebrow">OPCIONAL · COM IA</p>
        <h2>Peça um exercício sob medida</h2>
        <p>
          Os exercícios prontos funcionam offline. Se quiser mais variedade,
          conecte uma chave nas Preferências.
        </p>
        <button
          className="button button-primary"
          onClick={generate}
          disabled={busy}
        >
          {busy ? "Criando exercício…" : "Gerar exercício com Groq"}
        </button>
        <div className={`ai-output ${output ? "show" : ""}`} aria-live="polite">
          {output}
        </div>
        <button className="text-button" onClick={() => go("settings")}>
          Configurar API →
        </button>
      </aside>
    </div>
  );
}

export function Jlpt({ state, update, toast, go, speak }) {
  const [scoreError, setScoreError] = useState("");
  const scoreInput = useRef(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const selected = state.selectedLevel || "N5",
    details = JLPT_PATHS[selected],
    levelLessons = CURRICULUM[selected] || [];
  const [score, setScore] = useState(""),
    [level, setLevel] = useState(selected);
  const activeLesson = levelLessons.find((item) => item.id === activeLessonId);
  useEffect(() => {
    setLevel(selected);
    setActiveLessonId(null);
  }, [selected]);
  function save() {
    const n = Number(score);
    if (!score.trim() || !Number.isFinite(n) || n < 0 || n > 100) {
      setScoreError("Informe um percentual entre 0 e 100.");
      scoreInput.current?.focus();
      return;
    }
    update((s) => {
      s.mocks.unshift({ level, score: n, date: todayKey() });
    });
    setScore("");
    setScoreError("");
    toast("Simulado registrado.");
  }
  return (
    <>
      <div className="jlpt-intro">
        <div className="jlpt-intro-symbol">道</div>
        <div>
          <h2>Do N5 ao N1, com base antes da prova</h2>
          <p>
            O app organiza seu percurso e oferece fundamentos de língua. A
            preparação para o teste precisa cobrir conhecimento linguístico,
            leitura e compreensão auditiva.
          </p>
        </div>
      </div>
      <div className="jlpt-grid">
        {LEVELS.map(([id, label]) => (
          <button
            key={id}
            className={`jlpt-card ${selected === id ? "current" : ""}`}
            onClick={() => {
              update((s) => {
                s.selectedLevel = id;
              });
              setLevel(id);
            }}
          >
            <span className="jlpt-level">{id}</span>
            <b className="jlpt-label">{label}</b>
            <p>
              {id === "N5"
                ? "Kana, palavras e gramática"
                : `${CURRICULUM[id].length} lições interativas`}
            </p>
            <span className="text-button">
              {selected === id ? "Selecionado" : "Ver trilha"} →
            </span>
          </button>
        ))}
      </div>
      <article className="exam-sources level-detail">
        <h2>{details.goal}</h2>
        <div className="focus-grid">
          {details.focus.map((item) => (
            <div key={item} className="focus-item">
              <p>{item}</p>
            </div>
          ))}
        </div>
        <p className="small-note">
          {selected === "N5"
            ? "A base inicial está interativa: kana, vocabulário, gramática e revisão."
            : "Estas lições autorais organizam estudo e prática por nível. O JLPT não publica listas oficiais completas de gramática, vocabulário ou kanji; esta trilha é uma referência didática, não um programa oficial."}
        </p>
      </article>
      <section className="jlpt-lessons" aria-labelledby="lesson-list-title">
        {activeLesson ? (
          <InteractiveLesson
            key={activeLesson.id}
            lesson={activeLesson}
            complete={state.lessons?.[activeLesson.id] === true}
            update={update}
            speak={speak}
            onBack={() => setActiveLessonId(null)}
          />
        ) : selected === "N5" ? (
          <div className="lesson-list-empty">
            <div>
              <h2 id="lesson-list-title">Kana, vocabulário e gramática</h2>
              <p>
                Continue usando as tabelas, cartões e quiz que já fazem parte da
                trilha N5.
              </p>
            </div>
            <button
              className="button button-primary"
              onClick={() => go("learn")}
            >
              Abrir conteúdos N5 →
            </button>
          </div>
        ) : (
          <>
            <div className="lesson-list-heading">
              <div>
                <h2 id="lesson-list-title">Estude uma estrutura por vez</h2>
              </div>
              <span>
                {
                  Object.keys(state.lessons || {}).filter((id) =>
                    levelLessons.some((item) => item.id === id),
                  ).length
                }{" "}
                / {levelLessons.length} concluídas
              </span>
            </div>
            <div className="lesson-list">
              {levelLessons.map((item, index) => {
                const done = state.lessons?.[item.id] === true;
                return (
                  <article className="lesson-list-item" key={item.id}>
                    <span className="lesson-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="lesson-list-copy">
                      <h3>{item.title}</h3>
                      <p>
                        {item.questions.length} questões com explicação após
                        cada resposta
                      </p>
                    </div>
                    <span className={`lesson-status${done ? " done" : ""}`}>
                      {done ? "Concluída" : "Ainda não feita"}
                    </span>
                    <button
                      className="button button-outline"
                      onClick={() => setActiveLessonId(item.id)}
                    >
                      {done ? "Refazer" : "Começar"}
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
      <div className="exam-note">
        <b>Sobre provas anteriores:</b> o JLPT não libera o teste integral de
        cada edição. Os cadernos oficiais de prática reúnem questões
        selecionadas de provas anteriores; o app direciona aos materiais
        oficiais em vez de copiar conteúdo protegido.
      </div>
      <div className="exam-sources">
        <h2>Materiais oficiais de prática</h2>
        <p>
          Os cadernos oficiais de prática cobrem N5 a N1 e incluem questões e
          áudio. Abra os PDFs e os áudios no site do organizador do JLPT.
        </p>
        <div className="source-links">
          {[
            [
              "samples/sampleindex.html",
              "Cadernos oficiais de prática (2012 e 2018)",
            ],
            ["samples/forlearners.html", "Questões de exemplo por nível"],
            ["faq/", "FAQ oficial e direitos autorais"],
          ].map(([url, label]) => (
            <a
              key={url}
              className="external-link"
              href={`https://www.jlpt.jp/e/${url}`}
              target="_blank"
              rel="noreferrer"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </div>
      <div className="exam-sources">
        <h2>Seu diário de simulados</h2>
        <p>
          Registre o percentual de acertos que você observou ao fazer um caderno
          oficial.
        </p>
        <div className="inline-controls">
          <div className="field-group">
            <label className="field-label" htmlFor="mock-level">
              Nível do simulado
            </label>
            <select
              id="mock-level"
              className="text-input"
              aria-label="Nível do simulado"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {LEVELS.map(([id]) => (
                <option key={id}>{id}</option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="mock-score">
              Acertos (%)
            </label>
            <input
              id="mock-score"
              ref={scoreInput}
              aria-invalid={!!scoreError}
              aria-describedby={scoreError ? "score-error" : undefined}
              className="text-input"
              aria-label="Acertos (%)"
              type="number"
              min="0"
              max="100"
              placeholder="Acertos (%)"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>
          <button className="button button-primary" onClick={save}>
            Registrar
          </button>
        </div>
        {scoreError && (
          <p id="score-error" className="form-error" role="alert">
            {scoreError}
          </p>
        )}
        <p className="small-note">
          O JLPT usa pontuação escalonada e notas mínimas por seção; seu
          percentual bruto é apenas uma referência pessoal, não uma estimativa
          oficial da nota.
        </p>
        {state.mocks.length ? (
          state.mocks.slice(0, 5).map((m, i) => (
            <div key={i} className="vocab-row" style={{ marginTop: 6 }}>
              <b>{m.level}</b>
              <span className="vocab-text">
                <small>{m.date}</small>
              </span>
              <b>{m.score}%</b>
            </div>
          ))
        ) : (
          <p className="small-note">Seus resultados aparecerão aqui.</p>
        )}
      </div>
    </>
  );
}

function InteractiveLesson({ lesson, complete, update, speak, onBack }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [finished, setFinished] = useState(false);
  const questionHeading = useRef(null);
  const question = lesson.questions[index];
  useEffect(() => {
    questionHeading.current?.focus({ preventScroll: true });
  }, [index, finished]);

  if (finished) {
    return (
      <section
        className="interactive-lesson lesson-finished"
        aria-labelledby="lesson-finished-title"
      >
        <button className="text-button" onClick={onBack}>
          ← Voltar para {lesson.level}
        </button>
        <h2 id="lesson-finished-title" tabIndex={-1}>
          {lesson.title}
        </h2>
        <div className="lesson-complete-note" role="status">
          <b>{complete ? "Revisão concluída." : "Bom trabalho."}</b>
          <p>
            O progresso foi salvo neste dispositivo. Você pode refazer esta
            lição quando quiser.
          </p>
        </div>
        <button className="button button-primary" onClick={onBack}>
          Voltar às lições →
        </button>
      </section>
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
    <section
      className="interactive-lesson"
      aria-labelledby="active-lesson-title"
    >
      <button className="text-button lesson-back" onClick={onBack}>
        ← Voltar às lições {lesson.level}
      </button>
      <div className="lesson-topline">
        <div>
          <h2 id="active-lesson-title">{lesson.title}</h2>
        </div>
        <span className="lesson-question-count">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(lesson.questions.length).padStart(2, "0")}
        </span>
      </div>
      <p className="lesson-explanation">{lesson.explanation}</p>
      <div className="lesson-example">
        <p lang="ja">{lesson.example}</p>
        <span>{lesson.translation}</span>
      </div>
      <div className="lesson-question">
        <div
          className="lesson-progress-track"
          role="progressbar"
          aria-label={`Questão ${index + 1} de ${lesson.questions.length}`}
          aria-valuemin={1}
          aria-valuemax={lesson.questions.length}
          aria-valuenow={index + 1}
        >
          <span
            style={{
              width: `${((index + 1) / lesson.questions.length) * 100}%`,
            }}
          />
        </div>
        <h3 ref={questionHeading} tabIndex={-1}>
          {question.prompt}
        </h3>
        <p className="lesson-prompt" lang="ja">
          {question.sentence}
        </p>
        {question.sentence && (
          <button
            className="text-button lesson-speak"
            onClick={() => speak(question.sentence)}
          >
            Ouvir frase　♪
          </button>
        )}
        <div
          className="lesson-choices"
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
                className={`lesson-choice${correctChoice ? " is-correct" : ""}${selected && !isCorrect ? " is-incorrect" : ""}`}
                aria-pressed={selected}
                disabled={answer !== null}
                onClick={() => setAnswer(optionIndex)}
              >
                <span>{String.fromCharCode(65 + optionIndex)}</span>
                {choice}
              </button>
            );
          })}
        </div>
        {answer !== null && (
          <div
            className={`lesson-answer-feedback${isCorrect ? " correct" : " incorrect"}`}
            role="status"
            aria-live="polite"
          >
            <b>
              {isCorrect
                ? "Isso mesmo."
                : `A resposta é ${String.fromCharCode(65 + question.answer)}.`}
            </b>
            <p>{question.explanation}</p>
          </div>
        )}
        <div className="lesson-actions">
          <button
            className="button button-primary"
            onClick={next}
            disabled={answer === null}
          >
            {index === lesson.questions.length - 1
              ? "Concluir lição"
              : "Próxima questão"}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export function Settings({ state, setState, toast }) {
  const importInput = useRef(null);
  const [key, setKey] = useState(
    () => sessionStorage.getItem("kotonoha.groqKey") || "",
  );
  const [model, setModel] = useState(
    () => sessionStorage.getItem("kotonoha.groqModel") || "",
  );
  const [models, setModels] = useState(() => (model ? [model] : [])),
    [busy, setBusy] = useState(false);
  async function loadModels() {
    if (!key.trim()) {
      toast("Cole sua chave Groq primeiro.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${key.trim()}` },
      });
      if (!response.ok)
        throw new Error(
          response.status === 401
            ? "Chave não reconhecida. Confira a chave no painel da Groq."
            : `A API respondeu com erro ${response.status}.`,
        );
      const data = await response.json(),
        list = (data.data || []).map((m) => m.id).sort();
      setModels(list);
      setModel(list[0] || "");
      sessionStorage.setItem("kotonoha.groqKey", key.trim());
      sessionStorage.setItem("kotonoha.groqModel", list[0] || "");
      toast(`${list.length} modelos disponíveis.`);
    } catch (error) {
      toast(error.message || "Não foi possível consultar a API.");
    } finally {
      setBusy(false);
    }
  }
  function exportBackup() {
    const url = URL.createObjectURL(
        new Blob([JSON.stringify(state, null, 2)], {
          type: "application/json",
        }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = `kotonoha-backup-${todayKey()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Backup exportado.");
  }
  async function importBackup(e) {
    const input = e.target,
      file = input.files[0];
    if (!file) return;
    try {
      const imported = normalizeState(JSON.parse(await file.text()));
      if (
        window.confirm("Importar este backup e substituir o progresso atual?")
      ) {
        setState(imported);
        toast("Progresso importado.");
      }
    } catch (error) {
      toast(error.message || "Não foi possível ler o arquivo.");
    } finally {
      input.value = "";
    }
  }
  return (
    <div className="settings-grid">
      <div className="panel setting-panel">
        <p className="eyebrow">BACKUP DOS SEUS DADOS</p>
        <h2>Leve seu progresso com você</h2>
        <p>
          Exporte um arquivo de backup para guardar ou importar em outro
          dispositivo.
        </p>
        <div className="setting-actions">
          <button className="button button-primary" onClick={exportBackup}>
            Exportar backup
          </button>
          <button
            className="button button-outline file-button"
            onClick={() => importInput.current?.click()}
          >
            Importar backup
          </button>
          <input
            ref={importInput}
            type="file"
            accept="application/json"
            hidden
            onChange={importBackup}
          />
        </div>
        <p className="small-note">
          O app funciona offline depois de instalado. O backup ajuda a
          transferir seus dados entre dispositivos.
        </p>
      </div>
      <div className="panel setting-panel">
        <p className="eyebrow">ASSISTENTE OPCIONAL</p>
        <h2>Gerar exercícios com IA</h2>
        <p>
          Conecte sua própria chave de API para pedir exercícios novos. A trilha
          e as revisões continuam funcionando sem IA.
        </p>
        <label className="field-label" htmlFor="apiKey">
          Chave Groq
        </label>
        <input
          id="apiKey"
          className="text-input"
          type="password"
          placeholder="gsk_…"
          autoComplete="off"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <label className="field-label" htmlFor="modelSelect">
          Modelo disponível
        </label>
        <div className="inline-controls">
          <select
            id="modelSelect"
            className="text-input"
            disabled={!models.length}
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              sessionStorage.setItem("kotonoha.groqModel", e.target.value);
            }}
          >
            {!models.length && (
              <option value="">Conecte sua chave para buscar modelos</option>
            )}
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button
            className="button button-outline"
            disabled={busy}
            onClick={loadModels}
          >
            {busy ? "Buscando…" : "Buscar"}
          </button>
        </div>
        <p className="small-note">
          A chave fica somente na sessão atual do navegador e é enviada direto à
          Groq. Não a use em um site público. Modelos, cotas e condições
          gratuitas podem mudar.
        </p>
        <a
          className="external-link"
          href="https://console.groq.com/docs/openai"
          target="_blank"
          rel="noreferrer"
        >
          Como funciona a API compatível com OpenAI →
        </a>
      </div>
      <div className="panel setting-panel">
        <p className="eyebrow">SEU PROGRESSO</p>
        <h2>Recomeçar</h2>
        <p>
          Apaga o progresso local deste navegador e restaura as cartas iniciais.
        </p>
        <button
          className="button button-danger-outline"
          onClick={() => {
            if (
              window.confirm(
                "Apagar todo o progresso salvo neste navegador? Essa ação não pode ser desfeita.",
              )
            ) {
              setState(initialState());
              toast("Progresso reiniciado.");
            }
          }}
        >
          Apagar progresso
        </button>
      </div>
    </div>
  );
}
