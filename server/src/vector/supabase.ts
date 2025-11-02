import { createClient } from '@supabase/supabase-js';
import { env } from '../env.js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OllamaPromptEmbeddings } from './ollamaPromptEmbeddings.js';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE ?? env.SUPABASE_ANON_KEY);

export const embeddings = new OllamaPromptEmbeddings ({
  model: env.OLLAMA_EMBED_MODEL,
  baseUrl: env.OLLAMA_BASE_URL
});

export async function getVectorStore() {
  return new SupabaseVectorStore(embeddings as any, {
    client: supabase,
    tableName: env.SUPABASE_TABLE,
    queryName: 'match_documents'
  });
}