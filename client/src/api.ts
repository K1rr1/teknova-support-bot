const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5050';

export async function chat(message: string, conversationId: string) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationId })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ answer: string; sources: { source?: string; chunk?: number }[] }>;
}

export async function ingestText(payload: { filename?: string; content: string; metadata?: Record<string, any> }) {
  const res = await fetch(`${API_URL}/api/admin/ingestText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ ok: boolean; chunks: number }>;
}