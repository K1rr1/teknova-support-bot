import React from 'react';

export function Message({ role, text, sources }: { role: 'user'|'bot'; text: string; sources?: { source?: string; chunk?: number }[] }) {
  return (
    <div className={`bubble ${role}`}>
      <div className="msg">{text}</div>
      {role === 'bot' && sources && sources.length > 0 && (
        <div className="citations">
          <strong>Källor:</strong>
          <ul>
            {sources.map((s, i) => (
              <li key={i}>[{i+1}] {s.source ?? 'okänd'}{s.chunk ? ` (avsnitt ${s.chunk})` : ''}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}