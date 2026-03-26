import { openModal } from '../utils/modal';

export default function TodoItem({ todo, onToggle, onDelete }) {

  const handleDelete = async () => {
    const result = await openModal({
      title: 'Delete todo',
      message: `Are you sure you want to delete "${todo.text}"?`,
      confirmText: 'Delete',
      cancelText: 'Keep it',
      confirmColor: '#e53935',
      data: { id: todo.id },  // passed back in modal-confirm event
    });

    if (result.confirmed) {
      onDelete(todo.id);
    }
  };

  return (
    <li style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 14px', marginBottom: '8px',
      background: '#fff', border: '1px solid #eee', borderRadius: '8px',
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ width: 18, height: 18, cursor: 'pointer' }}
      />
      <span style={{
        flex: 1,
        textDecoration: todo.completed ? 'line-through' : 'none',
        color: todo.completed ? '#bbb' : '#222', fontSize: '15px',
      }}>
        {todo.text}
      </span>
      <button onClick={handleDelete} style={{
        background: 'none', border: 'none',
        cursor: 'pointer', color: '#e05', fontSize: '20px',
      }}>×</button>
    </li>
  );
}