import { useEffect, useRef, useState } from 'react';
import { todoStore } from '../store/todoStore';

let bootstrapped = false;

async function loadAngularRemote() {
  if (bootstrapped) return;

  // Native ESM dynamic import — browser handles Angular's ESM output natively
  const container = await import(/* webpackIgnore: true */ 'http://localhost:4201/remoteEntry.js');

  // Standard MF handshake
  await __webpack_init_sharing__('default');
  await container.init(__webpack_share_scopes__.default);

  // Get the exposed Stats module
  const factory = await container.get('./Stats');
  const Module = factory();

  // Bootstrap Angular custom element
  await Module.default();
  bootstrapped = true;
}

export default function StatsWidget() {
  const [loaded, setLoaded] = useState(false);
  const [stats, setStats] = useState({ done: 0, pending: 0 });
  const ref = useRef(null);

  useEffect(() => {
    loadAngularRemote()
      .then(() => setLoaded(true))
      .catch(console.error);

    return todoStore.subscribe(todos => {
      const done = todos.filter(t => t.completed).length;
      const pending = todos.filter(t => !t.completed).length;
      setStats({ done, pending });
      if (ref.current) {
        ref.current.done = done;
        ref.current.pending = pending;
      }
    });
  }, []);

  if (!loaded) return null;

  return (
    <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100 }}>
      <angular-stats ref={ref} done={stats.done} pending={stats.pending} />
    </div>
  );
}