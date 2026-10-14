import React from 'react';
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
  try { recoveries = Object.keys(localStorage).filter(k => k.startsWith('kotonoha.sync.recovery.')).sort().reverse(); } catch { /* Storage blocked: the app displays its recovery warning. */ }
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
    {!cloud.configured ? <p className="text-sm text-muted">A conexão com o Supabase ainda não foi configurada neste ambiente.</p>
      : !user ? <Button onClick={cloud.login} disabled={busy || blocked}>{busy ? 'Abrindo login…' : 'Entrar com Google'}</Button>
      : <>
        {needsChoice && <div className="space-y-3 border-t border-line pt-4">
          <p className="text-sm text-ink">As versões não são mescladas automaticamente. Compare e baixe os backups antes de escolher. Enviar este aparelho também envia as anotações e o histórico que estão nele para a conta acima.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-raised p-4 space-y-3"><h3 className="font-bold">Neste aparelho</h3><p className="text-sm">{state.stats?.reviews || 0} revisões registradas</p><Button variant="secondary" onClick={() => download(state, 'kotonoha-local.json')}>Baixar versão local</Button><Button disabled={busy || blocked} onClick={() => choose('upload')}>Usar este aparelho</Button></div>
            <div className="rounded-xl bg-raised p-4 space-y-3"><h3 className="font-bold">Na nuvem</h3><p className="text-sm">{remote ? `${remote.payload.stats?.reviews || 0} revisões · ${new Date(remote.updated_at).toLocaleString('pt-BR')}` : 'Nenhum progresso enviado ainda.'}</p>{remote && <><Button variant="secondary" onClick={() => download(remote.payload, 'kotonoha-nuvem.json')}>Baixar versão da nuvem</Button><Button variant="secondary" disabled={busy || blocked} onClick={() => choose('download')}>Usar a nuvem</Button></>}</div>
          </div>
        </div>}
        <details className="border-t border-line pt-2"><summary className="cursor-pointer min-h-11 text-sm text-muted content-center">Como funciona a sincronização</summary>
          <p className="text-sm text-muted pb-2">Alterações são enviadas em até 30 segundos com o app aberto e conectado. Novas versões aparecem aqui para você receber. Sair mantém os dados neste aparelho.</p>
          {cloud.lastSync && <p className="text-xs text-muted">Última verificação: {new Date(cloud.lastSync).toLocaleString('pt-BR')}</p>}
        </details>
      </>}
    {recoveries.length > 0 && <details className="border-t border-line pt-3"><summary className="cursor-pointer font-bold text-sm">Cópias anteriores à sincronização ({recoveries.length})</summary><div className="space-y-3 mt-3">{recoveries.map((key, i) => <div key={key} className="flex flex-wrap items-center gap-2"><span className="text-xs text-muted">Cópia {recoveries.length - i}</span>{['local', 'cloud'].map(source => <Button key={source} size="sm" variant="secondary" onClick={() => { try { const data = JSON.parse(localStorage.getItem(key)); if (data[source]) download(data[source], `kotonoha-recuperacao-${source}.json`); else window.alert('Esta cópia não tinha uma versão na nuvem.'); } catch { window.alert('Não foi possível ler esta cópia.'); } }}>Baixar {source === 'local' ? 'aparelho' : 'nuvem'}</Button>)}</div>)}</div></details>}
  </Card>;
}
