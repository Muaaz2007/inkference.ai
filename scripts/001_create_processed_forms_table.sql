-- Create processed_forms table to store form processing results
create table if not exists public.processed_forms (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  form_type text not null,
  detection_confidence numeric not null,
  fields jsonb not null,
  validation jsonb not null,
  original_image_url text,
  pdf_url text,
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS (no user auth for now, but good practice)
alter table public.processed_forms enable row level security;

-- Allow anyone to insert and read (adjust based on auth requirements)
create policy "Allow public insert" on public.processed_forms
  for insert with check (true);

create policy "Allow public select" on public.processed_forms
  for select using (true);
