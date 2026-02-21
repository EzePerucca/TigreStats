import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnChanges, signal, SimpleChanges } from '@angular/core';
import { MatchesService } from '../../core/services/matches.service';
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";

type KpiFilter = 'played' | 'won' | 'drawn' | 'lost';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss'
})
export class MatchesComponent implements OnChanges {
  private matchesService = inject(MatchesService);

  readonly loading = this.matchesService.loading;
  readonly error = this.matchesService.error;
  readonly stats = this.matchesService.stats;
  readonly season = this.matchesService.season;
  readonly selectedKpiFilter = signal<KpiFilter>('played');

  
  ganadosPct  = 0;
  empatadosPct = 0;
  perdidosPct  = 0;
  // Flex values for the distribution bar (proportional)
  flexGanados  = 0;
  flexEmpatados = 0;
  flexPerdidos  = 0;

  readonly allMatches = computed(() =>
    [...this.matchesService.matches()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );

  readonly filteredMatches = computed(() => {
    const matches = this.allMatches();

    switch (this.selectedKpiFilter()) {
      case 'won':
        return matches.filter(match => match.result === 'W');
      case 'drawn':
        return matches.filter(match => match.result === 'D');
      case 'lost':
        return matches.filter(match => match.result === 'L');
      default:
        return matches;
    }
  });

  ngOnInit(): void {
    this.calculate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stats']) {
      this.calculate();
    }
  }

  constructor() {
    this.matchesService.loadMatches();
    this.calculate();
  }

  getResultLabel(result?: string): string {
    return { W: 'G', D: 'E', L: 'P' }[result ?? ''] ?? '-';
  }

  getResultClass(result?: string): string {
    return { W: 'result--win', D: 'result--draw', L: 'result--loss' }[result ?? ''] ?? '';
  }

  getScore(match: { status: string; homeScore: number; awayScore: number }): string {
    if (match.status !== 'FT' || match.homeScore == null || match.awayScore == null) {
      return '-';
    }

    return `${match.homeScore} – ${match.awayScore}`;
  }

  isHome(match: { homeTeam: string }): boolean {
    return match.homeTeam === 'Tigre';
  }

  getPercentage(total: number): string {
    const played = this.stats().played;

    if (!played) {
      return '0.0';
    }

    return ((total / played) * 100).toFixed(1);
  }

  setKpiFilter(filter: KpiFilter): void {
    this.selectedKpiFilter.set(filter);
  }

  trackById = (_: number, match: { id: string }) => match.id;
  
  private calculate(): void {
    const total = this.stats().played;
    if (total === 0) return;

    this.ganadosPct   = parseFloat(((this.stats().won   / total) * 100).toFixed(1));
    this.empatadosPct = parseFloat(((this.stats().drawn / total) * 100).toFixed(1));
    this.perdidosPct  = parseFloat(((this.stats().lost  / total) * 100).toFixed(1));

    // Use raw values as flex weights — browser distributes proportionally
    this.flexGanados   = this.stats().won;
    this.flexEmpatados = this.stats().drawn;
    this.flexPerdidos  = this.stats().lost;
  }
}
