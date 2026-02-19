// src/app/core/services/standings.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Standing } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StandingsService {

  private sb = inject(SupabaseService);

  // ── Estado ────────────────────────────────────────────────────────────────
  private _standings          = signal<Standing[]>([]);
  private _loading            = signal(false);
  private _error              = signal<string | null>(null);
  private _season             = signal('2024');
  private _selectedLeagueId   = signal<number | null>(environment.tigre.leagueId);

  readonly loading          = this._loading.asReadonly();
  readonly error            = this._error.asReadonly();
  readonly season           = this._season.asReadonly();
  readonly selectedLeagueId = this._selectedLeagueId.asReadonly();

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly standings = this._standings.asReadonly();

  // Posición de Tigre en la tabla activa
  readonly tigreRow = computed(() =>
    this._standings().find(s => s.teamName.toLowerCase().includes('tigre')) ?? null
  );

  // Torneos únicos disponibles en los datos cargados (para un selector en la UI)
  readonly availableLeagues = computed(() => {
    const seen = new Set<number>();
    return this._standings()
      .filter(s => {
        if (seen.has(s.tournamentApiId)) return false;
        seen.add(s.tournamentApiId);
        return true;
      })
      .map(s => ({ id: s.tournamentApiId, name: s.tournamentName }));
  });

  // Vista filtrada por liga seleccionada (agrupa por grupo si hay varios)
  readonly filteredStandings = computed(() => {
    const all = this._standings();
    const leagueId = this._selectedLeagueId();
    const filtered = leagueId ? all.filter(s => s.tournamentApiId === leagueId) : all;

    // Agrupa por group_name (null → clave '__none__')
    const groups: Record<string, Standing[]> = {};
    for (const s of filtered) {
      const key = s.groupName ?? '__none__';
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    }
    return groups;
  });

  // ── Carga de datos ────────────────────────────────────────────────────────
  async loadStandings(season = this._season()): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    const { data, error } = await this.sb.client
      .from('standings')
      .select('*')
      .eq('season', season)
      .eq('tournament_api_id', this._selectedLeagueId())
      .order('rank', { ascending: true });

    if (error) {
      this._error.set('No se pudieron cargar las posiciones.');
      console.error(error);
    } else {
      this._standings.set((data ?? []).map(this.mapStanding));

      // Auto-seleccionar la primera liga disponible
      if (data && data.length > 0 && !this._selectedLeagueId()) {
        this._selectedLeagueId.set(data[0].tournament_api_id);
      }
    }

    this._loading.set(false);
  }

  setSeason(season: string): void {
    this._season.set(season);
    this._selectedLeagueId.set(null); // reset al cambiar temporada
    this.loadStandings(season);
  }

  setLeague(leagueId: number): void {
    this._selectedLeagueId.set(leagueId);
  }

  // ── Mapper (snake_case Supabase → camelCase modelo) ───────────────────────
  private mapStanding(row: any): Standing {
    return {
      id:               row.id,
      tournamentApiId:  row.tournament_api_id,
      tournamentName:   row.tournament_name,
      season:           row.season,
      groupName:        row.group_name ?? null,

      teamApiId:  row.team_api_id,
      teamName:   row.team_name,
      teamLogo:   row.team_logo ?? null,

      rank:        row.rank,
      points:      row.points,
      form:        row.form        ?? null,
      status:      row.status      ?? null,
      description: row.description ?? null,

      played:       row.played,
      won:          row.won,
      drawn:        row.drawn,
      lost:         row.lost,
      goalsFor:     row.goals_for,
      goalsAgainst: row.goals_against,
      goalsDiff:    row.goals_diff,

      homePlayed:       row.home_played,
      homeWon:          row.home_won,
      homeDrawn:        row.home_drawn,
      homeLost:         row.home_lost,
      homeGoalsFor:     row.home_goals_for,
      homeGoalsAgainst: row.home_goals_against,

      awayPlayed:       row.away_played,
      awayWon:          row.away_won,
      awayDrawn:        row.away_drawn,
      awayLost:         row.away_lost,
      awayGoalsFor:     row.away_goals_for,
      awayGoalsAgainst: row.away_goals_against,

      updatedAt: row.updated_at,
    };
  }
}