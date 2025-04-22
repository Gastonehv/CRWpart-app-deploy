-- Migration: Tabla para historial de modificaciones de perfil
create table if not exists profile_modifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  modified_at timestamptz not null,
  changes jsonb not null
);
