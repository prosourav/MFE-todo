import TodoInput from './components/TodoInput';
import TodoListWrapper from './components/TodoListWrapper';
import StatsWidget from './components/StatsWidget';

export default function App() {
  return (
    <main style={{
      maxWidth: '640px',
      margin: '60px auto',
      padding: '0 20px',
    }}>
      <StatsWidget />
      <h1 style={{
        fontSize: '26px', fontWeight: 600,
        marginBottom: '24px', color: '#222',
      }}>
        My Todos
      </h1>
      <TodoInput />
      <div style={{ marginTop: '20px' }}>
        <TodoListWrapper />
      </div>
    </main>
  );
}