import React from 'react';
import {listRecoverySnapshots,MAX_RECOVERY_SNAPSHOTS} from '../../../shared/lib/recoverySnapshots.js';
import { Button, Card } from '../../../shared/ui/index.jsx';

function download(value, name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function AccountSync({ cloud, state }) {
  if (!cloud) return null;
  const { user, status, message, error, busy, remote, blocked } = cloud;
  const needsChoice = ['choose', 'conflict', 'receive'].includes(status);
  let recoveries = [];
  try { recoveries = listRecoverySnapshots(); } catch { /* Storage blocked: the app displays its recovery warning. */ }
  const downloadRecovery = (key, source) => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (!data?.[source]) { window.alert('Esta cópia não contém essa versão.'); return; }
      download(data[source], `kotonoha-recuperacao-${source}.json`);
    } catch { window.alert('Não foi possível ler esta cópia.'); }
  };
  const latestRecovery = recoveries[0] || null;
  const checkedAt = cloud.lastSync || remote?.updated_at;
  const choose = mode => {
    const text = mode === 'upload'
      ? 'Usar o progresso deste aparelho na conta? A versão da nuvem será substituída. Uma cópia das duas versões será guardada neste navegador.'
      : 'Usar o progresso da nuvem neste aparelho? O progresso local será substituído. Uma cópia das duas versões será guardada neste navegador.';
    if (window.confirm(text)) cloud.sync(mode);
  };
  return <Card className="space-y-3">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="min-w-0"><h2 className="text-lg font-bold text-ink-strong">{user ? 'Sua conta' : 'Continue em outro aparelho'}</h2>
        <p className="text-sm text-muted mt-1 [overflow-wrap:anywhere]">{user ? user.email || 'Conta pessoal' : 'Entre para sincronizar. Você também pode estudar sem conta.'}</p>
        {(user || blocked || status !== 'local') && <p role="status" aria-live="polite" className="font-bold text-sm text-ink-strong mt-2">{blocked ? 'Resolva o erro de armazenamento antes de sincronizar.' : message}</p>}
      </div>
      {user && <div className="flex flex-wrap gap-2 shrink-0"><Button variant="secondary" size="sm" disabled={busy || blocked || status === 'paused'} onClick={() => cloud.sync()}>{busy ? 'Verificando…' : 'Sincronizar agora'}</Button><Button variant="ghost" size="sm" disabled={busy} onClick={cloud.logout}>Sair da conta</Button></div>}
    </div>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    {!cloud.configured ? <p className="text-sm text-muted">Entrar com Google está indisponível no momento. Você pode continuar estudando neste aparelho.</p>
      : !user ? <Button onClick={cloud.login} disabled={busy || blocked}><svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" width="20" height="20" className="inline-block shrink-0 mr-2"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 5.38 6.51 13.22 2.56l7.98 6.19C11.43 13.72 17.22 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.31 5.48-4.85 7.18l7.73 6C44.33 38.03 46.98 31.88 46.98 24.55z"/><path fill="#FBBC05" d="M10.53 28.37A14.4 14.4 0 0 1 9.75 24c0-1.52.27-3 .76-4.37l-7.98-6.19A23.87 23.87 0 0 0 0 24c0 3.86.93 7.52 2.55 10.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.78 0-12.57-4.22-14.65-10.13l-7.98 6.19C5.38 41.49 14.62 48 24 48z"/></svg> {busy ? 'Abrindo login…' : 'Entrar com Google'}</Button>
      : <>
        {needsChoice && <div className="space-y-3 border-t border-line pt-4">
          <p className="text-sm text-ink">As versões não são mescladas automaticamente. Compare e baixe os backups antes de escolher. Enviar este aparelho também envia as anotações e o histórico que estão nele para a conta acima.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-raised p-4 space-y-3"><h3 className="font-bold">Neste aparelho</h3><p className="text-sm">{state.stats?.reviews || 0} revisões registradas</p><Button variant="secondary" onClick={() => download(state, 'kotonoha-local.json')}>Baixar versão local</Button><Button disabled={busy || blocked} onClick={() => choose('upload')}>Usar este aparelho</Button></div>
            <div className="rounded-xl bg-raised p-4 space-y-3"><h3 className="font-bold">Na nuvem</h3><p className="text-sm">{remote ? `${remote.payload.stats?.reviews || 0} revisões · ${new Date(remote.updated_at).toLocaleString('pt-BR')}` : 'Nenhum progresso enviado ainda.'}</p>{remote && <><Button variant="secondary" onClick={() => download(remote.payload, 'kotonoha-nuvem.json')}>Baixar versão da nuvem</Button><Button variant="secondary" disabled={busy || blocked} onClick={() => choose('download')}>Usar a nuvem</Button></>}</div>
          </div>
        </div>}
        {!needsChoice&&checkedAt&&<div className="rounded-xl border border-line bg-raised p-3 space-y-1" role="status">
          <p className="text-sm font-bold text-ink-strong">Último registro de sincronização</p>
          <p className="text-xs text-muted">{new Date(checkedAt).toLocaleString('pt-BR')}</p>
          <p className="text-xs text-muted">Seu progresso neste aparelho continua disponível mesmo sem internet.</p>
        </div>}
        <details className="border-t border-line pt-2"><summary className="cursor-pointer min-h-11 text-sm text-muted content-center">Como funciona a sincronização</summary>
          <p className="text-sm text-muted pb-2">Alterações são enviadas em até 30 segundos com o app aberto e conectado. Novas versões aparecem aqui para você receber. Sair mantém os dados neste aparelho.</p>
          {cloud.lastSync && <p className="text-xs text-muted">Última verificação: {new Date(cloud.lastSync).toLocaleString('pt-BR')}</p>}
        </details>
      </>}
    {latestRecovery&&<section className="space-y-3 border-t border-line pt-4" aria-labelledby="sync-recovery-title">
      <div className="space-y-1">
        <h3 id="sync-recovery-title" className="text-sm font-bold text-ink-strong">Cópia de segurança mais recente</h3>
        <p className="text-xs text-muted">Mantida somente neste navegador antes de substituir o progresso. O histórico guarda até {MAX_RECOVERY_SNAPSHOTS} cópias. Baixe uma cópia para guardar em outro lugar.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={()=>downloadRecovery(latestRecovery,'local')}>Baixar cópia do aparelho</Button>
        <Button variant="secondary" size="sm" onClick={()=>downloadRecovery(latestRecovery,'cloud')}>Baixar cópia da nuvem</Button>
      </div>
      {recoveries.length>1&&<details className="border-t border-line pt-2">
        <summary className="min-h-11 cursor-pointer text-sm font-bold text-ink-strong">Ver histórico ({recoveries.length-1})</summary>
        <ol className="mt-2 space-y-3">{recoveries.slice(1).map((key,index)=><li key={key} className="flex flex-wrap items-center gap-2 rounded-xl bg-raised p-3">
          <span className="text-xs text-muted mr-auto">Cópia anterior {index+1}</span>
          <Button variant="secondary" size="sm" onClick={()=>downloadRecovery(key,'local')}>Aparelho</Button>
          <Button variant="secondary" size="sm" onClick={()=>downloadRecovery(key,'cloud')}>Nuvem</Button>
        </li>)}</ol>
      </details>}
    </section>}
  </Card>;
}
