import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() eyebrow = 'Estadísticas · Club Atlético Tigre';
  @Input() title = 'Historial de Partidos';

  /** Optional action button label. If empty, button is hidden. */
  @Input() actionLabel = '';

  /** Emits when the action button is clicked */
  onAction(): void {
    // Parent can listen with (actionClick)="..." — extend with @Output if needed
  }
}
