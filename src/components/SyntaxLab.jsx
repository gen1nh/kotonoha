import React, { useState } from "react";
import Icon from "./Icon.jsx";
import { Button, Card, ProgressBar } from "./ui/index.jsx";
import { PageHeading } from "./UI.jsx";

export const SYNTAX_EXERCISES = [
  {
    id: "ex-1",
    pt: "Eu como lámen no restaurante.",
    structurePt: "Sujeito (Eu) + Verbo (como) + Objeto (lámen) + Lugar (restaurante)",
    targetJa: "私はレストランでラーメンを食べます。",
    targetRo: "Watashi wa resutoran de raamen o tabemasu.",
    blocks: [
      { id: "b1", text: "私", label: "Eu (Sujeito)", color: "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised" },
      { id: "b2", text: "は", label: "Tópico (Partícula)", color: "border-blue bg-blue-soft text-blue border-b-blue-dark" },
      { id: "b3", text: "レストラン", label: "Restaurante (Lugar)", color: "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised" },
      { id: "b4", text: "で", label: "Em (Partícula de Ação)", color: "border-flame bg-flame-soft text-flame border-b-flame" },
      { id: "b5", text: "ラーメン", label: "Lámen (Objeto)", color: "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised" },
      { id: "b6", text: "を", label: "Objeto Direto (Partícula)", color: "border-blue bg-blue-soft text-blue border-b-blue-dark" },
      { id: "b7", text: "食べます", label: "Como (Verbo no final)", color: "border-primary bg-accent-soft text-primary-strong border-b-primary-dark" },
    ],
    explanation:
      "No português dizemos 'como lámen no restaurante' (Verbo antes do objeto). No japonês, o VERBO SEMPRE VAI PARA O FINAL! O padrão é: Quem (私は) + Onde (レストランで) + O quê (ラーメンを) + Ação (食べます).",
  },
  {
    id: "ex-2",
    pt: "Kenji bebe café na cafeteria.",
    structurePt: "Sujeito (Kenji) + Verbo (bebe) + Objeto (café) + Lugar (cafeteria)",
    targetJa: "ケンジはカフェでコーヒーを飲みます。",
    targetRo: "Kenji wa kafe de koohii o nomimasu.",
    blocks: [
      { id: "b1", text: "ケンジ", label: "Kenji (Sujeito)", color: "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised" },
      { id: "b2", text: "は", label: "Tópico", color: "border-blue bg-blue-soft text-blue border-b-blue-dark" },
      { id: "b3", text: "カフェ", label: "Cafeteria (Lugar)", color: "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised" },
      { id: "b4", text: "で", label: "Onde ocorre a ação", color: "border-flame bg-flame-soft text-flame border-b-flame" },
      { id: "b5", text: "コーヒー", label: "Café (Objeto)", color: "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised" },
      { id: "b6", text: "を", label: "Marca o café", color: "border-blue bg-blue-soft text-blue border-b-blue-dark" },
      { id: "b7", text: "飲みます", label: "Bebe (Verbo final)", color: "border-primary bg-accent-soft text-primary-strong border-b-primary-dark" },
    ],
    explanation:
      "A partícula で (de) indica o local onde uma ação dinâmica acontece. Já a partícula を (o) liga o objeto direto ao verbo beber (飲みます).",
  },
  {
    id: "ex-3",
    pt: "A professora vai para Tóquio amanhã.",
    structurePt: "Sujeito (Professora) + Verbo (vai) + Destino (Tóquio) + Tempo (Amanhã)",
    targetJa: "先生は明日東京に行きます。",
    targetRo: "Sensei wa ashita Toukyou ni ikimasu.",
    blocks: [
      { id: "b1", text: "先生", label: "Professora", color: "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised" },
      { id: "b2", text: "は", label: "Tópico", color: "border-blue bg-blue-soft text-blue border-b-blue-dark" },
      { id: "b3", text: "明日", label: "Amanhã (Tempo)", color: "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised" },
      { id: "b4", text: "東京", label: "Tóquio (Destino)", color: "border-line bg-paper text-ink-strong border-b-edge hover:bg-raised" },
      { id: "b5", text: "に", label: "Para (Partícula de Destino)", color: "border-purple bg-purple-soft text-purple-ink border-b-purple" },
      { id: "b6", text: "行きます", label: "Vai (Verbo de movimento)", color: "border-primary bg-accent-soft text-primary-strong border-b-primary-dark" },
    ],
    explanation:
      "Destino de deslocamento leva a partícula に (ni) com o verbo de movimento 行きます (ikimasu). Note que o tempo (明日 - amanhã) geralmente vem logo após o tópico da frase.",
  },
];

export default function SyntaxLab({ update, toast, speak }) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState(() => {
    const list = [...SYNTAX_EXERCISES[0].blocks];
    return list.sort(() => Math.random() - 0.5);
  });
  const [status, setStatus] = useState("idle"); // "idle", "correct", "wrong"

  const currentExercise = SYNTAX_EXERCISES[exerciseIndex];

  const handleSelectBlock = (block) => {
    if (status !== "idle") return;
    setAvailableBlocks((prev) => prev.filter((b) => b.id !== block.id));
    setSelectedBlocks((prev) => [...prev, block]);
  };

  const handleRemoveBlock = (block) => {
    if (status !== "idle") return;
    setSelectedBlocks((prev) => prev.filter((b) => b.id !== block.id));
    setAvailableBlocks((prev) => [...prev, block]);
  };

  const handleCheck = () => {
    const userSentence = selectedBlocks.map((b) => b.text).join("");
    const targetSentence = currentExercise.blocks.map((b) => b.text).join("");

    if (userSentence === targetSentence) {
      setStatus("correct");
      if (speak) speak(currentExercise.targetJa);
      if (toast) toast("Excelente! Você dominou o contraste sintático.");
    } else {
      setStatus("wrong");
      // Registra automaticamente na memória de erros persistente
      update((s) => {
        if (!s.errorMemory) s.errorMemory = [];
        s.errorMemory.unshift({
          id: `err-${Date.now()}`,
          date: Date.now(),
          topic: "Ordem Sintática (SOV)",
          phrase: currentExercise.pt,
          wrongAnswer: selectedBlocks.map((b) => b.text).join(" "),
          correctAnswer: currentExercise.targetJa,
          pattern: "Verbo no final da frase (SOV)",
          notes: currentExercise.explanation,
        });
      });
      if (toast) toast("Ops! O Sensei Hiroshi salvou este ponto no seu Diário de Bordo.");
    }
  };

  const handleNext = () => {
    const nextIdx = (exerciseIndex + 1) % SYNTAX_EXERCISES.length;
    setExerciseIndex(nextIdx);
    setSelectedBlocks([]);
    setAvailableBlocks([...SYNTAX_EXERCISES[nextIdx].blocks].sort(() => Math.random() - 0.5));
    setStatus("idle");
  };

  return (
    <div className="w-full space-y-6">
      {/* Topo do Laboratório */}
      <PageHeading
        title="Laboratório de Contraste Sintático"
        description="Reconstrua o pensamento brasileiro (SVO) no padrão mental japonês (SOV com partículas)."
        icon="puzzle"
        iconBg="bg-blue-soft"
        iconColor="text-blue"
      >
        <span className="type-caption text-muted bg-raised px-3.5 py-1.5 rounded-xl border-2 border-line">
          Desafio {exerciseIndex + 1} de {SYNTAX_EXERCISES.length}
        </span>
      </PageHeading>

      <ProgressBar
        value={((exerciseIndex + 1) / SYNTAX_EXERCISES.length) * 100}
        label="Progresso no Laboratório Sintático"
      />

      {/* Cartão de Desafio com borda 3D Duolingo */}
      <Card className="space-y-6 border-2 border-b-6 border-line bg-paper rounded-3xl p-6 sm:p-8">
        <div className="space-y-2">
          <span className="type-caption text-muted uppercase tracking-wider block">
            Frase em Português:
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-ink-strong">
            "{currentExercise.pt}"
          </div>
          <div className="type-body-sm text-muted bg-raised p-3.5 rounded-2xl border-2 border-line">
            Estrutura no Português: {currentExercise.structurePt}
          </div>
        </div>

        {/* Tabuleiro de Montagem (Sua Frase em Japonês com maior altura) */}
        <div className="space-y-2">
          <span className="type-caption text-muted uppercase tracking-wider block">
            Sua Frase em Japonês (Toque nos blocos abaixo para posicionar):
          </span>
          <div className="min-h-28 sm:min-h-32 p-4 sm:p-6 rounded-2xl border-2 border-dashed border-edge bg-raised flex flex-wrap gap-2.5 items-center">
            {selectedBlocks.length === 0 ? (
              <span className="type-body-sm text-muted italic">
                Toque nos blocos de palavras abaixo na ordem correta do japonês (Sujeito + Objeto + Verbo no final)...
              </span>
            ) : (
              selectedBlocks.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleRemoveBlock(b)}
                  className={`px-4 sm:px-5 py-3 rounded-xl border-2 border-b-4 text-base sm:text-lg font-black cursor-pointer transition-all active:translate-y-px ${b.color}`}
                  title={`${b.label} (Toque para remover)`}
                >
                  <span className="font-jp">{b.text}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Blocos Disponíveis */}
        <div className="space-y-2">
          <span className="type-caption text-muted uppercase tracking-wider block">
            Banco de Blocos:
          </span>
          <div className="flex flex-wrap gap-2.5 p-4 bg-paper rounded-2xl border-2 border-line">
            {availableBlocks.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectBlock(b)}
                className={`px-4 sm:px-5 py-3 rounded-xl border-2 border-b-4 text-base sm:text-lg font-black cursor-pointer hover:scale-105 active:translate-y-px transition-all ${b.color}`}
              >
                <span className="font-jp">{b.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback do Sensei Hiroshi */}
        {status === "correct" && (
          <div className="p-5 rounded-2xl bg-accent-soft/40 border-2 border-primary space-y-2">
            <div className="flex items-center gap-2 text-primary-strong font-black text-base">
              <span>✓ Perfeito! Você acertou a ordem SOV.</span>
            </div>
            <div className="font-jp text-lg sm:text-xl font-black text-ink-strong">
              {currentExercise.targetJa}
            </div>
            <p className="type-body-sm text-ink leading-relaxed">
              <strong>Explicação do Sensei Hiroshi:</strong> {currentExercise.explanation}
            </p>
          </div>
        )}

        {status === "wrong" && (
          <div className="p-5 rounded-2xl bg-danger-soft/40 border-2 border-danger space-y-2">
            <div className="flex items-center gap-2 text-danger font-black text-base">
              <span>Atenção à virada sintática:</span>
            </div>
            <div className="space-y-1.5 type-body-sm">
              <div className="text-danger">
                <strong>Sua tentativa:</strong> {selectedBlocks.map((b) => b.text).join(" ")}
              </div>
              <div className="text-primary-strong font-bold">
                <strong>Padrão Correto:</strong> {currentExercise.targetJa} ({currentExercise.targetRo})
              </div>
            </div>
            <p className="type-body-sm text-ink leading-relaxed pt-2 border-t border-danger/20">
              <strong>Orientação do Sensei Hiroshi:</strong> {currentExercise.explanation}
            </p>
          </div>
        )}

        {/* Barra de Ação com Botão Proporcional e Alinhamento Equilibrado */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-line">
          <div className="type-body-sm text-muted">
            {selectedBlocks.length === 0
              ? "Toque nos blocos na ordem SOV para montar a frase"
              : `${selectedBlocks.length} de ${currentExercise.blocks.length} blocos posicionados`}
          </div>

          <div className="w-full sm:w-auto">
            {status === "idle" ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8"
                disabled={selectedBlocks.length === 0}
                onClick={handleCheck}
              >
                Verificar Ordem da Frase →
              </Button>
            ) : (
              <Button
                variant={status === "correct" ? "primary" : "secondary"}
                size="lg"
                className="w-full sm:w-auto px-8"
                onClick={handleNext}
              >
                {exerciseIndex + 1 < SYNTAX_EXERCISES.length ? "Próximo Desafio →" : "Reiniciar Desafios"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
