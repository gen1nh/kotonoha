import { useDialogFocus } from "../useDialogFocus.js";
import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Icon from "./Icon.jsx";
import { markStudy, cardMatchesLevel, rateCard } from "../state.js";
import {
  getLiveSeconds,
  subscribeLive,
  formatClock,
  formatDuration,
} from "../timer.js";

// Amostra de micro-lições guiadas N5 estruturadas para a rotina diária
export const DAILY_FOCUS_LESSONS = [
  {
    id: "session-l1",
    objective: "Pedir comida e bebida com ください",
    context: "Em um restaurante ou cafeteria no Japão",
    phraseJa: "水をお願いします。それから、ラーメンを一つください。",
    phraseRo: "Mizu o onegaishimasu. Sorekara, raamen o hitotsu kudasai.",
    phrasePt: "Água, por favor. E além disso, um lámen, por favor.",
    explanation:
      "No Japão, para pedir qualquer item basta dizer o nome do item seguido de **をください** (o kudasai) ou **をお願いします** (o onegaishimasu). Para quantidades unitárias gerais, usamos **一つ** (hitotsu = um) ou **二つ** (futatsu = dois).",
    grammarTip: "Item + を + ください = 'Me dê X, por favor'.",
    vocab: [
      { ja: "水", ro: "mizu", pt: "água" },
      { ja: "ラーメン", ro: "raamen", pt: "lámen" },
      { ja: "一つ", ro: "hitotsu", pt: "uma unidade" },
      { ja: "ください", ro: "kudasai", pt: "por favor / me dê" },
    ],
    challenge: {
      question: "Como você pede 'um café, por favor' em japonês?",
      options: [
        {
          text: "コーヒーを一つください",
          correct: true,
          explain:
            "Perfeito! コーヒー (café) + を (objeto) + 一つ (um) + ください (por favor).",
        },
        {
          text: "コーヒーは一つです",
          correct: false,
          explain:
            "Isso significa 'O café é um', uma afirmação e não um pedido no balcão.",
        },
        {
          text: "コーヒーに行きます",
          correct: false,
          explain: "Significa 'Eu vou ao café' (verbo ir 行きます).",
        },
        {
          text: "コーヒーがあります",
          correct: false,
          explain:
            "Significa 'Tem café' / 'Existe café', apenas constatando a presença.",
        },
      ],
    },
  },
  {
    id: "session-l2",
    objective: "Indicar localização e destino com に e で",
    context: "Dizendo onde você estuda e para onde você vai",
    phraseJa: "図書館で日本語を勉強します。それから、家に行きます。",
    phraseRo: "Toshokan de nihongo o benkyou shimasu. Sorekara, ie ni ikimasu.",
    phrasePt: "Estudo japonês na biblioteca. Depois disso, vou para casa.",
    explanation:
      "A partícula **で (de)** indica o local onde uma ação ativa acontece (estudar na biblioteca = 図書館で). Já a partícula **に (ni)** indica o ponto de chegada ou destino de um movimento (ir para casa = 家に).",
    grammarTip:
      "Lugar + で + Ação = Onde ocorre. Lugar + に + Movimento = Para onde vai.",
    vocab: [
      { ja: "図書館", ro: "toshokan", pt: "biblioteca" },
      { ja: "勉強します", ro: "benkyou shimasu", pt: "estudo / estudar" },
      { ja: "家", ro: "ie", pt: "casa / lar" },
      { ja: "行きます", ro: "ikimasu", pt: "vou / ir" },
    ],
    challenge: {
      question:
        "Complete: 'Eu como lámen no restaurante' -> レストラン [ ? ] ラーメンを食べます。",
      options: [
        {
          text: "で (de)",
          correct: true,
          explain:
            "Exato! 'Comer' é uma ação, logo o local onde a ação ocorre leva で.",
        },
        {
          text: "に (ni)",
          correct: false,
          explain:
            "A partícula に indica destino de movimento ou existência estática, não ação ativa.",
        },
        {
          text: "を (o)",
          correct: false,
          explain:
            "A partícula を marca o objeto direto (o lámen), não o restaurante.",
        },
        {
          text: "は (wa)",
          correct: false,
          explain:
            "A partícula は define o tópico geral ('quanto ao restaurante...'), não o local da ação.",
        },
      ],
    },
  },
  {
    id: "session-l3",
    objective: "Perguntar e dizer as horas com 時 (ji) e 分 (fun)",
    context: "Combinando encontros e horários",
    phraseJa: "今、何時ですか？ — ちょうど午後三時十五分です。",
    phraseRo: "Ima, nan-ji desu ka? — Choudo gogo san-ji juu-go-fun desu.",
    phrasePt: "Que horas são agora? — São exatamente três e quinze da tarde.",
    explanation:
      "Para dizer as horas, pegamos o número e adicionamos **時 (ji)** para a hora e **分 (fun/pun)** para os minutos. **午前 (gozen)** é manhã (AM) e **午後 (gogo)** é tarde/noite (PM).",
    grammarTip:
      "Hora + 時 (ji) / Minuto + 分 (fun). 何時 (nan-ji) = Que horas?",
    vocab: [
      { ja: "今", ro: "ima", pt: "agora" },
      { ja: "何時", ro: "nan-ji", pt: "que horas" },
      { ja: "午後", ro: "gogo", pt: "tarde / PM" },
      { ja: "ちょうど", ro: "choudo", pt: "exatamente" },
    ],
    challenge: {
      question: "Como se pergunta 'Que horas são agora?' em japonês?",
      options: [
        {
          text: "今、何時ですか？ (Ima, nan-ji desu ka?)",
          correct: true,
          explain: "Correto! 今 (agora) + 何時 (que horas) + ですか (é?).",
        },
        {
          text: "今、どこですか？ (Ima, doko desu ka?)",
          correct: false,
          explain: "Doko significa 'onde', então seria 'Onde é agora?'.",
        },
        {
          text: "いくらですか？ (Ikura desu ka?)",
          correct: false,
          explain: "Ikura significa 'quanto custa?'.",
        },
        {
          text: "何ですか？ (Nan desu ka?)",
          correct: false,
          explain: "Nan desu ka significa 'O que é?'.",
        },
      ],
    },
  },
];

export default function StudySession({
  state,
  update,
  onClose,
  speak,
  toast,
  onNavigateToNotebook,
  initialDuration = 15,
}) {
  useDialogFocus(onClose);
  // A duração escolhida é apenas uma META. O tempo real vem do cronômetro.
  const saved = state.studySession;
  const [duration] = useState(saved?.duration || initialDuration);
  const liveSeconds = useSyncExternalStore(subscribeLive, getLiveSeconds);
  const startedAt = useRef(liveSeconds);
  const elapsed = Math.max(0, liveSeconds - startedAt.current);
  const [finalElapsed, setFinalElapsed] = useState(0);
  const [step, setStep] = useState(saved?.step || 1); // 1: Warmup SRS, 2: Guided Lesson, 3: Practical Challenge, 4: Celebration
  const [selectedLessonIndex] = useState(() =>
    saved?.lessonIndex ?? Math.floor(Math.random() * DAILY_FOCUS_LESSONS.length),
  );
  const currentLesson = DAILY_FOCUS_LESSONS[selectedLessonIndex];

  // Cartões de aquecimento SRS
  const [dueCards] = useState(() =>
    (saved?.dueCardIds ? saved.dueCardIds.map(id => state.cards[id]).filter(Boolean) : Object.values(state.cards || {})
      .filter((c) => c.seen && c.due <= Date.now() && cardMatchesLevel(c, "N5"))
      .slice(0, duration === 5 ? 3 : duration === 15 ? 5 : 8)),
  );

  const [srsIndex, setSrsIndex] = useState(saved?.srsIndex || 0);
  const [srsRevealed, setSrsRevealed] = useState(saved?.srsRevealed || false);
  const currentCard = dueCards[srsIndex] || Object.values(state.cards)[0];

  // Estado do desafio prático
  const [selectedOption, setSelectedOption] = useState(saved?.selectedOption ?? null);
  const [answered, setAnswered] = useState(saved?.answered || false);
  useEffect(() => { if (step === 4) return; const snapshot = {step,lessonIndex:selectedLessonIndex,duration,dueCardIds:dueCards.map(c=>c.id),srsIndex,srsRevealed,selectedOption,answered}; update(s => { s.studySession = snapshot; }); }, [step,selectedLessonIndex,duration,srsIndex,srsRevealed,selectedOption,answered]);

  // Áudio da frase da lição
  const handleSpeak = (text) => {
    if (speak) speak(text);
  };

  // Salvar anotação rápida no Caderno
  const handleSaveToNotebook = () => {
    update((s) => {
      if (!s.notebook) s.notebook = { notes: [], kanban: [], doubts: [] };
      const newNote = {
        id: `note-${Date.now()}`,
        title: `Lição: ${currentLesson.objective}`,
        content: `### ${currentLesson.objective}\n**Exemplo:** ${currentLesson.phraseJa} (${currentLesson.phraseRo})\n*Tradução:* ${currentLesson.phrasePt}\n\n**Explicação:**\n${currentLesson.explanation}\n\n**Regra:** ${currentLesson.grammarTip}`,
        tags: ["Sessão Guiada", "N5"],
        updatedAt: Date.now(),
      };
      s.notebook.notes.unshift(newNote);
    });
    if (toast) toast("Anotado no seu Caderno de Estudo!");
  };

  // Registrar dúvida na Caixa de Dúvidas
  const handleSendToDoubts = () => {
    update((s) => {
      if (!s.notebook) s.notebook = { notes: [], kanban: [], doubts: [] };
      if (!s.notebook.doubts) s.notebook.doubts = [];
      s.notebook.doubts.unshift({
        id: `doubt-${Date.now()}`,
        topic: currentLesson.objective,
        phrase: currentLesson.phraseJa,
        createdAt: Date.now(),
      });
    });
    if (toast)
      toast("Dúvida guardada na Caixa de Dúvidas para revisar depois!");
  };

  // Concluir sessão: o tempo já foi creditado pelo cronômetro ativo.
  const handleFinishSession = () => {
    update((s) => {
      markStudy(s);
      s.studySession = null; // limpa sessão ativa
    });
    setFinalElapsed(elapsed);
    if (toast) toast("Sessão concluída. Presença confirmada hoje.");
    setStep(4);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Sessão guiada N5"
    >
      <div className="w-full max-w-2xl min-w-0 bg-surface border border-line rounded-2xl p-6 sm:p-8 relative space-y-6 max-h-[92vh] overflow-y-auto select-none">
        {/* Header com indicador de passo e tempo */}
        <header className="flex items-center justify-between pb-4 border-b border-line">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-primary-strong text-xs font-bold">
              <Icon name="learn" />
              <span>Sessão guiada · meta {duration} min</span>
            </div>
            <div className="text-xs text-muted">
              <span className="tabular-nums font-bold text-ink">
                {formatClock(elapsed)}
              </span>{" "}
              decorridos · Etapa {step} de 3{" "}
              {step === 1
                ? "(Aquecimento)"
                : step === 2
                  ? "(Novo Conteúdo)"
                  : "(Aplicação)"}
            </div>
          </div>
          <button
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-paper cursor-pointer transition-colors"
            onClick={onClose}
            aria-label="Fechar sessão"
            title="Pausar e continuar depois"
          >
            <Icon name="close" />
          </button>
        </header>

        {/* Barra de Progresso Superior */}
        <div className="h-1.5 w-full bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${step === 4 ? 100 : ((step - 1) / 3) * 100 + 33}%`,
            }}
          />
        </div>

        {/* ETAPA 1: Aquecimento com Cartões Pendentes (SRS) */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                1. AQUECIMENTO
              </span>
              <h2 className="text-xl font-bold text-ink">
                Revisando o que você já sabe
              </h2>
              <p className="text-xs text-muted">
                Reativar a memória antes de aprender algo novo prepara o
                cérebro.
              </p>
            </div>

            {currentCard ? (
              <div className="p-6 rounded-xl border border-line bg-paper text-center space-y-4">
                <span className="inline-block text-[11px] font-bold text-muted uppercase">
                  {currentCard.type}
                </span>
                <div className="font-jp text-5xl font-bold text-ink" lang="ja">
                  {currentCard.prompt}
                </div>
                <div>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
                    onClick={() =>
                      handleSpeak(currentCard.spoken || currentCard.prompt)
                    }
                    aria-label="Ouvir pronúncia"
                  >
                    <Icon name="sound" /> Ouvir pronúncia
                  </button>
                </div>

                {srsRevealed ? (
                  <div className="pt-4 border-t border-line space-y-1">
                    <strong className="text-2xl font-bold text-primary-strong block">
                      {currentCard.answer}
                    </strong>
                    {currentCard.reading && (
                      <small className="text-xs text-muted block">
                        {currentCard.reading}
                      </small>
                    )}
                  </div>
                ) : (
                  <div>
                    <button
                      className="py-2.5 px-5 rounded-xl border border-edge bg-surface text-sm font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
                      onClick={() => setSrsRevealed(true)}
                    >
                      Mostrar resposta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-line bg-paper text-center space-y-2">
                <Icon name="check" />
                <p className="text-sm font-semibold text-ink">
                  Nenhum cartão pendente agora! Excelente ritmo.
                </p>
              </div>
            )}

            <div className="pt-2">
              {srsRevealed && dueCards.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["again", "Preciso rever"],
                    ["good", "Lembrei"],
                  ].map(([rating, label]) => (
                    <button
                      key={rating}
                      className="min-h-11 rounded-lg border border-edge px-4 text-sm font-semibold cursor-pointer"
                      onClick={() => {
                        update((next) =>
                          rateCard(next, currentCard.id, rating),
                        );
                        setSrsRevealed(false);
                        if (srsIndex + 1 < dueCards.length)
                          setSrsIndex((i) => i + 1);
                        else setStep(2);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  className="w-full min-h-11 text-sm font-semibold text-primary cursor-pointer"
                  onClick={() => setStep(2)}
                >
                  Seguir para a lição
                </button>
              )}
            </div>
          </div>
        )}

        {/* ETAPA 2: Novo Conteúdo Guiado (Ciclo Didático) */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                2. NOVO CONHECIMENTO
              </span>
              <h2 className="text-xl font-bold text-ink">
                {currentLesson.objective}
              </h2>
              <small className="inline-block text-xs text-muted font-medium">
                Contexto: {currentLesson.context}
              </small>
            </div>

            {/* Frase em Destaque */}
            <div className="p-6 rounded-xl border border-primary/20 bg-accent-soft/20 text-center space-y-2">
              <div
                className="font-jp text-xl sm:text-2xl font-bold text-primary-strong"
                lang="ja"
              >
                {currentLesson.phraseJa}
              </div>
              <div className="text-xs font-semibold text-muted">
                {currentLesson.phraseRo}
              </div>
              <div className="text-sm font-medium text-ink">
                {currentLesson.phrasePt}
              </div>
              <button
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
                onClick={() => handleSpeak(currentLesson.phraseJa)}
              >
                <Icon name="sound" /> Escutar frase completa
              </button>
            </div>

            {/* Explicação Didática */}
            <div className="p-4 rounded-xl border border-line bg-surface space-y-2">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
                Como funciona:
              </h3>
              <p className="text-sm text-ink leading-relaxed">
                {currentLesson.explanation}
              </p>
              <div className="p-3 rounded-lg border border-edge/30 bg-paper text-xs text-ink flex items-center gap-2">
                <Icon name="leaf" />{" "}
                <span>
                  <strong>Dica de ouro:</strong> {currentLesson.grammarTip}
                </span>
              </div>
            </div>

            {/* Vocabulário */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted uppercase tracking-wider">
                Palavras para prestar atenção:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentLesson.vocab.map((v, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-line bg-surface text-center cursor-pointer hover:border-edge transition-colors"
                    onClick={() => handleSpeak(v.ja)}
                  >
                    <strong
                      className="block font-jp text-base font-bold text-ink"
                      lang="ja"
                    >
                      {v.ja}
                    </strong>
                    <span className="block text-xs text-muted">{v.ro}</span>
                    <small className="block text-[11px] text-muted">
                      {v.pt}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
                onClick={handleSaveToNotebook}
              >
                <Icon name="paper" /> Anotar no Caderno
              </button>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
                onClick={handleSendToDoubts}
              >
                <Icon name="help" /> Não entendi 100% (Guardar dúvida)
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                className="flex-1 py-3 px-4 rounded-xl border border-line bg-surface text-ink font-semibold text-sm cursor-pointer hover:bg-paper transition-colors"
                onClick={() => setStep(1)}
              >
                Voltar
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary-strong transition-colors"
                onClick={() => setStep(3)}
              >
                Praticar Agora <Icon name="arrow" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: Aplicação Prática */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                3. APLICAÇÃO PRÁTICA
              </span>
              <h2 className="text-xl font-bold text-ink">
                Coloque em uso sem medo de errar
              </h2>
              <p className="text-sm text-muted">
                {currentLesson.challenge.question}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {currentLesson.challenge.options.map((opt, i) => {
                let statusStyle =
                  "border-line bg-surface text-ink hover:border-edge hover:bg-paper";
                if (answered) {
                  if (opt.correct)
                    statusStyle =
                      "border-success bg-success-soft text-success font-bold";
                  else if (selectedOption === i)
                    statusStyle =
                      "border-danger bg-danger-soft text-danger font-bold";
                }
                return (
                  <button
                    key={i}
                    className={`flex items-center gap-3 p-4 rounded-xl border font-medium text-sm text-left cursor-pointer transition-all active:translate-y-px ${statusStyle}`}
                    disabled={answered}
                    onClick={() => {
                      setSelectedOption(i);
                      setAnswered(true);
                      if (opt.correct) handleSpeak(opt.text.split(" ")[0]);
                    }}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-paper border border-line text-xs font-bold text-muted">
                      {i + 1}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Diagnóstico Explicativo Profundo */}
            {answered && (
              <div
                className={`p-4 rounded-xl border text-sm space-y-2 ${
                  currentLesson.challenge.options[selectedOption]?.correct
                    ? "border-success/30 bg-success-soft/20 text-success"
                    : "border-danger/30 bg-danger-soft/20 text-danger"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {currentLesson.challenge.options[selectedOption]?.correct ? (
                    <>
                      <Icon name="check" />
                      <span>Excelente raciocínio!</span>
                    </>
                  ) : (
                    <>
                      <Icon name="alert" />
                      <span>Entenda por que essa resposta não se aplica:</span>
                    </>
                  )}
                </div>
                <p className="text-ink leading-relaxed">
                  {currentLesson.challenge.options[selectedOption]?.explain}
                </p>
                {!currentLesson.challenge.options[selectedOption]?.correct && (
                  <div className="pt-2 text-xs font-bold text-muted">
                    A resposta certa é:{" "}
                    <span className="text-primary-strong">
                      {
                        currentLesson.challenge.options.find((o) => o.correct)
                          ?.text
                      }
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                className="flex-1 py-3 px-4 rounded-xl border border-line bg-surface text-ink font-semibold text-sm cursor-pointer hover:bg-paper transition-colors"
                onClick={() => setStep(2)}
              >
                Rever Lição
              </button>
              {answered && (
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary-strong transition-colors"
                  onClick={handleFinishSession}
                >
                  Concluir Sessão de Hoje <Icon name="check" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ETAPA 4: Celebração e Próximos Passos */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div
              className="font-jp text-5xl font-bold text-primary-strong"
              lang="ja"
            >
              達
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-ink">Sessão Concluída!</h2>
              <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                {finalElapsed < 60
                  ? "Você fez um primeiro contato rápido. Volte quando puder para somar mais tempo."
                  : `Você estudou ${formatDuration(finalElapsed)} de verdade${
                      finalElapsed >= duration * 60
                        ? ", e bateu a meta de hoje."
                        : `. Meta de hoje: ${duration} min.`
                    }`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Icon name="flame" />
                <span>Ofensiva: {state.streak?.days || 1} dias</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Icon name="check" />
                <span>{currentLesson.objective}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary-strong transition-colors"
                onClick={() => {
                  onClose();
                  if (onNavigateToNotebook) onNavigateToNotebook();
                }}
              >
                <Icon name="paper" /> Ver no Caderno de Estudo
              </button>
              <button
                className="flex-1 py-3.5 px-4 rounded-xl border border-line bg-surface text-ink font-semibold text-sm cursor-pointer hover:border-edge hover:bg-paper transition-colors"
                onClick={onClose}
              >
                Voltar ao Estúdio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
