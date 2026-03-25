let todos = [];
let listeners = [];

export const todoStore = {
  getAll: () => todos,

  add(text) {
    const todo = { id: Date.now(), text, completed: false };
    todos = [...todos, todo];
    this._notify();
  },

  toggle(id) {
    todos = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this._notify();
  },

  delete(id) {
    todos = todos.filter(t => t.id !== id);
    this._notify();
  },

  subscribe(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  },

  _notify() {
    listeners.forEach(fn => fn(todos));
    // fire DOM event so Angular can also listen
    window.dispatchEvent(
      new CustomEvent('todos-updated', { detail: todos })
    );
  },
};