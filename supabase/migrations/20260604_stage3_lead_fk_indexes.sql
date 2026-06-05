-- Cover Stage 3 lead foreign keys that are not already covered by dashboard indexes.

create index if not exists operon_floorplan_reviews_lead_id_idx
  on public.operon_floorplan_reviews (lead_id);

create index if not exists operon_follow_ups_lead_id_idx
  on public.operon_follow_ups (lead_id);

create index if not exists operon_lead_files_lead_id_idx
  on public.operon_lead_files (lead_id);

create index if not exists operon_lead_notes_lead_id_idx
  on public.operon_lead_notes (lead_id);
