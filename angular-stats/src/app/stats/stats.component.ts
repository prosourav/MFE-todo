import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { openModal } from 'src/utils/modal';
import { StatsModalComponent } from '../stats-modal/stats-modal';


@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, StatsModalComponent],
  styleUrl:'./stats.css',
  templateUrl: './stats.html'
})
export class StatsComponent implements OnInit, OnDestroy {
  done = signal(0);
  pending = signal(0);
  visible = signal(true);
  showStatsModal = signal(false);

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

  openStatsModal() {
  if (!this.visible()) return; // optional
  this.showStatsModal.set(true);
}

closeStatsModal() {
  this.showStatsModal.set(false);
}

progress = () => {
  const total = this.done() + this.pending();
  return total === 0 ? 0 : Math.round((this.done() / total) * 100);
};

}