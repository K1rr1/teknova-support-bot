import fs from 'node:fs/promises';
import path from 'node:path';
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from "../vector/supabase.js";

/**
 * Usage: put your Azomo text file under server/data/faq_policies.txt then run `pnpm ingest`
 */
async function main() {
  const filePath = path.resolve(process.cwd(), 'data/faq_policies.txt');
  const raw = await fs.readFile(filePath, 'utf8');

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 120 });
  const docs = (await splitter.splitDocuments([
    new Document({ pageContent: raw, metadata: { source: 'faq_policies.txt', topic: 'TechNova' } })
  ])).map((d, i) => { d.metadata = { ...d.metadata, chunk: i + 1 }; return d; });

  const vs = await getVectorStore();
  await vs.addDocuments(docs);
  console.log(`Ingested ${docs.length} chunks.`);
}

main().catch((e) => { console.error(e); process.exit(1); });