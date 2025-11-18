-- Create formsnap_submissions table matching the Python backend
create table if not exists public.formsnap_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  parsed jsonb not null,
  raw_text text,
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.formsnap_submissions enable row level security;

-- Allow public access (adjust for production)
create policy "Allow public insert" on public.formsnap_submissions
  for insert with check (true);

create policy "Allow public select" on public.formsnap_submissions
  for select using (true);

-- Create storage bucket for PDFs
insert into storage.buckets (id, name, public)
values ('formsnap-pdfs', 'formsnap-pdfs', true)
on conflict (id) do nothing;

-- Allow public access to bucket
create policy "Allow public uploads" on storage.objects
  for insert with check (bucket_id = 'formsnap-pdfs');

create policy "Allow public downloads" on storage.objects
  for select using (bucket_id = 'formsnap-pdfs');
