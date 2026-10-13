import React, { useState, useRef } from "react";
import Icon from "./Icon.jsx";
import { Card, Button } from "./ui/index.jsx";
import { PageHeading } from "./UI.jsx";
import { todayKey, initialState, normalizeState, LEVELS } from "../state.js";
import { dailyGoal, dailyActivityCount, GOAL_OPTIONS } from "../dailyPlan.js";
export function Settings({ state, setState, toast, update, changeLevel, theme, setTheme, install, installPrompt, onOpenOnboarding }) {
  const [key, setKey] = useState(
    () => { try{return sessionStorage.getItem("kotonoha.groqKey") || "";}catch{return "";} },
  );
  const [model, setModel] = useState(
    () => {try{return sessionStorage.getItem("kotonoha.groqModel") || "";}catch{return "";}},
  );
  const [models, setModels] = useState(() => (model ? [model] : []));
  const [busy, setBusy] = useState(false);
  const importInput = useRef(null);

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
            ? "Chave não reconhecida. Confira no painel da Groq."
            : `Erro da API (${response.status}).`,
        );
      const data = await response.json();
      const list = (data.data || []).map((m) => m.id).sort();
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
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `kotonoha-backup-${todayKey()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Backup exportado com sucesso.");
  }

  async function importBackup(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if(file.size>5*1024*1024)throw new Error("Backup excede 5 MB. Verifique o arquivo antes de importar.");
      const imported = normalizeState(JSON.parse(await file.text()));
      const previous = state.stats?.reviews || 0;
      const incoming = imported.stats?.reviews || 0;
      const summary = `Backup válido\nNível: ${imported.selectedLevel}\nRevisões no arquivo: ${incoming}\nRevisões atuais: ${previous}\n\nA importação SUBSTITUI todo o progresso deste navegador. Exporte o backup atual antes de continuar.\n\nDeseja importar?`;
      if (window.confirm(summary)) {
        setState(imported);
        toast("Progresso importado.");
      }
    } catch (error) {
      toast(error.message || "Não foi possível ler o arquivo.");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeading
        title="Preferências & Metas"
        description="Configure meta diária, aparência, backups e IA opcional."
        icon="settings"
        iconBg="bg-raised"
        iconColor="text-ink-strong"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
        {/* Configurações efetivas do app: uma fonte de verdade para a meta. */}
        <Card className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between gap-3"><div><h2 className="font-bold text-lg text-ink-strong">Seu plano</h2><p className="text-sm text-muted">A meta conta atividades concluídas. O tempo é apenas um indicador complementar.</p></div>{onOpenOnboarding&&<Button variant="secondary" size="sm" onClick={onOpenOnboarding}>Ver orientação</Button>}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-sm font-bold text-ink-strong">Meta diária de atividades
              <select aria-label="Meta diária de atividades" className="mt-2 min-h-12 w-full rounded-xl border border-line bg-paper text-ink-strong px-3" value={dailyGoal(state)} onChange={e=>update(s=>{s.dailyActivityGoal=Number(e.target.value);})}>{GOAL_OPTIONS.map(n=><option key={n} value={n}>{n} {n===1?'atividade':'atividades'} por dia</option>)}</select>
              <span className="block mt-1 text-xs text-muted">{dailyActivityCount(state)} atividade(s) concluída(s) hoje</span>
            </label>
            <label className="block text-sm font-bold text-ink-strong">Tema visual
              <select aria-label="Tema visual" className="mt-2 min-h-12 w-full rounded-xl border border-line bg-paper text-ink-strong px-3" value={theme} onChange={e=>setTheme(e.target.value)}><option value="system">Usar tema do dispositivo</option><option value="light">Claro</option><option value="dark">Escuro</option></select>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-line">
            <div className="rounded-xl bg-raised p-3"><p className="text-sm text-ink-strong font-bold">Histórico local</p><p className="text-xs text-muted mt-1">Sequência: {state.streak?.days||0} dia(s) · Revisões: {state.stats?.reviews||0} · {(state.stats?.reviews||0)*15} XP de revisão</p></div>
          </div>
          {installPrompt&&<Button variant="secondary" onClick={install}>Instalar aplicativo neste dispositivo</Button>}
        </Card>

        {/* Backup dos Dados */}
      <Card className="space-y-4">
        <h3 className="text-lg font-bold text-ink">Backup e Portabilidade</h3>
        <p className="text-xs text-muted leading-relaxed">
          Todo o seu estudo fica salvo no seu navegador. Exporte um arquivo JSON
          para guardar cópia ou transferir para o celular.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="primary" onClick={exportBackup}>
            Exportar backup JSON
          </Button>
          <Button
            variant="secondary"
            onClick={() => importInput.current?.click()}
          >
            Importar backup
          </Button>
          <input
            ref={importInput}
            type="file"
            accept="application/json"
            hidden
            onChange={importBackup}
          />
        </div>
      </Card>

      {/* Assistente IA Opcional */}
      <Card className="space-y-4">
        <h3 className="text-lg font-bold text-ink">
          Chave Groq / OmniRoute Local
        </h3>
        <p className="text-xs text-muted leading-relaxed">
          A prática guiada funciona sem IA. Para respostas geradas, use a Groq
          ou o serviço local configurado no computador. Esses recursos dependem
          da disponibilidade do serviço; a chave Groq fica apenas nesta sessão.
        </p>
        <div className="space-y-2">
          <label
            className="block text-xs font-semibold text-muted"
            htmlFor="apiKey"
          >
            Chave de API (Groq)
          </label>
          <input
            id="apiKey"
            type="password"
            placeholder="gsk_…"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full min-h-11 px-3 rounded-lg border border-edge bg-surface text-sm text-ink focus:outline-primary"
          />
        </div>
        {models.length > 0 && (
          <label className="block text-sm">
            Modelo
            <select
              className="block w-full min-h-11 border border-edge rounded-lg px-3 mt-2"
              value={model}
              onChange={(event) => {
                setModel(event.target.value);
                sessionStorage.setItem(
                  "kotonoha.groqModel",
                  event.target.value,
                );
              }}
            >
              {models.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setKey("");
              setModels([]);
              setModel("");
              sessionStorage.removeItem("kotonoha.groqKey");
              sessionStorage.removeItem("kotonoha.groqModel");
              toast("Chave removida desta sessão.");
            }}
          >
            Remover chave
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={loadModels}
            disabled={busy}
          >
            {busy ? "Buscando…" : "Validar Chave"}
          </Button>
        </div>
      </Card>

      {/* Zona de Perigo */}
      <Card className="space-y-4 md:col-span-2 border-danger/30 bg-danger-soft/10">
        <h3 className="text-lg font-bold text-danger">
          Recomeçar Progresso do Zero
        </h3>
        <p className="text-xs text-muted">
          Apaga todo o histórico local, cartões estudados e ofensiva deste
          navegador. Essa ação não pode ser desfeita.
        </p>
        <div>
          <Button
            variant="danger"
            onClick={() => {
              if (
                window.confirm(
                  "Tem certeza de que deseja apagar todo o progresso salvo neste navegador? Isso reiniciará o aplicativo ao estado inicial.",
                )
              ) {
                setState(initialState());
                toast("Progresso reiniciado.");
              }
            }}
          >
            Apagar todos os dados locais
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}
