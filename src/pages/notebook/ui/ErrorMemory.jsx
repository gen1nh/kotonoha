import React, { useState } from "react";
import Icon from "../../../shared/ui/Icon.jsx";
import { Button, Card, EmptyState, AudioRateControl } from "../../../shared/ui/index.jsx";
import { PageHeading } from "../../../shared/ui/index.jsx";
import { chatCompletion, useReadingPreferences } from "../../../entities/study/index.js";

export default function ErrorMemory({ state, update, toast, speak, go }) {
  const readingPreferences=useReadingPreferences();
  const [speechRate,setSpeechRate]=useState(()=>readingPreferences.speechRate);
  const [filter, setFilter] = useState("all"); // "all", "pending", "resolved"
  const [activeDrill, setActiveDrill] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDrillResponse, setAiDrillResponse] = useState("");

  const errors = state.errorMemory || [
    {
      id: "err-seed-1",
      date: Date.now() - 86400000,
      topic: "Partículas: に (ni) vs で (de)",
      phrase: "Estudo japonês na biblioteca.",
      wrongAnswer: "図書館に日本語を勉強します。",
      correctAnswer: "図書館で日本語を勉強します。",
      pattern: "Lugar de ação ativa leva で, não に",
      notes: "A partícula に marca permanência estática ou destino. Como estudar é uma ação ativa, o local exige で.",
      resolved: false,
    },
    {
      id: "err-seed-2",
      date: Date.now() - 172800000,
      topic: "Ordem Sintática SOV",
      phrase: "Bebo água.",
      wrongAnswer: "飲みます水を。",
      correctAnswer: "水を飲みます。",
      pattern: "Verbo sempre no final",
      notes: "No português colocamos o verbo antes do objeto. No japonês, o verbo fecha a oração.",
      resolved: true,
    },
  ];

  const pendingErrors = errors.filter((e) => !e.resolved);
  const resolvedErrors = errors.filter((e) => e.resolved);

  const displayedErrors =
    filter === "pending"
      ? pendingErrors
      : filter === "resolved"
        ? resolvedErrors
        : errors;

  const handleToggleResolved = (id) => {
    update((s) => {
      if (!s.errorMemory) s.errorMemory = [...errors];
      const item = s.errorMemory.find((e) => e.id === id);
      if (item) {
        item.resolved = !item.resolved;
      }
    });
    if (toast) toast("Status do erro atualizado no Diário de Bordo.");
  };

  const handlePracticeWithSensei = async (errorItem) => {
    setActiveDrill(errorItem);
    setAiLoading(true);
    setAiDrillResponse("");
    try {
      const prompt = `Como tutor virtual fictício chamado Sensei Hiroshi, faça uma micro-intervenção pedagógica personalizada sobre este erro do aluno:
Tópico: ${errorItem.topic}
Frase que tentou dizer: "${errorItem.phrase}"
Tentativa com erro: "${errorItem.wrongAnswer}"
Forma correta: "${errorItem.correctAnswer}"
Explicação: "${errorItem.notes}"

Dê um reforço caloroso e socrático em 3 partes:
1. "Notei que você escorregou em..." (identifique a trava da mente em português).
2. "A chave lógica para não esquecer é..."
3. Um mini-desafio com 1 frase para o aluno traduzir mentalmente agora.`;

      const reply = await chatCompletion(prompt, {
        errorHistory: [errorItem],
      });
      setAiDrillResponse(reply);
    } catch (err) {
      setAiDrillResponse(
        `Sensei Hiroshi: "Lembre-se da regra de ouro: ${errorItem.notes}. Pratique mentalmente repetindo a frase correta 3 vezes em voz alta!"`,
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <details className="rounded-xl border border-line bg-paper p-3">
        <summary className="min-h-11 cursor-pointer text-sm font-bold text-ink-strong">Velocidade das frases deste caderno</summary>
        <div className="pt-2"><AudioRateControl rate={speechRate} onChange={setSpeechRate} defaultRate={readingPreferences.speechRate}/></div>
      </details>
      {/* Topo do Diário de Bordo */}
      <PageHeading
        title="Diário de Bordo · Memória Persistente de Erros"
        description="Registre dificuldades recorrentes e pratique com o tutor virtual opcional, sem perder o histórico de erros."
        icon="brain"
        iconBg="bg-danger-soft"
        iconColor="text-danger"
      >
        {/* Filtros em Botões Limpos com 3D */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-2 rounded-xl type-caption cursor-pointer transition-all border-2 border-b-4 active:translate-y-px ${
              filter === "all"
                ? "bg-paper text-ink-strong border-line border-b-edge shadow-xs"
                : "border-line bg-raised text-muted hover:border-edge"
            }`}
          >
            Todos ({errors.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3.5 py-2 rounded-xl type-caption cursor-pointer transition-all border-2 border-b-4 active:translate-y-px ${
              filter === "pending"
                ? "bg-danger-soft text-danger border-danger border-b-danger shadow-xs"
                : "border-line bg-raised text-muted hover:border-edge"
            }`}
          >
            Pendentes ({pendingErrors.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("resolved")}
            className={`px-3.5 py-2 rounded-xl type-caption cursor-pointer transition-all border-2 border-b-4 active:translate-y-px ${
              filter === "resolved"
                ? "bg-accent-soft text-primary-strong border-primary border-b-primary-dark shadow-xs"
                : "border-line bg-raised text-muted hover:border-edge"
            }`}
          >
            Superados ({resolvedErrors.length})
          </button>
        </div>
      </PageHeading>

      {/* Micro-Intervenção Ativa do Sensei */}
      {activeDrill && (
        <div className="p-5 sm:p-6 rounded-3xl bg-purple-soft border-2 border-b-6 border-purple space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple text-white shadow-xs">
                <Icon name="academic" className="w-5 h-5 text-white" />
              </span>
              <div>
                <strong className="type-h3 text-purple-ink block">
                  Intervenção Personalizada do Sensei Hiroshi
                </strong>
                <span className="type-body-sm text-muted">
                  Foco: {activeDrill.topic}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveDrill(null)}
              className="p-1.5 text-muted hover:text-ink-strong rounded-xl hover:bg-paper cursor-pointer"
            >
              <Icon name="close" />
            </button>
          </div>

          {aiLoading ? (
            <div className="p-4 bg-paper rounded-xl border border-purple/30 type-body-sm text-muted italic">
              Sensei Hiroshi analisando seu padrão de erro e formulando explicação...
            </div>
          ) : (
            <div className="p-4 bg-paper rounded-xl border border-purple/30 type-body-sm text-ink-strong leading-relaxed whitespace-pre-line font-medium">
              {aiDrillResponse}
            </div>
          )}
        </div>
      )}

      {/* Lista de Erros Registrados */}
      {displayedErrors.length === 0 ? (
        <EmptyState
          title="Nenhum erro registrado neste filtro!"
          icon={<Icon name="check" />}
        >
          Parabéns! Continue praticando no Laboratório Sintático e nos diálogos.
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {displayedErrors.map((err) => (
            <Card
              key={err.id}
              className={`space-y-4 rounded-3xl border-2 border-b-4 transition-all ${
                err.resolved
                  ? "opacity-75 bg-raised border-line"
                  : "border-line bg-paper hover:border-flame"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-line">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl type-caption ${
                      err.resolved
                        ? "bg-accent-soft text-primary-strong"
                        : "bg-danger-soft text-danger"
                    }`}
                  >
                    {err.resolved ? (
                      <Icon name="check" className="w-4 h-4 text-primary" />
                    ) : (
                      <Icon name="close" className="w-4 h-4 text-danger" />
                    )}
                  </span>
                  <strong className="type-h3 text-ink-strong">
                    {err.topic}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleResolved(err.id)}
                    className={`px-3.5 py-1.5 rounded-xl type-caption border-2 border-b-4 cursor-pointer transition-all active:translate-y-px ${
                      err.resolved
                        ? "border-primary bg-accent-soft text-primary-strong border-b-primary-dark"
                        : "border-line bg-paper text-muted hover:border-primary"
                    }`}
                  >
                    {err.resolved ? "Superado ✓" : "Marcar como Superado"}
                  </button>
                </div>
              </div>

              {/* Comparação Lado a Lado: Incorreto vs Correto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-danger-soft/40 border border-danger/30 space-y-1">
                  <span className="font-black text-danger uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="close" className="w-3.5 h-3.5 text-danger" />
                    <span>Tentativa com Erro:</span>
                  </span>
                  <div className="font-jp text-sm font-bold text-danger">
                    {err.wrongAnswer}
                  </div>
                  <span className="type-caption text-muted block">
                    Frase pretendida: "{err.phrase}"
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-accent-soft/40 border border-primary/30 space-y-1">
                  <span className="font-black text-primary-strong uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="check" className="w-3.5 h-3.5 text-primary" />
                    <span>Forma Japonesa Correta:</span>
                  </span>
                  <div className="font-jp text-sm font-bold text-primary-strong flex items-center justify-between">
                    <span>{err.correctAnswer}</span>
                    {speak && (
                      <button
                        type="button"
                        onClick={() => speak(err.correctAnswer,{rate:speechRate})}
                        className="p-1 rounded-lg text-primary hover:bg-paper cursor-pointer"
                        title="Ouvir pronúncia nativa"
                      >
                        <Icon name="sound" />
                      </button>
                    )}
                  </div>
                  <span className="type-caption text-muted block">
                    Padrão: {err.pattern}
                  </span>
                </div>
              </div>

              {/* Explicação do Sensei Hiroshi */}
              <div className="p-3.5 rounded-xl bg-raised border border-line flex items-start gap-2.5 type-body-sm text-ink leading-relaxed">
                <Icon name="sparkles" className="w-4 h-4 shrink-0 text-flame mt-0.5" />
                <div>
                  <strong>Conselho Cirúrgico do Sensei:</strong> {err.notes}
                </div>
              </div>

              {/* Ação: Revisar com o Sensei */}
              <div className="flex justify-end pt-1">
                <Button
                  variant="purple"
                  size="sm"
                  onClick={() => handlePracticeWithSensei(err)}
                >
                  Pedir Ajuda ao Sensei Hiroshi →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
