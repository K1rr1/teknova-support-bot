# TechNova AB – Kundtjänstbot (LangChain.js, Ollama, Supabase)

Fullstack: React-klient + Express-API med LangChain.js på servern. Inkluderar:
- RAG över Supabase (pgvector) med Ollama chat + embeddings
- Sessionminne (RunnableWithMessageHistory)
- Källhänvisningar
- Off-topic guard
- Admin-sida för att ladda upp/ingesta nya dokument
- **Health route** (`/health`) och **smoke test**-script
- **(VG)** valbar `SelfQueryRetriever` (metadata-aware) via `USE_SELF_QUERY=true`
- Dockerfiler + docker-compose (inkl. Ollama)
<img width="961" height="325" alt="tabell" src="https://github.com/user-attachments/assets/050d843e-e3e6-4e08-9fac-92af7204406c" />
