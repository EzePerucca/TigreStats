import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-distribution-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './distribution-bar.component.html',
  styleUrl: './distribution-bar.component.scss'
})
export class DistributionBarComponent {
  @Input() played: number = 0;
  @Input() won: number = 0;
  @Input() drawn: number = 0;
  @Input() lost: number = 0;

  readonly flexGanados = computed(() => this.won);
  readonly flexEmpatados = computed(() => this.drawn);
  readonly flexPerdidos = computed(() => this.lost);

  readonly ganadosPct = computed(() => {
    const total = this.played;
    if (total === 0) return 0;
    return parseFloat(((this.won / total) * 100).toFixed(1));
  });

  readonly empatadosPct = computed(() => {
    const total = this.played;
    if (total === 0) return 0;
    return parseFloat(((this.drawn / total) * 100).toFixed(1));
  });

  readonly perdidosPct = computed(() => {
    const total = this.played;
    if (total === 0) return 0;
    return parseFloat(((this.lost / total) * 100).toFixed(1));
  });
}
