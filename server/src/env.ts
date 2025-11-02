import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(5050),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE: z.string().optional(),
  SUPABASE_TABLE: z.string().default('docs'),
  OLLAMA_BASE_URL: z.string().url().default('http://127.0.0.1:11434'),
  OLLAMA_CHAT_MODEL: z.string().default('llama3.1'),
  OLLAMA_EMBED_MODEL: z.string().default('nomic-embed-text'),
  USE_SELF_QUERY: z.string().default('false')
});

export const env = schema.parse(process.env);