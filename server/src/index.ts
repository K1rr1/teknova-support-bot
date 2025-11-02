import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { buildRagChain } from './chains/ragChain.js';
import { getHistory } from './memory/messageHistory.js';
import type { ChatRequest, ChatResponse } from './types.js';
import { z } from 'zod';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';

const app = express();
app.use(cors());
app.use(express.json());

function isOnTopic(q: string) {
  const allow = /(technova|produkt|leverans|frakt|garanti|retur|policy|faq|beställ|order)/i;
  return allow.test(q);
}

const chainPromise = buildRagChain(getHistory);

app.get('/health', (_, res) => { res.json({ ok: true }); });

app.post('/api/chat', async (req, res) => {
  const { message, conversationId = 'default' } = req.body as ChatRequest;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message required' });
  }

  if (!isOnTopic(message)) {
    const answer = 'Jag kan tyvärr bara svara på frågor om TechNova AB, våra produkter, leveranser, garantier och information i våra FAQ/policydokument. Prova gärna att ställa en sådan fråga!';
    const payload: ChatResponse = { answer, sources: [] };
    return res.json(payload);
  }

const chain = await chainPromise;
const answer = await chain.invoke(
  { question: message },                        // no 'history' here
  { configurable: { sessionId: conversationId } }
);



  const { getVectorStore } = await import('./vector/supabase.js');
  const vs = await getVectorStore();
  const retriever = vs.asRetriever({ k: 4 });
  const docs = await retriever.getRelevantDocuments(message);
  const sources = docs.map(d => ({ source: String(d.metadata?.source ?? 'okänd'), chunk: Number(d.metadata?.chunk ?? 0) }));

  const payload: ChatResponse = { answer, sources };
  res.json(payload);
});

// Admin upload & ingest text directly
app.post('/api/admin/ingestText', async (req, res) => {
  const schema = z.object({
    filename: z.string().default('uploaded.txt'),
    content: z.string().min(1, 'content required'),
    metadata: z.record(z.any()).optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { filename, content, metadata } = parsed.data;
  try {
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 120 });
    const baseMeta = { source: filename, ...metadata };
    const docs = (await splitter.splitDocuments([
      new Document({ pageContent: content, metadata: baseMeta })
    ])).map((d, i) => { d.metadata = { ...d.metadata, chunk: i + 1 }; return d; });

    const { getVectorStore } = await import('./vector/supabase.js');
    const vs = await getVectorStore();
    await vs.addDocuments(docs);
    res.json({ ok: true, chunks: docs.length });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e?.message ?? 'ingest failed' });
  }
});

app.get('/', (_, res) => { res.send('TechNova Support Bot API running'); });

app.listen(env.PORT, () => {
  console.log(`API on http://localhost:${env.PORT}`);
});