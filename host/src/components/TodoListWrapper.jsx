import { useEffect, useState, Suspense, lazy } from 'react';
import { todoStore } from '../store/todoStore';

const TodoList = lazy(() => import('todoReact/TodoList'));

export default function TodoListWrapper() {
  const [todos, setTodos] = useState(todoStore.getAll());

  useEffect(() => {
    return todoStore.subscribe(setTodos);
  }, []);

  return (
    <Suspense fallback={
      <p style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
        Loading...
      </p>
    }>
      <TodoList
        todos={todos}
        onToggle={id => todoStore.toggle(id)}
        onDelete={id => todoStore.delete(id)}
      />
    </Suspense>
  );
}