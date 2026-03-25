import ReactDOM from 'react-dom/client';
import TodoList from './components/TodoList';

const sampleTodos = [
  { id: 1, text: 'Sample todo', completed: false },
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <TodoList
    todos={sampleTodos}
    onToggle={id => console.log('toggle', id)}
    onDelete={id => console.log('delete', id)}
  />
);