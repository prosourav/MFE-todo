import { useState } from 'react';
import { todoStore } from '../store/todoStore';

export default function TodoInput() {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    todoStore.add(text.trim());
    setText('');
  };

  return (
    <div style={{
      display: 'flex', gap: '10px', padding: '20px',
      background: '#fff', borderRadius: '12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    }}>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder="What needs to be done?"
        style={{
          flex: 1, padding: '10px 14px', fontSize: '15px',
          border: '1px solid #ddd', borderRadius: '8px', outline: 'none',
        }}
      />
      <button
        onClick={handleAdd}
        style={{
          padding: '10px 20px', background: '#6c63ff', color: '#fff',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontSize: '15px', fontWeight: 500,
        }}
      >
        Add
      </button>
    </div>
  );
}