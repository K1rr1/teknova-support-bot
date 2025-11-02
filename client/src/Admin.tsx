import React, { useState } from 'react';
import { ingestText } from './api';

export default function Admin() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  async function onUpload() {
    if (!file) return;
    const text = await file.text();
    setStatus('Uploading & ingesting...');
    try {
      const res = await ingestText({ filename: file.name, content: text });
      setStatus(`OK! Chunks ingested: ${res.chunks}`);
    } catch (e: any) {
      setStatus('Failed: ' + (e?.message ?? e));
    }
  }

  return (
    <div style={{display:'grid', gap:12}}>
      <h2>Admin – Ladda upp dokument</h2>
      <input type="file" accept=".txt,.md,.rtf" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={onUpload} disabled={!file}>Ingest</button>
      <div>{status}</div>
      <p style={{opacity:.7}}>Filen delas upp i chunkar och läggs i vektordatabasen med källmetadata.</p>
    </div>
  );
}