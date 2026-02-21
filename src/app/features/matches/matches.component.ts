import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatchesService } from '../../core/services/matches.service';
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { DistributionBarComponent } from "../../shared/graphs/distribution-bar/distribution-bar.component";

type KpiFilter = 'played' | 'won' | 'drawn' | 'lost';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DistributionBarComponent],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss'
})
export class MatchesComponent {
  private matchesService = inject(MatchesService);

  readonly loading = this.matchesService.loading;
  readonly error = this.matchesService.error;
  readonly stats = this.matchesService.stats;
  readonly season = this.matchesService.season;
  readonly selectedKpiFilter = signal<KpiFilter>('played');

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

  constructor() {
    this.matchesService.loadMatches();
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
}
