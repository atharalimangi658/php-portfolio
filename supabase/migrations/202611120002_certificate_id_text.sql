-- The original portfolio certificates use readable IDs such as "systemx" and "ieee".
-- Keep that compatibility while allowing newly created certificates to use UUID strings.
alter table public.certificates alter column id drop default;
alter table public.certificates alter column id type text using id::text;
