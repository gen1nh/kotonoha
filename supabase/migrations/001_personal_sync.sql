-- Run once in the Supabase SQL Editor. No study content or existing data is deleted.
begin;
create table if not exists public.kotonoha_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 5242880),
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);
alter table public.kotonoha_progress enable row level security;
revoke all on public.kotonoha_progress from anon, authenticated;
grant select on public.kotonoha_progress to authenticated;
drop policy if exists own_progress on public.kotonoha_progress;
create policy own_progress on public.kotonoha_progress for select to authenticated
using ((select auth.uid()) = user_id);

-- Only this function can write. A revision mismatch refuses the update atomically.
create or replace function public.save_kotonoha_progress(expected_revision bigint, new_payload jsonb)
returns setof public.kotonoha_progress
language plpgsql security definer set search_path = '' as $$
declare current_user_id uuid := auth.uid();
begin
  if current_user_id is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  if expected_revision = 0 then
    return query insert into public.kotonoha_progress(user_id, payload)
      values (current_user_id, new_payload) on conflict (user_id) do nothing returning *;
  else
    return query update public.kotonoha_progress
      set payload = new_payload, revision = revision + 1, updated_at = now()
      where user_id = current_user_id and revision = expected_revision returning *;
  end if;
end;
$$;
revoke all on function public.save_kotonoha_progress(bigint, jsonb) from public, anon;
grant execute on function public.save_kotonoha_progress(bigint, jsonb) to authenticated;
commit;
