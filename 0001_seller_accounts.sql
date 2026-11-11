create extension if not exists pgcrypto;
create table if not exists public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null, country text not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.stores(
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null unique references auth.users(id) on delete cascade,
 name text not null, country text not null,
 status text not null default 'active' check(status in ('active','suspended')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists stores_owner_id_idx on public.stores(owner_id);

-- Auth inserts automatically create a seller profile and active shop: no manual approval queue.
create or replace function public.handle_new_seller()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
 n text; s text; c text;
begin
 n := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'NexaCart Seller');
 s := coalesce(nullif(trim(new.raw_user_meta_data ->> 'shop_name'), ''), n || chr(39) || 's Store');
 c := coalesce(nullif(trim(new.raw_user_meta_data ->> 'country'), ''), 'Not provided');
 insert into public.profiles(id,full_name,country) values(new.id,n,c) on conflict(id) do nothing;
 insert into public.stores(owner_id,name,country,status) values(new.id,s,c,'active') on conflict(owner_id) do nothing;
 return new;
end;
$$;
drop trigger if exists on_auth_user_created_nexacart on auth.users;
create trigger on_auth_user_created_nexacart after insert on auth.users for each row execute procedure public.handle_new_seller();

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
create policy "Sellers read own profile" on public.profiles for select to authenticated using((select auth.uid())=id);
create policy "Sellers update own profile" on public.profiles for update to authenticated using((select auth.uid())=id) with check((select auth.uid())=id);
create policy "Sellers read own store" on public.stores for select to authenticated using((select auth.uid())=owner_id);
create policy "Sellers update own store" on public.stores for update to authenticated using((select auth.uid())=owner_id) with check((select auth.uid())=owner_id);
-- No client insert policy: only the trusted auth trigger provisions seller rows.
