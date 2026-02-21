import { Injectable, signal, computed, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Player } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlayersService {

  private sb = inject(SupabaseService);

  private _players = signal<Player[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _season = signal(String(environment.tigre.season));

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly season = this._season.asReadonly();

  readonly players = computed(() =>
    [...this._players()].sort((a, b) => {
      const byLastName = a.lastName.localeCompare(b.lastName, 'es', { sensitivity: 'base' });
      if (byLastName !== 0) {
        return byLastName;
      }

      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    })
  );

  readonly activePlayers = computed(() => this._players().filter(player => player.isActive));

  readonly stats = computed(() => {
    const players = this.activePlayers();

    return {
      total: players.length,
      goalkeepers: players.filter(player => player.position === 'Portero').length,
      defenders: players.filter(player => player.position === 'Defensor').length,
      midfielders: players.filter(player => player.position === 'Mediocampista').length,
      forwards: players.filter(player => player.position === 'Delantero').length
    };
  });

  async loadPlayers(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    const { data, error } = await this.sb.client
      .from('players')
      .select('*');

    if (error) {
      this._error.set('No se pudo cargar el plantel.');
      console.error(error);
    } else {
      this._players.set((data ?? []).map(this.mapPlayer));
    }

    this._loading.set(false);
  }

  setSeason(season: string): void {
    this._season.set(season);
    this.loadPlayers();
  }

  private mapPlayer(row: any): Player {
    const firstName = row.first_name ?? row.name ?? '';
    const lastName = row.last_name ?? '';

    return {
      id: String(row.id ?? row.player_id ?? row.api_id ?? crypto.randomUUID()),
      name: firstName,
      lastName,
      number: row.number ?? row.shirt_number ?? undefined,
      position: row.position ? this.mapPosition(row.position) : null,
      nationality: row.nationality ?? 'N/A',
      birthDate: row.birth_date ?? undefined,
      photoUrl: row.photo_url ?? undefined,
      isActive: row.is_active ?? true,
      stats: {
        season: String(row.season ?? this._season()),
        matchesPlayed: Number(row.matches_played ?? 0),
        goals: Number(row.goals ?? 0),
        assists: Number(row.assists ?? 0),
        yellowCards: Number(row.yellow_cards ?? 0),
        redCards: Number(row.red_cards ?? 0),
        minutesPlayed: row.minutes_played != null ? Number(row.minutes_played) : undefined
      }
    };
  }

  private mapPosition(position: string | null | undefined): Player['position'] {
    const normalized = String(position ?? '').toLowerCase();

    if (!normalized) return null;

    if (normalized.includes('port')) return 'Portero';
    if (normalized.includes('def')) return 'Defensor';
    if (normalized.includes('medi') || normalized.includes('mid')) return 'Mediocampista';
    if (normalized.includes('del') || normalized.includes('ata') || normalized.includes('for')) return 'Delantero';

    return null;
  }
}
