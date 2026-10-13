import React, { useState, useEffect } from "react";
import Icon from "./Icon.jsx";
import { Card, Button, ProgressBar, EmptyState } from "./ui/index.jsx";
import { PageHeading } from "./UI.jsx";
import { rateCard } from "../state.js";
export function Review({ state, queue, update, go, speak }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [queue]);

  const card = state.cards[queue[index]];

  if (!card) {
    return (
      <EmptyState
        title="Tudo revisado por hoje!"
        icon={<Icon name="check" />}
        action={
          <Button variant="primary" onClick={() => go("learn")}>
            Aprender novos cartões →
          </Button>
        }
      >
        Você concluiu sua fila de repetição espaçada. Sessões curtas e diárias
        fixam muito mais do que longas maratonas.
      </EmptyState>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Cabeçalho de Revisão SRS */}
      <PageHeading
        title="Repetição Espaçada (SRS)"
        description={`Fixe vocabulário e partículas do ${state.selectedLevel || "N5"} no momento exato da curva de esquecimento.`}
        icon="review"
        iconBg="bg-blue-soft"
        iconColor="text-blue"
      >
        <span className="type-caption text-primary bg-accent-soft px-3 py-1.5 rounded-xl border border-primary/20">
          Nível Ativo: {state.selectedLevel || "N5"}
        </span>
      </PageHeading>

      <div className="flex items-center justify-between type-caption text-muted">
        <span>
          Cartão {index + 1} de {queue.length}
        </span>
        <span className="type-caption text-blue">{card.type}</span>
      </div>

      <ProgressBar
        value={(index / queue.length) * 100}
        label="Cartões revisados nesta sessão"
      />

      <Card className="text-center py-16 px-8 min-h-[380px] sm:min-h-[460px] flex flex-col justify-center items-center space-y-6 border-2 border-b-6 border-line bg-paper rounded-3xl shadow-xs">
        <div className="font-jp text-6xl sm:text-7xl lg:text-8xl font-black text-ink-strong my-4 select-none">
          {card.prompt}
        </div>
        <p className="type-body font-bold text-muted">
          {card.type.startsWith("Vocabulário")
            ? "Qual a leitura e o significado em português?"
            : "Qual som este caractere representa?"}
        </p>

        {revealed && (
          <div className="w-full max-w-md pt-6 mt-4 border-t-2 border-line animate-fade-in space-y-2">
            <span className="type-caption text-muted block">
              Resposta:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-primary">
              {card.answer}
            </div>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => speak(card.spoken || card.prompt)}
        >
          <Icon name="sound" /> Ouvir pronúncia
        </Button>
        {!revealed ? (
          <Button
            variant="primary"
            size="lg"
            onClick={() => setRevealed(true)}
            className="px-8"
          >
            Revelar resposta
          </Button>
        ) : null}
      </div>

      {revealed && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            {
              rating: "again",
              label: "Errei",
              hint: "Rever em 10m",
              variant: "danger",
            },
            {
              rating: "hard",
              label: "Difícil",
              hint: "Intervalo curto",
              variant: "flame",
            },
            {
              rating: "good",
              label: "Bom",
              hint: "Intervalo normal",
              variant: "primary",
            },
            {
              rating: "easy",
              label: "Fácil",
              hint: "Intervalo longo",
              variant: "blue",
            },
          ].map((item) => (
            <Button
              key={item.rating}
              variant={item.variant}
              className="flex-col h-auto py-3.5 gap-0.5 text-center"
              onClick={() => {
                update((s) => rateCard(s, card.id, item.rating));
                setIndex((i) => i + 1);
                setRevealed(false);
              }}
            >
              <span className="font-black text-sm">{item.label}</span>
              <span className="text-[10px] opacity-80 font-bold">
                {item.hint}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
