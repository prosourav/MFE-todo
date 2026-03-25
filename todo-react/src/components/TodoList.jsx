import TodoItem from './TodoItem';

export default function TodoList({ todos = [], onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <p style={{
        color: '#aaa', textAlign: 'center',
        padding: '20px 0', fontSize: '15px',
      }}>
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
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}