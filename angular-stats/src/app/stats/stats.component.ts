import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="
      background: white;
      border: 1px solid #eee;
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 13px;
      font-family: sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 130px;
    ">
      <div style="font-weight: 600; margin-bottom: 6px; color: #444;">
        Todos
      </div>
      <div style="color: #22a06b; margin-bottom: 4px;">
        ✓ Done: {{ done() }}
      </div>
      <div style="color: #e2812c;">
        ○ Pending: {{ pending() }}
      </div>
    </div>
  `,
})
export class StatsComponent implements OnInit, OnDestroy {
  done = signal(0);
  pending = signal(0);

  private handler = (e: Event) => {
    const todos = (e as CustomEvent).detail || [];
    this.done.set(todos.filter((t: any) => t.completed).length);
    this.pending.set(todos.filter((t: any) => !t.completed).length);
  };

  ngOnInit() {
    window.addEventListener('todos-updated', this.handler);
  }

  ngOnDestroy() {
    window.removeEventListener('todos-updated', this.handler);
  }
}