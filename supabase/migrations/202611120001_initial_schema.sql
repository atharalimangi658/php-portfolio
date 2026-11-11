create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  title text not null,
  subtitle text not null,
  image text,
  description text not null,
  tags jsonb not null default '[]'::jsonb,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.certificates (
  id text primary key,
  title text not null,
  issuer text not null,
  role text not null,
  event text,
  image text,
  description text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  "receivedAt" timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.messages enable row level security;

-- No public policies are intentionally created. The portfolio API uses the server-only
-- Supabase secret key, so browser users cannot read or write database records directly.
