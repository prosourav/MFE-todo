import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { openModal } from 'src/utils/modal';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  styleUrl:'./stats.css',
  template: `
    <div style="
      background: white; border: 1px solid #eee; border-radius: 10px;
      padding: 10px 16px; font-size: 13px; font-family: sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-width: 130px;
    ">
      @if (visible()) {
        <div style="font-weight: 600; margin-bottom: 6px; color: #444;">Todos</div>
        <div style="color: #22a06b; margin-bottom: 4px;">✓ Done: {{ done() }}</div>
        <div style="color: #e2812c; margin-bottom: 10px;">○ Pending: {{ pending() }}</div>
      } @else {
        <div style="color: #aaa; margin-bottom: 10px; font-size: 12px;">Stats hidden</div>
      }

        <label class="switch">
            <input
              type="checkbox"
              [checked]="visible()"
              (change)="toggleVisibility()"
            />
            <span class="slider"></span>
        </label>

      <span style="margin-left: 8px; font-size: 12px; color: #444;">
        {{ visible() ? 'Hide stats' : 'Show stats' }}
      </span>

    </div>
  `,
})
export class StatsComponent implements OnInit, OnDestroy {
  done = signal(0);
  pending = signal(0);
  visible = signal(true);

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

  async toggleVisibility() {
    // only show modal when hiding
    if (this.visible()) {
      const result = await openModal({
        title: 'Hide stats?',
        message: 'Are you sure you want to hide the todo stats widget?',
        confirmText: 'Yes, hide it',
        cancelText: 'Keep visible',
        confirmColor: '#6c63ff',  // different color for Angular's modal
      });

      if (result.confirmed) {
        this.visible.set(false);
      }
    } else {
      // show without modal
      this.visible.set(true);
    }
  }
}