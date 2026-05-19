insert into storage.buckets (id, name, public)
values ('demo-uploads', 'demo-uploads', true)
on conflict (id) do nothing;

create policy "Public can upload demo files"
on storage.objects
for insert
to public
with check (bucket_id = 'demo-uploads');

create policy "Public can read demo files"
on storage.objects
for select
to public
using (bucket_id = 'demo-uploads');
