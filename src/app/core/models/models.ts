// ─── match.model.ts ───────────────────────────────────────────────────────────

export type MatchResult = 'W' | 'D' | 'L'; // Win, Draw, Loss
export type MatchVenue  = 'home' | 'away' | 'neutral';

export interface Match {
  status: string;
  id: string;
  apiId: string;              // ID original de API-Football, para referencia cruzada
  date: string;               // ISO 8601: '2025-02-15'
  tournament: string;         // 'Liga Profesional', 'Copa Argentina', etc.
  round: string;              // 'Fecha 18', 'Octavos de final', etc.
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  venue: MatchVenue;
  result?: MatchResult;       // Calculado respecto a Tigre
  season: string;             // '2024/25'
  scorers?: MatchGoal[];
  notes?: string;
}

export interface MatchGoal {
  playerId: string;
  playerName: string;
  minute: number;
  isPenalty?: boolean;
  isOwnGoal?: boolean;
}

// ─── player.model.ts ──────────────────────────────────────────────────────────

export type PlayerPosition = 'Portero' | 'Defensor' | 'Mediocampista' | 'Delantero';

export interface Player {
  id: string;
  name: string;
  lastName: string;
  number?: number;
  position: PlayerPosition | null;
  nationality: string;
  birthDate?: string;
  photoUrl?: string;
  isActive: boolean;
  stats: PlayerStats;
}

export interface PlayerStats {
  season: string;             // '2024/25'
  matchesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed?: number;
}

// ─── tournament.model.ts ──────────────────────────────────────────────────────

export type TournamentType = 'Liga' | 'Copa' | 'Internacional' | 'Amistoso';

export interface Tournament {
  id: string;
  name: string;               // 'Liga Profesional 2024'
  type: TournamentType;
  season: string;             // '2024'
  startDate: string;
  endDate?: string;
  finalPosition?: number;
  totalTeams?: number;
  stats: TournamentStats;
}

export interface TournamentStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

// ─── transfer.model.ts ────────────────────────────────────────────────────────

export type TransferType = 'in' | 'out' | 'loan_in' | 'loan_out';

export interface Transfer {
  id: string;
  playerId?: string;          // Si el jugador ya existe en la BD
  playerName: string;
  playerPosition: PlayerPosition;
  type: TransferType;
  fromClub?: string;
  toClub?: string;
  date: string;
  season: string;
  fee?: number;               // En USD, null si es libre o préstamo
  isFree?: boolean;
  notes?: string;
}

// ─── standing.model.ts ────────────────────────────────────────────────────────
export interface Standing {
  id:              number;
  tournamentApiId: number;
  tournamentName:  string;
  season:          string;
  groupName:       string | null;

  teamApiId: number;
  teamName:  string;
  teamLogo:  string | null;

  rank:        number;
  points:      number;
  form:        string | null;  // 'WWDLW'
  status:      string | null;  // 'up' | 'down' | 'same'
  description: string | null;  // 'Promotion' | 'Relegation' | null

  played:       number;
  won:          number;
  drawn:        number;
  lost:         number;
  goalsFor:     number;
  goalsAgainst: number;
  goalsDiff:    number;

  homePlayed:       number;
  homeWon:          number;
  homeDrawn:        number;
  homeLost:         number;
  homeGoalsFor:     number;
  homeGoalsAgainst: number;

  awayPlayed:       number;
  awayWon:          number;
  awayDrawn:        number;
  awayLost:         number;
  awayGoalsFor:     number;
  awayGoalsAgainst: number;

  updatedAt: string;
}
