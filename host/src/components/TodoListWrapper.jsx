import { Suspense, lazy } from 'react';

const TodoList = lazy(() => import('todoReact/TodoList'));

export default function TodoListWrapper() {
  return (
    <Suspense fallback={
      <p style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
        Loading...
      </p>
    }>
      <TodoList />
    </Suspense>
  );
}