import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../shared/auth/index.js';
import { KEY, normalizeState } from '../../entities/study/index.js';
import { fingerprint, syncDecision } from './syncDecision.js';

const META = 'kotonoha.sync.v1';
export const RECOVERY_PREFIX = 'kotonoha.sync.recovery.';
const messages = {
  local: 'Somente neste aparelho', loading: 'Verificando conta…', syncing: 'Sincronizando…',
  synced: 'Sincronizado', pending: 'Alterações aguardando envio', offline: 'Sem conexão. Seu estudo continua salvo neste aparelho.',
  choose: 'Escolha o progresso para esta conta', conflict: 'Há alterações nos dois aparelhos. Escolha qual versão manter.',
  receive: 'Há uma versão mais recente na nuvem', paused: 'Sincronização pausada nesta aba. Recarregue para continuar.',
};

export function useCloudSync({ state, setState, blocked }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(supabase ? 'loading' : 'local');
  const [error, setError] = useState('');
  const [remote, setRemote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const latest = useRef(state); latest.current = state;
  const userRef = useRef(null);
  const running = useRef(false);
  const paused = useRef(false);
  const generation = useRef(0);
  const meta = useRef(null);
  const runRef = useRef(null);
  const blockedRef = useRef(blocked); blockedRef.current = blocked;

  useEffect(() => {
    try { meta.current = JSON.parse(localStorage.getItem(META)); } catch { meta.current = null; }
    if (!supabase) return;
    let alive = true;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      const next = session?.user || null;
      if (userRef.current?.id !== next?.id) {
        generation.current++;
        userRef.current = next;
        setRemote(null); setError(''); setUser(next); setStatus(next ? 'pending' : 'local');
      } else if (!next) setStatus('local');
    });
    // No async Supabase calls inside onAuthStateChange (its auth lock is held).
    const onStorage = e => {
      if ([KEY, META].includes(e.key)) { paused.current = true; generation.current++; setStatus('paused'); }
    };
    window.addEventListener('storage', onStorage);
    const params = new URLSearchParams(location.search);
    if (params.has('error') || new URLSearchParams(location.hash.slice(1)).has('error')) {
      setError('O login não foi concluído. Tente entrar novamente.');
      history.replaceState(null, '', location.pathname + '?view=settings');
    }
    return () => { alive = false; generation.current++; data.subscription.unsubscribe(); window.removeEventListener('storage', onStorage); };
  }, []);

  function saveBase(row, account) {
    const next = { owner: account, base: { revision: row.revision, fingerprint: fingerprint(row.payload) } };
    localStorage.setItem(META, JSON.stringify(next));
    meta.current = next;
    setLastSync(new Date().toISOString());
  }
  function preserve(local, cloud) {
    const key = RECOVERY_PREFIX + new Date().toISOString() + '.' + crypto.randomUUID();
    localStorage.setItem(key, JSON.stringify({ createdAt: new Date().toISOString(), local, cloud: cloud?.payload || null }));
  }

  async function sync(choice = null) {
    const account = userRef.current?.id;
    if (!supabase || !account || running.current || paused.current || blockedRef.current) return;
    if (!navigator.onLine) { setStatus('offline'); return; }
    running.current = true; setBusy(true); setError(''); setStatus('syncing');
    const epoch = generation.current;
    const valid = () => epoch === generation.current && account === userRef.current?.id && !blockedRef.current;
    try {
      const { data: row, error: readError } = await supabase.from('kotonoha_progress').select('payload,revision,updated_at').eq('user_id', account).maybeSingle().abortSignal(AbortSignal.timeout(15000));
      if (readError) throw readError;
      if (!valid()) return;
      // Reject future/invalid backups before offering them as a replacement.
      if (row) normalizeState(row.payload);
      setRemote(row);
      const local = structuredClone(latest.current);
      let decision = syncDecision({ ...meta.current, local, remote: row, userId: account });
      if (choice) {
        // The user chose the version they saw, not a newer unseen version.
        if ((row?.revision || 0) !== (remote?.revision || 0)) { setStatus('conflict'); return; }
        preserve(local, row); // Storage failure aborts replacement, never discards data.
        decision = choice;
      }
      if (decision === 'download') {
        if (!row) throw new Error('Não há progresso na nuvem para receber.');
        const next = normalizeState(row.payload);
        localStorage.setItem(KEY, JSON.stringify(next));
        saveBase(row, account);
        latest.current = next; setState(next); setStatus('synced');
      } else if (decision === 'send' || decision === 'upload') {
        // Persist pending work before starting the request; reopening retries safely.
        localStorage.setItem(KEY, JSON.stringify(local));
        const { data, error: writeError } = await supabase.rpc('save_kotonoha_progress', {
          expected_revision: row?.revision || 0, new_payload: local,
        }).abortSignal(AbortSignal.timeout(15000));
        if (writeError) throw writeError;
        if (!valid()) return;
        if (!data?.length) { setStatus('conflict'); return; }
        saveBase(data[0], account); setRemote(data[0]);
        setStatus(fingerprint(latest.current) === fingerprint(local) ? 'synced' : 'pending');
      } else if (decision === 'equal') {
        saveBase(row, account); setStatus('synced');
      } else setStatus(decision);
    } catch (e) {
      if (!valid()) return;
      setStatus(navigator.onLine ? 'error' : 'offline');
      setError(e.code === 'PGRST205' || e.code === '42P01' || e.code === 'PGRST202'
        ? 'O banco ainda precisa ser preparado. Execute o script 001_personal_sync.sql no Supabase.'
        : e.name === 'QuotaExceededError' ? 'Sem espaço para a cópia de segurança. Exporte seu backup antes de continuar.'
        : 'Não foi possível sincronizar. Seus dados locais foram mantidos. Confira a conexão e tente novamente.');
    } finally { running.current = false; setBusy(false); }
  }
  runRef.current = sync;

  useEffect(() => {
    if (!user) return;
    const tick = () => { if (document.visibilityState === 'visible') runRef.current?.(); };
    const timer = setTimeout(tick, 1000);
    const interval = setInterval(tick, 30000);
    window.addEventListener('online', tick);
    const offline = () => setStatus('offline');
    window.addEventListener('offline', offline);
    document.addEventListener('visibilitychange', tick);
    return () => { clearTimeout(timer); clearInterval(interval); window.removeEventListener('online', tick); window.removeEventListener('offline', offline); document.removeEventListener('visibilitychange', tick); };
  }, [user?.id]);

  async function login() {
    setError(''); setBusy(true);
    try {
      localStorage.setItem(KEY, JSON.stringify(latest.current));
      const { error: authError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: {
        redirectTo: location.origin + location.pathname + '?view=settings',
      } });
      if (authError) throw authError;
    } catch { setError('Não foi possível entrar. Verifique se o Google e a URL de retorno estão configurados no Supabase.'); }
    finally { setBusy(false); }
  }
  async function logout() {
    if (running.current) return;
    setBusy(true); setError(''); generation.current++;
    try {
      const { error: authError } = await supabase.auth.signOut({ scope: 'local' });
      if (authError) throw authError;
      localStorage.removeItem(META); meta.current = null;
    } catch { setError('Não foi possível concluir a saída. Tente novamente.'); }
    finally { setBusy(false); }
  }
  const dirty = user && meta.current?.owner === user.id && meta.current?.base && fingerprint(state) !== meta.current.base.fingerprint;
  const displayed = status === 'synced' && dirty ? 'pending' : status;
  return { configured: Boolean(supabase), user, status: displayed, message: messages[displayed] || 'Sincronização indisponível',
    error, busy, remote, lastSync, blocked, sync, login, logout };
}
