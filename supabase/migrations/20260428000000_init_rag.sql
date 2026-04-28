-- Enable pgvector
create extension if not exists vector;

-- Documents table
create table if not exists documents (
  id        bigserial primary key,
  content   text        not null,
  metadata  jsonb       default '{}',
  embedding vector(3072) not null
);

-- Cosine similarity search RPC
create or replace function match_documents(
  query_embedding vector(3072),
  match_threshold float,
  match_count     int
)
returns table (
  id         bigint,
  content    text,
  metadata   jsonb,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
  from documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
