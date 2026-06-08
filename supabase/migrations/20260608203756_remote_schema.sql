create extension if not exists "pg_cron" with schema "pg_catalog";

drop extension if exists "pg_net";

alter table "public"."documents" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding public.vector, match_threshold double precision, match_count integer)
 RETURNS TABLE(id bigint, content text, metadata jsonb, similarity double precision)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT
    id,
    content,
    metadata,
    1 - (embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$function$
;


  create policy "Allow read for anon users"
  on "public"."documents"
  as permissive
  for select
  to anon
using (true);



  create policy "Allow read for authenticated users"
  on "public"."documents"
  as permissive
  for select
  to authenticated
using (true);



