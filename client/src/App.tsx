import React from 'react';
import Chat from './Chat';
import Admin from './Admin';
import './styles.css';

export default function App() {
  const [tab, setTab] = React.useState<'chat' | 'admin'>('chat');
  return (
    <div className="container">
      <div className="header">
        <h1>TechNova AB – Kundtjänstbot</h1>
        <div style={{marginLeft:'auto', display:'flex', gap:8}}>
          <button onClick={()=>setTab('chat')}>Chat</button>
          <button onClick={()=>setTab('admin')}>Admin</button>
        </div>
      </div>
      {tab === 'chat' ? <Chat /> : <Admin />}
    </div>
  );
}