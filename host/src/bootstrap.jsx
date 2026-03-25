import ReactDOM from 'react-dom/client';
import App from './App';
import { todoStore } from './store/todoStore';

// Start listening to remote events
todoStore.init();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);