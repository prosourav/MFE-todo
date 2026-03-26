import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-modal.html',
  styleUrl: './stats-modal.css',
})
export class StatsModalComponent {
  @Input() done = 0;
  @Input() pending = 0;
  @Input() progress = 0;

  @Output() close = new EventEmitter<void>();
}
