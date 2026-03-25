import { useEffect, useState } from 'react';

let bootstrapped = false;

async function loadAngularRemote() {
  if (bootstrapped) return;

  const container = await import(/* webpackIgnore: true */ 'http://localhost:4201/remoteEntry.js');
  await __webpack_init_sharing__('default');
  await container.init(__webpack_share_scopes__.default);

  const factory = await container.get('./Stats');
  const Module = factory();
  await Module.default();

  bootstrapped = true;
}

export default function StatsWidget() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadAngularRemote()
      .then(() => setLoaded(true))
      .catch(console.error);
  }, []);

  if (!loaded) return null;

  // Angular component handles its own state via event bus
  return (
    <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100 }}>
      <angular-stats />
    </div>
  );
}


// User types + clicks Add
//        ↓
// TodoInput → todoStore.add()
//        ↓
// todoStore._notify()
//        ↓ window event: 'todos-updated'
//        ├── React TodoList listens → updates its own state
//        └── Angular StatsComponent listens → updates its own state

// User clicks checkbox in React remote
//        ↓ window event: 'todo-toggle'
//        ↓
// todoStore.toggle()
//        ↓ window event: 'todos-updated'
//        ├── React TodoList re-renders
//        └── Angular stats update