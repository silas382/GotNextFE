import { Game, Player, Team } from '@/types/game';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

interface GameContextType {
  currentGame: Game | null;
  upcomingGames: Team[];
  addPlayerToTeam: (teamId: string, player: Player, position?: number) => void;
  addPlayerToQueueTeam: (teamIndex: number, position: number, player: Player) => void;
  leaveGame: (playerId: string) => void;
  substitutePlayer: (fromPlayerId: string, toPlayer: Player) => void;
  createNewGame: () => void;
  startGame: () => void;
  endGame: (winner: 'team1' | 'team2') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [upcomingGames, setUpcomingGames] = useState<Team[]>([]);
  const upcomingGamesRef = useRef<Team[]>([]);
  
  // Keep ref in sync with state
  React.useEffect(() => {
    upcomingGamesRef.current = upcomingGames;
  }, [upcomingGames]);

  // Helper function to initialize 3 queue teams with consistent IDs and names
  // Team 3, Team 4, Team 5 - these IDs and names never change
  const initializeQueueTeams = useCallback(() => {
    const teams: Team[] = [
      {
        id: 'queue-team-0',
        name: 'Team 3',
        players: [null, null, null, null, null],
        color: '#1E88E5',
      },
      {
        id: 'queue-team-1',
        name: 'Team 4',
        players: [null, null, null, null, null],
        color: '#F44336',
      },
      {
        id: 'queue-team-2',
        name: 'Team 5',
        players: [null, null, null, null, null],
        color: '#1E88E5',
      },
    ];
    setUpcomingGames(teams);
  }, []);

  const createNewGame = useCallback(() => {
    const newGame: Game = {
      id: `game-${Date.now()}`,
      status: 'waiting',
      team1: {
        id: 'team1',
        name: 'Team 1',
        players: [null, null, null, null, null],
        color: '#1E88E5',
      },
      team2: {
        id: 'team2',
        name: 'Team 2',
        players: [null, null, null, null, null],
        color: '#F44336',
      },
      queue: [],
      createdAt: new Date(),
    };
    setCurrentGame(newGame);
    // Initialize with 3 empty teams with consistent IDs
    initializeQueueTeams();
  }, [initializeQueueTeams]);

  const addPlayerToTeam = useCallback((teamId: string, player: Player, position?: number) => {
    setCurrentGame((prev) => {
      if (!prev) {
        const newGame: Game = {
          id: `game-${Date.now()}`,
          status: 'waiting',
          team1: {
            id: 'team1',
            name: 'Team 1',
            players: [],
            color: '#1E88E5',
          },
          team2: {
            id: 'team2',
            name: 'Team 2',
            players: [],
            color: '#F44336',
          },
          queue: [],
          createdAt: new Date(),
        };
        // Add player to the specified team at the specified position
        const players: (Player | null)[] = [null, null, null, null, null];
        if (position !== undefined && position >= 0 && position < 5) {
          players[position] = player;
        } else {
          players[0] = player;
        }
        if (teamId === 'team1') {
          newGame.team1.players = players;
        } else {
          newGame.team2.players = players;
        }
        return newGame;
      }

      const team = teamId === 'team1' ? prev.team1 : prev.team2;
      
      // Don't add if game is in progress
      if (prev.status === 'in-progress') {
        return prev;
      }

      // Ensure players array has 5 slots
      const currentPlayers: (Player | null)[] = [...team.players];
      while (currentPlayers.length < 5) {
        currentPlayers.push(null);
      }
      
      // Add player at specified position
      if (position !== undefined && position >= 0 && position < 5) {
        if (currentPlayers[position] === null) {
          currentPlayers[position] = player;
        } else {
          // Slot is taken, find next empty slot
          const nextEmpty = currentPlayers.findIndex(p => p === null);
          if (nextEmpty !== -1) {
            currentPlayers[nextEmpty] = player;
          } else {
            return prev; // Team is full
          }
        }
      } else {
        // No position specified, add to first empty slot
        const firstEmpty = currentPlayers.findIndex(p => p === null);
        if (firstEmpty !== -1) {
          currentPlayers[firstEmpty] = player;
        } else {
          return prev; // Team is full
        }
      }
      
      const finalPlayers = currentPlayers;

      const updatedTeam = { ...team, players: finalPlayers };
      const team1Count = (teamId === 'team1' ? finalPlayers : prev.team1.players).filter(p => p !== null).length;
      const team2Count = (teamId === 'team2' ? finalPlayers : prev.team2.players).filter(p => p !== null).length;
      const totalPlayers = team1Count + team2Count;

      return {
        ...prev,
        team1: teamId === 'team1' ? updatedTeam : prev.team1,
        team2: teamId === 'team2' ? updatedTeam : prev.team2,
        status: totalPlayers === 10 ? 'ready' : 'waiting',
      };
    });
  }, []);

  const joinGame = useCallback((player: Player) => {
    setCurrentGame((prev) => {
      if (!prev) {
        const newGame: Game = {
          id: `game-${Date.now()}`,
          status: 'waiting',
          team1: {
            id: 'team1',
            name: 'Team 1',
            players: [null, null, null, null, null],
            color: '#1E88E5',
          },
          team2: {
            id: 'team2',
            name: 'Team 2',
            players: [null, null, null, null, null],
            color: '#F44336',
          },
          queue: [player],
          createdAt: new Date(),
        };
        // Initialize with 3 empty teams with consistent IDs
        initializeQueueTeams();
        return newGame;
      }

      // Add player to queue
      const newQueue = [...prev.queue, player];
      
      // If game is in progress or teams are full, just add to queue
      const currentGamePlayers = 
        prev.team1.players.filter(p => p !== null).length + 
        prev.team2.players.filter(p => p !== null).length;
      
      if (prev.status === 'in-progress' || currentGamePlayers >= 10) {
        // Don't reorganize - just add to queue
        // The queue teams are managed separately via addPlayerToQueueTeam
        return {
          ...prev,
          queue: newQueue,
        };
      }

      // If we have less than 10 players, try to fill teams first
      const totalWithNew = currentGamePlayers + newQueue.length;

      // Auto-assign teams when we have 10 players total
      if (totalWithNew === 10) {
        const allPlayers = [
          ...prev.team1.players.filter((p): p is Player => p !== null),
          ...prev.team2.players.filter((p): p is Player => p !== null),
          ...newQueue
        ];
        const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
        
        // Create 5-slot arrays
        const team1Slots: (Player | null)[] = [...shuffled.slice(0, 5)];
        while (team1Slots.length < 5) team1Slots.push(null);
        const team2Slots: (Player | null)[] = [...shuffled.slice(5, 10)];
        while (team2Slots.length < 5) team2Slots.push(null);
        
        // Ensure 3 empty teams are shown with consistent IDs
        initializeQueueTeams();
        
        return {
          ...prev,
          status: 'ready',
          team1: {
            ...prev.team1,
            players: team1Slots.slice(0, 5),
          },
          team2: {
            ...prev.team2,
            players: team2Slots.slice(0, 5),
          },
          queue: [],
        };
      }

      // Don't reorganize queue - just add to it
      // Queue teams are managed separately
      return {
        ...prev,
        queue: newQueue,
      };
    });
  }, [initializeQueueTeams]);

  const addPlayerToQueueTeam = useCallback((teamIndex: number, position: number, player: Player) => {
    setUpcomingGames((prevUpcoming) => {
      // Ensure we have 3 teams with consistent IDs
      let updated = [...prevUpcoming];
      
      // Initialize teams if empty or ensure we have 3 teams
      if (updated.length === 0) {
        updated = [
          {
            id: 'queue-team-0',
            name: 'Team 3',
            players: [null, null, null, null, null],
            color: '#1E88E5',
          },
          {
            id: 'queue-team-1',
            name: 'Team 4',
            players: [null, null, null, null, null],
            color: '#F44336',
          },
          {
            id: 'queue-team-2',
            name: 'Team 5',
            players: [null, null, null, null, null],
            color: '#1E88E5',
          },
        ];
      } else {
        // Ensure we have exactly 3 teams, maintaining their IDs
        while (updated.length < 3) {
          const index = updated.length;
          updated.push({
            id: `queue-team-${index}`,
            name: `Team ${index + 3}`,
            players: [null, null, null, null, null],
            color: index % 2 === 0 ? '#1E88E5' : '#F44336',
          });
        }
      }
      
      if (teamIndex >= updated.length) {
        // Shouldn't happen, but handle gracefully
        return updated;
      }

      const team = { ...updated[teamIndex] };
      const players = [...team.players];
      
      // Ensure array has 5 slots
      while (players.length < 5) {
        players.push(null);
      }
      
      // Add player at position if slot is empty
      if (position >= 0 && position < 5 && players[position] === null) {
        players[position] = player;
      } else if (position >= 0 && position < 5) {
        // Slot is taken, find next empty slot
        const nextEmpty = players.findIndex(p => p === null);
        if (nextEmpty !== -1) {
          players[nextEmpty] = player;
        }
      }
      
      team.players = players.slice(0, 5);
      updated[teamIndex] = team;
      
      return updated;
    });
  }, []);

  const leaveGame = useCallback((playerId: string) => {
    // Remove from upcoming games first
    setUpcomingGames((prev) => {
      const updated = prev.map((team) => ({
        ...team,
        players: team.players.map(p => p && p.id === playerId ? null : p) as (Player | null)[],
      }));
      
      // Don't reorganize - just keep the teams as they are (maintain 3 teams)
      // Only reorganize if we need to fill gaps, but keep all 3 teams visible
      return updated;
    });

    setCurrentGame((prev) => {
      if (!prev) return null;

      // Remove from teams (maintain 5-slot structure)
      const team1Players: (Player | null)[] = prev.team1.players.map(p => p && p.id === playerId ? null : p);
      const team2Players: (Player | null)[] = prev.team2.players.map(p => p && p.id === playerId ? null : p);
      const queuePlayers = prev.queue.filter((p) => p.id !== playerId);

      const totalRemaining = 
        team1Players.filter(p => p !== null).length + 
        team2Players.filter(p => p !== null).length + 
        queuePlayers.length;

      // Don't reorganize queue - just keep it as is
      // The queue teams are managed separately and should maintain their structure

      // If game was ready/in-progress and someone leaves, reorganize
      if (prev.status === 'ready' || prev.status === 'in-progress') {
        const allPlayers = [
          ...team1Players.filter((p): p is Player => p !== null),
          ...team2Players.filter((p): p is Player => p !== null),
          ...queuePlayers
        ];
        
        if (allPlayers.length >= 10) {
          const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
          // Pad to 5 slots with nulls
          const team1Slots: (Player | null)[] = [...shuffled.slice(0, 5)];
          while (team1Slots.length < 5) team1Slots.push(null);
          const team2Slots: (Player | null)[] = [...shuffled.slice(5, 10)];
          while (team2Slots.length < 5) team2Slots.push(null);
          
          return {
            ...prev,
            team1: {
              ...prev.team1,
              players: team1Slots.slice(0, 5),
            },
            team2: {
              ...prev.team2,
              players: team2Slots.slice(0, 5),
            },
            queue: queuePlayers,
            status: 'ready',
          };
        } else {
          return {
            ...prev,
            team1: { ...prev.team1, players: team1Players },
            team2: { ...prev.team2, players: team2Players },
            queue: queuePlayers,
            status: 'waiting',
          };
        }
      }

      return {
        ...prev,
        team1: { ...prev.team1, players: team1Players },
        team2: { ...prev.team2, players: team2Players },
        queue: queuePlayers,
      };
    });
  }, []);

  const substitutePlayer = useCallback((fromPlayerId: string, toPlayer: Player) => {
    setCurrentGame((prev) => {
      if (!prev) return null;

      const replaceInTeam = (team: Team): Team => {
        const playerIndex = team.players.findIndex((p) => p && p.id === fromPlayerId);
        if (playerIndex !== -1) {
          const newPlayers: (Player | null)[] = [...team.players];
          newPlayers[playerIndex] = toPlayer;
          return { ...team, players: newPlayers };
        }
        return team;
      };

      return {
        ...prev,
        team1: replaceInTeam(prev.team1),
        team2: replaceInTeam(prev.team2),
      };
    });
  }, []);

  const startGame = useCallback(() => {
    setCurrentGame((prev) => {
      if (!prev || (prev.status !== 'ready' && prev.status !== 'waiting')) return prev;
      
      return {
        ...prev,
        status: 'in-progress',
        startedAt: new Date(),
      };
    });
  }, []);

  const endGame = useCallback((winner: 'team1' | 'team2') => {
    setCurrentGame((prev) => {
      if (!prev || prev.status !== 'in-progress') {
        return prev;
      }

      const winningTeam = winner === 'team1' ? prev.team1 : prev.team2;
      const losingTeam = winner === 'team1' ? prev.team2 : prev.team1;

      // Get the first upcoming team (if exists) using ref to avoid nested state updates
      const prevUpcoming = upcomingGamesRef.current;
      const nextTeam = prevUpcoming.length > 0 ? prevUpcoming[0] : null;
      
      // Shift players forward: Team 4 becomes Team 3, Team 5 becomes Team 4, add empty Team 5
      let updatedUpcoming: Team[] = [];
      if (prevUpcoming.length > 1) {
        // Move Team 4 to Team 3 position
        updatedUpcoming.push({
          id: 'queue-team-0',
          name: 'Team 3',
          players: prevUpcoming[1].players,
          color: '#1E88E5',
        });
      } else {
        // No team to move up, add empty Team 3
        updatedUpcoming.push({
          id: 'queue-team-0',
          name: 'Team 3',
          players: [null, null, null, null, null],
          color: '#1E88E5',
        });
      }
      
      if (prevUpcoming.length > 2) {
        // Move Team 5 to Team 4 position
        updatedUpcoming.push({
          id: 'queue-team-1',
          name: 'Team 4',
          players: prevUpcoming[2].players,
          color: '#F44336',
        });
      } else {
        // No team to move up, add empty Team 4
        updatedUpcoming.push({
          id: 'queue-team-1',
          name: 'Team 4',
          players: [null, null, null, null, null],
          color: '#F44336',
        });
      }
      
      // Always add empty Team 5 at the end
      updatedUpcoming.push({
        id: 'queue-team-2',
        name: 'Team 5',
        players: [null, null, null, null, null],
        color: '#1E88E5',
      });

      // Update upcoming games first
      setUpcomingGames(updatedUpcoming);

      // If we have a next team, move it up to play against the winners
      // Always preserve Team 1 and Team 2 names, only update players
      if (nextTeam) {
        const nextTeamPlayerCount = nextTeam.players.filter(p => p !== null).length;
        
        if (winner === 'team1') {
          // Team 1 won, so Team 2 gets replaced by next team's players
          // Always preserve Team 1 (blue) and Team 2 (red) colors
          return {
            ...prev,
            status: nextTeamPlayerCount === 5 ? 'ready' : 'waiting',
            team1: {
              ...winningTeam,
              id: 'team1',
              name: 'Team 1',
              color: '#1E88E5', // Always blue
            },
            team2: {
              ...nextTeam,
              id: 'team2',
              name: 'Team 2',
              color: '#F44336', // Always red
            },
            queue: prev.queue,
            winner: undefined,
            startedAt: undefined,
          };
        } else {
          // Team 2 won, so Team 1 gets replaced by next team's players
          // Always preserve Team 1 (blue) and Team 2 (red) colors
          return {
            ...prev,
            status: nextTeamPlayerCount === 5 ? 'ready' : 'waiting',
            team1: {
              ...nextTeam,
              id: 'team1',
              name: 'Team 1',
              color: '#1E88E5', // Always blue
            },
            team2: {
              ...winningTeam,
              id: 'team2',
              name: 'Team 2',
              color: '#F44336', // Always red
            },
            queue: prev.queue,
            winner: undefined,
            startedAt: undefined,
          };
        }
      }

      // If no next team, just mark game as completed and keep winners
      // Always preserve Team 1 and Team 2 names
      const emptyTeam: (Player | null)[] = [null, null, null, null, null];
      
      if (winner === 'team1') {
        return {
          ...prev,
          status: 'waiting',
          team1: {
            ...winningTeam,
            id: 'team1',
            name: 'Team 1',
            color: '#1E88E5', // Always blue
          },
          team2: {
            ...losingTeam,
            id: 'team2',
            name: 'Team 2',
            color: '#F44336', // Always red
            players: emptyTeam,
          },
          queue: prev.queue,
          winner,
        };
      } else {
        return {
          ...prev,
          status: 'waiting',
          team1: {
            ...losingTeam,
            id: 'team1',
            name: 'Team 1',
            color: '#1E88E5', // Always blue
            players: emptyTeam,
          },
          team2: {
            ...winningTeam,
            id: 'team2',
            name: 'Team 2',
            color: '#F44336', // Always red
          },
          queue: prev.queue,
          winner,
        };
      }
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        currentGame,
        upcomingGames,
        addPlayerToTeam,
        addPlayerToQueueTeam,
        leaveGame,
        substitutePlayer,
        createNewGame,
        startGame,
        endGame,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}


