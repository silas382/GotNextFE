export interface Player {
  id: string;
  name: string;
  avatar?: string;
  joinedAt: Date;
  backendId?: number; // Backend database ID for API calls
}

export interface Team {
  id: string;
  name: string;
  players: (Player | null)[]; // Array of 5 slots, null for empty slots
  color: string;
}

export interface Game {
  id: string;
  status: 'waiting' | 'ready' | 'in-progress' | 'completed';
  team1: Team;
  team2: Team;
  queue: Player[];
  createdAt: Date;
  startedAt?: Date;
  winner?: 'team1' | 'team2';
}

export interface GameState {
  currentGame: Game | null;
  upcomingGames: Game[];
}

