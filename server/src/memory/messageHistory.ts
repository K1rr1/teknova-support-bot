import { BaseChatMessageHistory, InMemoryChatMessageHistory } from "@langchain/core/chat_history";

const store = new Map<string, InMemoryChatMessageHistory>();

export function getHistory(conversationId: string): BaseChatMessageHistory {
  let h = store.get(conversationId);
  if (!h) { h = new InMemoryChatMessageHistory(); store.set(conversationId, h); }
  return h;
}