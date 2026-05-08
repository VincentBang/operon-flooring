-- Operon Flooring customer-facing quote reference numbers.
-- Purpose: keep UUIDs as internal IDs while displaying clean customer references
-- such as 352, 353, 354 in PDFs and emails.

create sequence if not exists public.operon_quote_reference_seq
  start with 352
  increment by 1
  no maxvalue
  cache 1;

alter table public.operon_quote_requests
  add column if not exists quote_reference bigint;

with missing_references as (
  select
    id,
    351 + row_number() over (order by created_at, id) as next_reference
  from public.operon_quote_requests
  where quote_reference is null
)
update public.operon_quote_requests quote_requests
set quote_reference = missing_references.next_reference
from missing_references
where quote_requests.id = missing_references.id;

alter table public.operon_quote_requests
  alter column quote_reference set default nextval('public.operon_quote_reference_seq'),
  alter column quote_reference set not null;

select setval(
  'public.operon_quote_reference_seq',
  greatest(
    351,
    coalesce((select max(quote_reference) from public.operon_quote_requests), 351)
  ),
  true
);

create unique index if not exists operon_quote_requests_reference_idx
  on public.operon_quote_requests(quote_reference);

comment on column public.operon_quote_requests.quote_reference is
  'Clean customer-facing quote reference number. Internal id remains UUID.';
