import React,{useState} from 'react';
import Icon from '../../shared/ui/Icon.jsx';
import {Button} from '../../shared/ui/index.jsx';
import {useDialogFocus} from '../../shared/lib/index.js';

/** Only asks for preferences the application actually uses. No fictional personalization. */
export default function OnboardingModal({state,update,onClose,onComplete}) {
  useDialogFocus(onClose);
  const [goal,setGoal]=useState([1,2,3].includes(state.dailyActivityGoal)?state.dailyActivityGoal:2);
  const finish=()=>{update(s=>{s.dailyActivityGoal=goal;s.onboardingCompleted=true;});onComplete?.();};
  return <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
    <section role="dialog" aria-modal="true" aria-labelledby="onboarding-title" className="w-full max-w-md rounded-3xl border border-line bg-paper p-5 sm:p-7 max-h-[90dvh] overflow-auto space-y-5">
      <div className="flex items-center justify-between gap-2"><span className="rounded-xl h-11 w-11 bg-accent-soft text-primary-strong flex items-center justify-center"><Icon name="learn" className="w-6 h-6"/></span><button type="button" onClick={onClose} className="min-h-11 min-w-11 flex justify-center items-center rounded-xl border border-line text-ink-strong" aria-label="Fechar orientação"><Icon name="close"/></button></div>
      <div className="space-y-2"><p className="text-xs text-primary-strong font-bold">SEJA BEM-VINDO AO KOTONOHA</p><h2 id="onboarding-title" className="text-2xl font-black text-ink-strong">Comece japonês sem se perder</h2><p className="text-sm text-muted">A Trilha mostrará a próxima lição. Depois você pratica com cartões e valida com um checkpoint. As ferramentas extras ficam disponíveis em Praticar.</p></div>
      <div className="rounded-xl bg-raised p-4 space-y-1"><p className="font-bold text-ink-strong">Sua meta diária</p><p className="text-sm text-muted">Escolha quantas atividades deseja concluir. Você pode alterar depois em Preferências.</p></div>
      <div role="radiogroup" aria-label="Atividades diárias" className="grid grid-cols-3 gap-2">
        {[1,2,3].map(n=><button type="button" role="radio" aria-checked={goal===n} key={n} onClick={()=>setGoal(n)} className={`min-h-16 border-2 rounded-xl text-sm font-bold ${goal===n?'border-primary bg-accent-soft text-primary-strong':'border-line bg-paper text-ink-strong'}`}><span className="block text-xl">{n}</span><span>{n===1?'Leve':n===2?'Regular':'Intenso'}</span></button>)}
      </div>
      <Button variant="primary" size="lg" className="w-full" onClick={finish}>Começar pela Trilha →</Button>
      <button type="button" className="min-h-11 w-full text-sm font-semibold text-muted" onClick={onClose}>Agora não</button>
    </section>
  </div>;
}
