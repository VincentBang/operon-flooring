-- Pin search_path for the product range updated_at trigger helper.
-- This is a security-advisor cleanup only; it preserves trigger behavior.

create or replace function public.operon_product_ranges_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
