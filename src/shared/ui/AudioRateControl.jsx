import React from 'react';

const SPEEDS = [
  [0.5, '0,5× · Bem devagar'],[0.75, '0,75× · Devagar'],
  [0.85, '0,85× · Estudo'],[1, '1× · Normal'],[1.15, '1,15× · Rápido'],
];

/** Per-activity speed; never overwrites the user's global default. */
export default function AudioRateControl({rate,onChange,defaultRate=0.85,label='Velocidade deste áudio'}) {
  return <div className="space-y-2">
    <label className="block text-xs font-bold text-ink-strong">{label}
      <select value={rate} onChange={event=>onChange(Number(event.target.value))}
        className="mt-1 min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-ink-strong" aria-label={label}>
        {SPEEDS.map(([value,name])=><option key={value} value={value}>{name}</option>)}
      </select>
    </label>
    {rate!==defaultRate&&<button type="button" className="min-h-10 text-xs font-bold text-primary-strong underline" onClick={()=>onChange(defaultRate)}>Usar velocidade padrão ({defaultRate}×)</button>}
    <p className="text-xs text-muted">Ajuste apenas desta atividade. O padrão geral fica em Preferências.</p>
  </div>;
}
