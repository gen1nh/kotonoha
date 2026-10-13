import React from "react";
import N5ListeningPractice from "./N5ListeningPractice.jsx";
import Icon from "./Icon.jsx";
import { Button, Card } from "./ui/index.jsx";
import { PageHeading } from "./UI.jsx";
import { LEVELS } from "../state.js";

export default function PracticeHub({ state, go, changeLevel }) {
  const currentLevel = state.selectedLevel || "N5";
  const isN4Plus = ["N4", "N3", "N2", "N1"].includes(currentLevel);
  const isN3Plus = ["N3", "N2", "N1"].includes(currentLevel);

  return (
    <div className="w-full space-y-6 min-w-0">
      <N5ListeningPractice />
      {/* Cabeçalho Oficial do Hub */}
      <PageHeading
        title="Prática & Laboratórios"
        description="Ambientes imersivos calibrados com desbloqueio pedagógico para o seu nível."
        icon="bolt"
        iconBg="bg-blue-soft"
        iconColor="text-blue"
      >
        <div className="flex items-center gap-2">
          <span className="type-caption text-muted hidden sm:inline">Seu Nível:</span>
          <select
            value={currentLevel}
            onChange={(e) => changeLevel && changeLevel(e.target.value)}
            className="px-3 py-1.5 rounded-xl border-2 border-line bg-paper type-caption text-ink-strong cursor-pointer focus:outline-none focus:border-primary shadow-xs"
            aria-label="Selecionar nível da prática"
          >
            {LEVELS.map(([id, label]) => (
              <option key={id} value={id}>
                {id} · {label}
              </option>
            ))}
          </select>
        </div>
      </PageHeading>

      {/* Grade de Laboratórios com Progressão Pedagógica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
        {/* Lab 1: Contraste Sintático SOV (N5+) */}
        <Card className="flex flex-col justify-between p-6 rounded-3xl border-2 border-b-6 border-line bg-paper space-y-4 hover:border-blue transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft text-blue shadow-xs">
                <Icon name="puzzle" className="w-6 h-6 text-blue" />
              </span>
              <span className="type-caption text-blue bg-blue-soft px-3 py-1 rounded-xl border border-blue/20">
                Disponível · N5 a N1
              </span>
            </div>

            <div>
              <strong className="type-h2 text-ink-strong block">
                Laboratório de Contraste Sintático
              </strong>
              <p className="type-body-sm text-muted mt-1 leading-relaxed">
                Reconstrua o pensamento brasileiro (SVO) no padrão mental japonês (SOV com partículas). O verbo sempre fecha a oração!
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="blue"
              size="md"
              className="w-full"
              onClick={() => go("syntax")}
            >
              Entrar no Laboratório SOV →
            </Button>
          </div>
        </Card>

        {/* Lab 2: Diário de Bordo de Erros (Todos os Níveis) */}
        <Card className="flex flex-col justify-between p-6 rounded-3xl border-2 border-b-6 border-line bg-paper space-y-4 hover:border-purple transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-soft text-purple-ink shadow-xs">
                <Icon name="brain" className="w-6 h-6 text-purple-ink" />
              </span>
              <span className="type-caption text-purple-ink bg-purple-soft px-3 py-1 rounded-xl border border-purple/20">
                Memória Persistente
              </span>
            </div>

            <div>
              <strong className="type-h2 text-ink-strong block">
                Diário de Bordo de Erros
              </strong>
              <p className="type-body-sm text-muted mt-1 leading-relaxed">
                O Sensei Hiroshi memoriza suas fraquezas sintáticas para que você aprenda com cada tentativa e nunca repita o mesmo erro.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="purple"
              size="md"
              className="w-full"
              onClick={() => go("errors")}
            >
              Abrir Diário de Erros →
            </Button>
          </div>
        </Card>

        {/* Lab 3: Simulador LINE (Requer N4+) */}
        <Card
          className={`flex flex-col justify-between p-6 rounded-3xl border-2 border-b-6 transition-all space-y-4 ${
            isN4Plus
              ? "border-line bg-paper hover:border-primary"
              : "border-line bg-paper"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs ${
                  isN4Plus
                    ? "bg-accent-soft text-primary"
                    : "bg-raised text-muted"
                }`}
              >
                <Icon name="phone" className="w-6 h-6" />
              </span>
              <span
                className={`type-caption px-3 py-1 rounded-xl border ${
                  isN4Plus
                    ? "text-primary bg-accent-soft border-primary/20"
                    : "text-flame-ink bg-flame-soft border-flame/30"
                }`}
              >
                {isN4Plus
                  ? isN3Plus
                    ? "Desbloqueado · Keigo & Casual"
                    : "Desbloqueado · Modo Casual N4"
                  : "🔒 Desbloqueia no N4"}
              </span>
            </div>

            <div>
              <strong className="type-h2 text-ink-strong block">
                Simulador de Vida Real · Modo LINE
              </strong>
              <p className="type-body-sm text-muted mt-1 leading-relaxed">
                {isN4Plus
                  ? "Converse em japonês realista com respostas curtas pelo LINE (Shibuya com amigos, Hotel em Kyoto ou Reunião em Tóquio)."
                  : "Conversas no LINE exigem a forma casual (Tameguchi) e conectivos verbais ensinados a partir do N4 para soar natural."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            {isN4Plus ? (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => go("line")}
              >
                Abrir Simulador LINE →
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => go("line")}
                >
                  Explorar Prévia do LINE →
                </Button>
                <button
                  type="button"
                  onClick={() => changeLevel && changeLevel("N4")}
                  className="w-full text-center type-caption text-primary hover:underline cursor-pointer"
                >
                  Já estudei o básico? Mudar para N4
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Lab 4: Pitch Accent de Tóquio (Requer N4+) */}
        <Card
          className={`flex flex-col justify-between p-6 rounded-3xl border-2 border-b-6 transition-all space-y-4 ${
            isN4Plus
              ? "border-line bg-paper hover:border-flame"
              : "border-line bg-paper"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs ${
                  isN4Plus
                    ? "bg-flame-soft text-flame"
                    : "bg-raised text-muted"
                }`}
              >
                <Icon name="mic" className="w-6 h-6" />
              </span>
              <span
                className={`type-caption px-3 py-1 rounded-xl border ${
                  isN4Plus
                    ? "text-flame-ink bg-flame-soft border-flame/20"
                    : "text-muted bg-raised border-line"
                }`}
              >
                {isN4Plus ? "Desbloqueado · Fonética N4+" : "🔒 Desbloqueia no N4"}
              </span>
            </div>

            <div>
              <strong className="type-h2 text-ink-strong block">
                Laboratório de Pitch Accent & Fonética
              </strong>
              <p className="type-body-sm text-muted mt-1 leading-relaxed">
                {isN4Plus
                  ? "Calibre sua entonação tonal de Tóquio (alto/baixo). Grave sua voz e compare sua onda sonora com nativos."
                  : "No N5, a prioridade é dominar a leitura dos 46 caracteres Kana antes de analisar microcurvas de entonação tonal."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            {isN4Plus ? (
              <Button
                variant="flame"
                size="md"
                className="w-full"
                onClick={() => go("pitch")}
              >
                Calibrar Pitch Accent →
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => go("pitch")}
                >
                  Explorar Pitch Accent →
                </Button>
                <button
                  type="button"
                  onClick={() => changeLevel && changeLevel("N4")}
                  className="w-full text-center type-caption text-primary hover:underline cursor-pointer"
                >
                  Mudar para N4 e destravar
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Seção Complementar: Trilha Guiada e Biblioteca */}
      <div className="p-6 rounded-3xl border-2 border-b-6 border-line bg-raised flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <strong className="type-h3 text-ink-strong block">
            Quer seguir o currículo estruturado passo a passo?
          </strong>
          <p className="type-body-sm text-muted">
            A Trilha Oficial JLPT organiza kanji, vocabulário e gramática em ordem lógica do N5 ao N1.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="shrink-0 w-full sm:w-auto"
          onClick={() => go("jlpt")}
        >
          Abrir Trilha {currentLevel} →
        </Button>
      </div>
    </div>
  );
}
