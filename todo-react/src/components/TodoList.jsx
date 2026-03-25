import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Listen to event bus — no props needed from host
    const handler = (e) => setTodos(e.detail || []);
    window.addEventListener('todos-updated', handler);
    return () => window.removeEventListener('todos-updated', handler);
  }, []);

  if (todos.length === 0) {
    return (
      <p style={{ color: '#aaa', textAlign: 'center', padding: '20px 0', fontSize: '15px' }}>
        No todos yet. Add one above!
      </p>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={(id) => window.dispatchEvent(new CustomEvent('todo-toggle', { detail: id }))}
          onDelete={(id) => window.dispatchEvent(new CustomEvent('todo-delete', { detail: id }))}
        />
      ))}
    </ul>
  );
}