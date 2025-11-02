import React, { useRef, useState } from 'react';
import { chat } from './api';
import { Message } from './components/Message';

export default function Chat() {
  const [messages, setMessages] = useState<Array<{ role: 'user'|'bot'; text: string; sources?: any[] }>>([
    { role: 'bot', text: 'Hej! Jag är TechNovas kundtjänstbot. Ställ gärna din fråga om produkter, leveranser eller garantier.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const conversationId = useRef(crypto.randomUUID());

  async function onSend() {
    const q = input.trim();
    if (!q) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await chat(q, conversationId.current);
      setMessages(m => [...m, { role: 'bot', text: res.answer, sources: res.sources }]);
    } catch (e: any) {
      setMessages(m => [...m, { role: 'bot', text: 'Tyvärr uppstod ett fel. Försök igen.' }]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
  }

  return (
    <div>
      {messages.map((m, i) => (
        <Message key={i} role={m.role} text={m.text} sources={m.sources} />
      ))}
      <div className="inputBar">
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} placeholder="Skriv din fråga..." />
        <button disabled={loading} onClick={onSend}>{loading ? 'Svarar…' : 'Skicka'}</button>
      </div>
      <div className="note">Obs: Botten svarar endast på TechNova-relaterade frågor och visar källor när dokument används.</div>
    </div>
  );
}