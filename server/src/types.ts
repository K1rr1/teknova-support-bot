export type ChatRequest = { message: string; conversationId?: string };
export type ChatResponse = { answer: string; sources: Array<{ source?: string; chunk?: number }> };