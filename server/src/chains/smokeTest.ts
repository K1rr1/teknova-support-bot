import { buildRagChain } from './ragChain.js';
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';

async function main() {
  const histMap = new Map<string, InMemoryChatMessageHistory>();
  const chain = await buildRagChain((id: string) => {
    let h = histMap.get(id);
    if (!h) { h = new InMemoryChatMessageHistory(); histMap.set(id, h); }
    return h;
  });
  const q = process.argv.slice(2).join(' ') || 'Vad gäller för ångerrätt?';
  const ans = await chain.invoke({ question: q }, { configurable: { sessionId: 'smoke' } });
  console.log('\nQuestion:', q, '\n');
  console.log('Answer:\n', ans);
}
main().catch(e => { console.error(e); process.exit(1); });