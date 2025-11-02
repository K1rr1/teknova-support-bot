create extension if not exists vector;

create table if not exists docs (
  id bigint generated always as identity primary key,
  content text not null,
  metadata jsonb,
  embedding vector(768)
);

create index if not exists docs_embedding_idx on docs using ivfflat (embedding vector_cosine_ops);
create index if not exists docs_metadata_idx on docs using gin (metadata);
