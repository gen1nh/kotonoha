import React from 'react';
import Icon from '../../shared/ui/Icon.jsx';
import {Button} from '../../shared/ui/index.jsx';
import {useDialogFocus} from '../../shared/lib/index.js';

/** Only asks for preferences the application actually uses. No fictional personalization. */
export default function OnboardingModal({state,update,onClose,onComplete}) {
  useDialogFocus(onClose);
  const finish=()=>{update(s=>{s.onboardingCompleted=true;});onComplete?.();};
  return <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
    <section role="dialog" aria-modal="true" aria-labelledby="onboarding-title" className="w-full max-w-md rounded-3xl border border-line bg-paper p-5 sm:p-7 max-h-[90dvh] overflow-auto space-y-5">
      <div className="flex items-center justify-between gap-2"><span className="rounded-xl h-11 w-11 bg-accent-soft text-primary-strong flex items-center justify-center"><Icon name="learn" className="w-6 h-6"/></span><button type="button" onClick={onClose} className="min-h-11 min-w-11 flex justify-center items-center rounded-xl border border-line text-ink-strong" aria-label="Fechar orientação"><Icon name="close"/></button></div>
      <div className="space-y-2"><p className="text-xs text-primary-strong font-bold">SEJA BEM-VINDO AO KOTONOHA</p><h2 id="onboarding-title" className="text-2xl font-black text-ink-strong">Comece japonês sem se perder</h2><p className="text-sm text-muted">Você começa com uma lição curta. Depois, mostramos como praticar e o que fazer em seguida.</p></div>
      <p className="rounded-xl bg-raised p-4 text-sm text-ink-strong">Você não precisa montar um plano de estudos. Vamos mostrar a próxima atividade, uma por vez.</p>
      <Button variant="primary" size="lg" className="w-full" onClick={finish}>Começar a aprender →</Button>
      <button type="button" className="min-h-11 w-full text-sm font-semibold text-muted" onClick={onClose}>Agora não</button>
    </section>
  </div>;
}
