import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesService } from '../../core/services/matches.service';
import { NextMatchCardComponent } from '../../shared/components/next-match-card/next-match-card.component';
import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { RecentFormComponent } from '../../shared/components/recent-form/recent-form.component';
import { LastMatchesComponent } from '../../shared/components/last-matches/last-matches.component';
import { StandingsTableComponent } from '../../shared/components/standings-table/standings-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NextMatchCardComponent, KpiCards, RecentFormComponent, LastMatchesComponent, StandingsTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private matchesService = inject(MatchesService);

  readonly matches    = this.matchesService.lastMatches;
  readonly stats      = this.matchesService.stats;
  readonly recentForm = this.matchesService.recentForm;
  readonly loading    = this.matchesService.loading;
  readonly error      = this.matchesService.error;
  readonly nextMatch  = this.matchesService.nextMatch;

  readonly seasons = [2024, 2023, 2022];

  constructor() {
    this.matchesService.loadMatches();
  }

  onSeasonChange(season: number): void {
    this.matchesService.setSeason(season);
  }

  getResultLabel(result: string): string {
    return { W: 'G', D: 'E', L: 'P' }[result] ?? '-';
  }

  getResultClass(result: string): string {
    return { W: 'result--win', D: 'result--draw', L: 'result--loss' }[result] ?? '';
  }
}