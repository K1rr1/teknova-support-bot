
export class OllamaPromptEmbeddings {
  constructor(
    private opts: { model: string; baseUrl: string }
  ) {}

  private async embedOne(text: string): Promise<number[]> {
    const res = await fetch(`${this.opts.baseUrl.replace(/\/$/, "")}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: this.opts.model, prompt: String(text) }),
      
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(`Ollama embeddings HTTP ${res.status}: ${msg}`);
    }
    const data = await res.json();
    if (!data?.embedding || !Array.isArray(data.embedding) || data.embedding.length === 0) {
      throw new Error("Ollama returned empty embedding");
    }
    return data.embedding;
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.embedOne(text);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const out: number[][] = [];
    for (const t of texts) out.push(await this.embedOne(t));
    return out;
  }
}