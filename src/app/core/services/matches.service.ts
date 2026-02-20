// src/app/core/services/matches.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Match } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MatchesService {

  private sb = inject(SupabaseService);

  // ── Estado ────────────────────────────────────────────────────────────────
  private _matches  = signal<Match[]>([]);
  private _loading  = signal(false);
  private _error    = signal<string | null>(null);
  private _season   = signal(environment.tigre.season);

  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();
  readonly season   = this._season.asReadonly();

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly matches = this._matches.asReadonly();

  readonly lastMatches = computed(() =>
    [...this._matches()]
      .filter(m => m.status === 'FT')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  );

  readonly nextMatch = computed(() =>
    [...this._matches()]
      .filter(m => new Date(m.date) > new Date())
      // .filter(m => m.status === 'NS' && new Date(m.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null
  );

  readonly stats = computed(() => {
    const ms = this._matches().filter(m => m.status === 'FT');
    const won   = ms.filter(m => m.result === 'W').length;
    const drawn = ms.filter(m => m.result === 'D').length;
    const lost  = ms.filter(m => m.result === 'L').length;
    const goalsFor     = ms.reduce((acc, m) => acc + this.tigreGoals(m), 0);
    const goalsAgainst = ms.reduce((acc, m) => acc + this.rivalGoals(m), 0);

    return {
      played: ms.length, won, drawn, lost, goalsFor, goalsAgainst,
      points: won * 3 + drawn,
      pointsAverage: ms.length ? ((won * 3 + drawn) / ms.length).toFixed(2) : '0.00'
    };
  });

  readonly recentForm = computed(() =>
    this.lastMatches()
      .filter(m => m.status === 'FT')
      .slice(0, 10)
      .map(m => m.result ?? 'D')
  );

  // ── Carga de datos ────────────────────────────────────────────────────────
  async loadMatches(season = this._season()): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    // console.log('Cargando temporada:', season);

    const { data, error } = await this.sb.client
      .from('matches')
      .select('*')
      .eq('season', season)
      .order('date', { ascending: false });

    // console.log('Data recibida:', data); // ← y esto
    // console.log('Error:', error);        // ← y esto

    if (error) {
      this._error.set('No se pudieron cargar los partidos.');
      console.error(error);
    } else {
      // Mapear snake_case de Supabase a camelCase del modelo
      this._matches.set((data ?? []).map(this.mapMatch));
    }

    this._loading.set(false);
  }

  setSeason(season: number): void {
    this._season.set(season);
    this.loadMatches(season);
  }

  // ── Mappers ───────────────────────────────────────────────────────────────
  private mapMatch(row: any): Match {
    const isHome = row.home_team === 'Tigre';
    const tigreGoals = isHome ? row.home_score : row.away_score;
    const rivalGoals  = isHome ? row.away_score : row.home_score;

    let result: 'W' | 'D' | 'L' | undefined;
    if (row.status === 'FT' && tigreGoals != null && rivalGoals != null) {
      result = tigreGoals > rivalGoals ? 'W' : tigreGoals < rivalGoals ? 'L' : 'D';
    }

    return {
      id:         String(row.id),
      apiId:      row.api_id,
      date:       row.date,
      tournament: row.tournament_name,
      round:      row.round,
      homeTeam:   row.home_team,
      awayTeam:   row.away_team,
      homeScore:  row.home_score,
      awayScore:  row.away_score,
      venue:      row.venue,
      status:     row.status,
      season:     row.season,
      result
    };
  }

  private tigreGoals(match: Match): number {
    return match.homeTeam === 'Tigre' ? match.homeScore ?? 0 : match.awayScore ?? 0;
  }

  private rivalGoals(match: Match): number {
    return match.homeTeam === 'Tigre' ? match.awayScore ?? 0 : match.homeScore ?? 0;
  }
}