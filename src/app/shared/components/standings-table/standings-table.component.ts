import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Standing } from '../../../core/models/models';
import { StandingsService } from '../../../core/services/standings.service';

type StandingGroup = {
  key: string;
  name: string | null;
  rows: Standing[];
};

@Component({
  selector: 'app-standings-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standings-table.component.html',
  styleUrl: './standings-table.component.scss'
})
export class StandingsTableComponent implements OnInit {
  private standingsService = inject(StandingsService);

  readonly loading = this.standingsService.loading;
  readonly error = this.standingsService.error;
  readonly selectedLeagueId = this.standingsService.selectedLeagueId;
  readonly availableLeagues = this.standingsService.availableLeagues;
  readonly defaultRows = 10;

  readonly showFull = signal(false);

  readonly leagueName = computed(() => {
    const selectedId = this.selectedLeagueId();
    if (!selectedId) return 'Tabla';
    return this.availableLeagues().find(league => league.id === selectedId)?.name ?? 'Tabla';
  });

  readonly groups = computed<StandingGroup[]>(() => {
    const grouped = this.standingsService.filteredStandings();

    return Object.entries(grouped)
      .map(([key, rows]) => ({
        key,
        name: key === '__none__' ? null : key,
        rows: [...rows].sort((a, b) => a.rank - b.rank),
      }))
      .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  });

  readonly hasMoreRows = computed(() =>
    this.groups().some(group => group.rows.length > this.defaultRows)
  );

  ngOnInit(): void {
    if (!this.groups().length && !this.loading()) {
      this.standingsService.loadStandings();
    }
  }

  toggleRows(): void {
    this.showFull.update(value => !value);
  }

  getVisibleRows(rows: Standing[]): Standing[] {
    if (this.showFull() || rows.length <= this.defaultRows) {
      return rows;
    }

    const reducedRows = rows.slice(0, this.defaultRows);
    const hasTigreInReduced = reducedRows.some(row => this.isTigre(row.teamName));

    if (hasTigreInReduced) {
      return reducedRows;
    }

    const tigreRow = rows.find(row => this.isTigre(row.teamName));

    if (!tigreRow) {
      return reducedRows;
    }

    return [...reducedRows.slice(0, this.defaultRows - 1), tigreRow].sort((a, b) => a.rank - b.rank);
  }

  isTigre(teamName: string): boolean {
    return teamName.toLowerCase().includes('tigre');
  }

  formatGoalsDiff(goalsDiff: number): string {
    if (goalsDiff > 0) return `+${goalsDiff}`;
    return `${goalsDiff}`;
  }

  trackByTeamApiId(index: number, row: Standing): number {
    return row.teamApiId ?? index;
  }
}