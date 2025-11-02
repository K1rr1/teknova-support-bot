import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { SYSTEM_PROMPT } from "../prompts/systemPrompt.js";
import { getVectorStore } from "../vector/supabase.js";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import type { BaseChatMessageHistory } from "@langchain/core/chat_history";
import type { Document } from "@langchain/core/documents";
import { env } from "../env.js";

function formatDocsAsString(docs: Document[]) {
  return docs
    .map((d, i) => {
      const src =
        typeof d.metadata?.source !== "undefined"
          ? ` [${d.metadata.source}${d.metadata?.chunk ? `#${d.metadata.chunk}` : ""}]`
          : "";
      return `--- Doc ${i + 1}${src} ---\n${d.pageContent}`;
    })
    .join("\n\n");
}

export async function buildRagChain(getHistoryFn: (id: string) => BaseChatMessageHistory) {
  const vs = await getVectorStore();

// Standard-retriever
let retriever = vs.asRetriever({ k: 4 });




  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    new MessagesPlaceholder("history"),
    [
      "human",
      "Fråga: {question}\n\nRelevanta utdrag (om några):\n{context}\n\nSvara tydligt och inkludera källor om du använde utdragen.",
    ],
  ]);

  const llm = new ChatOllama({
    model: process.env.OLLAMA_CHAT_MODEL!,
    baseUrl: process.env.OLLAMA_BASE_URL,
  });

const chainCore = RunnableSequence.from([
  {
    context: retriever.pipe((docs: Document[]) => formatDocsAsString(docs)),
   
    question: (input: any) => input.question,
    history:  (input: any) => input.history ?? [], 
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

const withHistory = new RunnableWithMessageHistory({
  runnable: chainCore,
  getMessageHistory: getHistoryFn,
  inputMessagesKey: "question",
  historyMessagesKey: "history",
});

return withHistory;

}