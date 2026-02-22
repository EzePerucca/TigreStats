import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionBarComponent } from '../../graphs/distribution-bar/distribution-bar.component';

export interface SeasonKpis {
  partidosJugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  puntos: number;
  golesAFavor: number;
  golesEnContra: number;
}

@Component({
  selector: 'app-kpi-current-season',
  standalone: true,
  imports: [CommonModule, DistributionBarComponent],
  templateUrl: './kpi-current-season.component.html',
  styleUrls: ['./kpi-current-season.component.scss'],
})
export class KpiCurrentSeasonComponent implements OnChanges {

  @Input() kpis: SeasonKpis = {
    partidosJugados: 0,
    ganados: 0,
    empatados: 0,
    perdidos: 0,
    puntos: 0,
    golesAFavor: 0,
    golesEnContra: 0,
  };

  // Calculated values
  puntosPromedio = 0;
  golesTotal = 0;
  gfPct = 0;
  gcPct = 0;
  golesDiff = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kpis']) {
      this.calculate();
    }
  }

  private calculate(): void {
    const { partidosJugados, puntos, golesAFavor, golesEnContra } = this.kpis;

    // Points average
    this.puntosPromedio = partidosJugados > 0
      ? parseFloat((puntos / partidosJugados).toFixed(2))
      : 0;

    // Goals comparison
    this.golesTotal = golesAFavor + golesEnContra;
    this.gfPct = this.golesTotal > 0
      ? parseFloat(((golesAFavor / this.golesTotal) * 100).toFixed(1))
      : 0;
    this.gcPct = this.golesTotal > 0
      ? parseFloat(((golesEnContra / this.golesTotal) * 100).toFixed(1))
      : 0;
    this.golesDiff = golesAFavor - golesEnContra;
  }

  get golesDiffLabel(): string {
    if (this.golesDiff > 0) return `+${this.golesDiff} sobre goles recibidos`;
    if (this.golesDiff < 0) return `${this.golesDiff} vs goles recibidos`;
    return 'Equilibrio de goles';
  }

  get golesContraDiffLabel(): string {
    const diff = this.kpis.golesEnContra - this.kpis.golesAFavor;
    if (diff > 0) return `+${diff} sobre goles marcados`;
    if (diff < 0) return `${diff} vs goles marcados`;
    return 'Equilibrio de goles';
  }
}
