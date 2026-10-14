import React from 'react';
import { Button } from '../../../shared/ui/index.jsx';
import { playSound, useSoundSettings, setSoundSettings } from '../../../shared/audio/index.js';

export function SoundSettings({ toast }) {
  const settings = useSoundSettings();
  const change = patch => { if (!setSoundSettings(patch)) toast('Áudio ajustado nesta sessão. Não foi possível salvar a preferência.'); };
  return <div className="space-y-4 border-t border-line pt-5">
    <label className="flex items-center justify-between gap-4 min-h-11 cursor-pointer">
      <span><span className="block font-bold text-ink-strong">Efeitos sonoros</span><span className="block text-sm text-muted mt-1">Acertos, tentativas e conclusão. A pronúncia tem áudio independente.</span></span>
      <input type="checkbox" role="switch" aria-label="Efeitos sonoros" checked={settings.enabled} onChange={e => change({ enabled: e.target.checked })} className="h-6 w-6 shrink-0 accent-primary" />
    </label>
    {settings.enabled && <div className="space-y-3">
      <label className="block text-sm font-bold text-ink-strong">Volume dos efeitos · {Math.round(settings.volume * 100)}%
        <input aria-label="Volume dos efeitos" type="range" min="0" max="100" step="5" value={Math.round(settings.volume * 100)} onChange={e => change({ volume: Number(e.target.value) / 100 })} className="block w-full min-h-11 accent-primary" />
      </label>
      <details><summary className="cursor-pointer min-h-11 content-center text-sm font-bold text-ink-strong">Experimentar sons</summary><div className="flex flex-wrap gap-2 pt-2" aria-label="Experimentar efeitos">{[['correct', 'Ouvir acerto'], ['incorrect', 'Ouvir tentativa'], ['complete', 'Ouvir conclusão']].map(([name, label]) => <Button key={name} variant="secondary" size="sm" disabled={settings.volume === 0} onClick={() => playSound(name)}>{label}</Button>)}</div></details>
    </div>}
  </div>;
}
