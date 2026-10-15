import React, { useState, useRef } from "react";
import { SoundSettings } from './SoundSettings.jsx';
import { AccountSync } from './AccountSync.jsx';
import { Card, Button } from "../../../shared/ui/index.jsx";
import { PageHeading } from "../../../shared/ui/index.jsx";
import { todayKey, initialState, normalizeState } from "../../../entities/study/index.js";
import { dailyGoal, GOAL_OPTIONS } from "../../../entities/study/index.js";
export function Settings({ state, setState, toast, update, changeLevel, theme, setTheme, install, installPrompt, onOpenOnboarding, cloud }) {
  const [key, setKey] = useState(
    () => { try{return sessionStorage.getItem("kotonoha.groqKey") || "";}catch{return "";} },
  );
  const [model, setModel] = useState(
    () => {try{return sessionStorage.getItem("kotonoha.groqModel") || "";}catch{return "";}},
  );
  const [models, setModels] = useState(() => (model ? [model] : []));
  const [busy, setBusy] = useState(false);
  const importInput = useRef(null);
  const [section,setSection]=useState("study");

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
      const summary = `Backup válido\nNível: ${imported.selectedLevel}\nRevisões no arquivo: ${incoming}\nRevisões atuais: ${previous}\n\nA importação SUBSTITUI todo o progresso deste navegador. Exporte o backup atual antes de continuar.${cloud?.user ? '\nVocê está conectado: o progresso importado também poderá substituir a versão na nuvem.' : ''}\n\nDeseja importar?`;
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
      <PageHeading title="Preferências" description="Seu ritmo, sua conta e os ajustes do aplicativo." icon="settings" iconBg="bg-raised" iconColor="text-ink-strong" />
      <nav aria-label="Seções de preferências" className="flex gap-2 overflow-x-auto pb-1">
        {[["study","Estudo e sons"],["account","Conta e backups"],["advanced","Mais opções"]].map(([id,label])=><button type="button" key={id} aria-current={section===id?"page":undefined} onClick={()=>setSection(id)} className={`shrink-0 min-h-11 rounded-xl px-4 text-sm font-bold border-2 ${section===id?"border-primary bg-accent-soft text-primary-strong":"border-line bg-paper text-ink-strong"}`}>{label}</button>)}
      </nav>
      {section==="account"&&<AccountSync cloud={cloud} state={state} />}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {section==="study"&&<Card className="space-y-5">
          <div><h2 className="text-lg font-bold text-ink-strong">Seu jeito de estudar</h2><p className="text-sm text-muted mt-1">Ajustes salvos automaticamente.</p></div>
          <label className="block text-sm font-bold text-ink-strong">Meta diária de atividades
            <select aria-label="Meta diária de atividades" className="mt-2 min-h-12 w-full rounded-xl border border-line bg-paper text-ink-strong px-3" value={dailyGoal(state)} onChange={e=>update(s=>{s.dailyActivityGoal=Number(e.target.value);})}>{GOAL_OPTIONS.map(n=><option key={n} value={n}>{n} {n===1?'atividade':'atividades'} por dia</option>)}</select>
          </label>
          <p className="text-xs text-muted">Uma atividade é uma microlição concluída, o desafio do dia, um checkpoint aprovado ou uma sessão de revisão. Repetir a mesma etapa não aumenta sua meta.</p>
          <label className="block text-sm font-bold text-ink-strong">Tema visual
            <select aria-label="Tema visual" className="mt-2 min-h-12 w-full rounded-xl border border-line bg-paper text-ink-strong px-3" value={theme} onChange={e=>setTheme(e.target.value)}><option value="system">Usar tema do dispositivo</option><option value="light">Claro</option><option value="dark">Escuro</option></select>
          </label>
          <SoundSettings toast={toast} />
        </Card>}
        <div className="space-y-4">
          {section==="account"&&<Card className="space-y-4">
            <h2 className="text-lg font-bold text-ink-strong">Seus dados</h2>
            <p className="text-sm text-muted">Guarde uma cópia independente do seu progresso.</p>
            <Button variant="secondary" onClick={exportBackup}>Exportar backup JSON</Button>
            <details className="border-t border-line pt-2">
              <summary className="cursor-pointer min-h-11 flex items-center text-sm font-bold text-ink-strong">Importar um backup</summary>
              <p className="text-sm text-muted mb-3">A importação substitui o progresso atual. Exporte uma cópia antes de continuar.</p>
              <Button variant="secondary" onClick={()=>importInput.current?.click()}>Escolher arquivo de backup</Button>
            </details>
            <input ref={importInput} type="file" accept="application/json" hidden onChange={importBackup} />
          </Card>}
          {section==="advanced"&&<details className="rounded-2xl border-2 border-line bg-paper p-5 sm:p-6">
            <summary className="cursor-pointer min-h-11 text-ink-strong font-bold">Assistente de IA <span className="font-normal text-sm text-muted">· opcional</span></summary>
            <div className="pt-4">      <div className="space-y-4">
        <h3 className="text-lg font-bold text-ink">
          Conectar assistente de IA
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
      </div>

</div>
          </details>}
          {section==="advanced"&&<details className="rounded-2xl border-2 border-line bg-paper p-5 sm:p-6">
            <summary className="cursor-pointer min-h-11 text-ink-strong font-bold">Ajuda e gerenciamento</summary>
            <div className="pt-4 space-y-5">
              <div className="flex flex-wrap gap-3">{onOpenOnboarding&&<Button variant="secondary" onClick={onOpenOnboarding}>Ver orientação</Button>}{installPrompt&&<Button variant="secondary" onClick={install}>Instalar aplicativo neste dispositivo</Button>}</div>
              <details className="border-t border-line pt-3"><summary className="cursor-pointer min-h-11 text-sm font-bold text-danger">Reiniciar progresso</summary><div className="pt-3">      <div className="space-y-4">
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
            disabled={Boolean(cloud?.user)}
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
          {cloud?.user && <p className="text-sm text-muted mt-2">Saia da conta antes de reiniciar o progresso local. Isso evita enviar um reinício para seus outros aparelhos.</p>}
        </div>
      </div></div></details>
            </div>
          </details>}
        </div>
      </div>
    </div>
  );
}
