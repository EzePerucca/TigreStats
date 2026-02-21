import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { PlayersService } from '../../core/services/players.service';
import { PlayerPosition } from '../../core/models/models';

type PlayerFilter = 'all' | PlayerPosition;

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent {
  private playersService = inject(PlayersService);

  readonly loading = this.playersService.loading;
  readonly error = this.playersService.error;
  readonly players = this.playersService.players;
  readonly stats = this.playersService.stats;
  readonly selectedFilter = signal<PlayerFilter>('all');

  readonly filteredPlayers = computed(() => {
    const filter = this.selectedFilter();

    if (filter === 'all') {
      return this.players();
    }

    return this.players().filter(player => player.position === filter);
  });

  constructor() {
    this.playersService.loadPlayers();
  }

  setFilter(filter: PlayerFilter): void {
    this.selectedFilter.set(filter);
  }

  getFullName(player: { name: string; lastName: string }): string {
    return `${player.name} ${player.lastName}`.trim();
  }

  trackById = (_: number, player: { id: string }) => player.id;
}
