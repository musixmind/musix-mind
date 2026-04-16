create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  artist_name text not null,
  email text not null,
  track_title text not null,
  genre text not null,
  language text not null,
  track_link text not null,
  message text default '',
  status text not null default 'pending',
  upload_url text,
  plays integer not null default 0,
  created_at timestamptz not null default now()
);

alter table submissions enable row level security;

create policy "Service role can manage submissions"
on submissions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
