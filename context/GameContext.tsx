import { Game, Player, Team } from '@/types/game';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface GameContextType {
  currentGame: Game | null;
  upcomingGames: Game[];
  addPlayerToTeam: (teamId: string, player: Player, position?: number) => void;
  leaveGame: (playerId: string) => void;
  substitutePlayer: (fromPlayerId: string, toPlayer: Player) => void;
  createNewGame: () => void;
  startGame: () => void;
  endGame: (winner: 'team1' | 'team2') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);

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
  }, []);

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
            players: [],
            color: '#1E88E5',
          },
          team2: {
            id: 'team2',
            name: 'Team 2',
            players: [],
            color: '#F44336',
          },
          queue: [player],
          createdAt: new Date(),
        };
        return newGame;
      }

      // If game is in progress, add to queue and organize into teams of 5
      if (prev.status === 'in-progress') {
        const newQueue = [...prev.queue, player];
        
        // Check if we have enough for a new team (5 players)
        if (newQueue.length >= 5) {
          const teamPlayers = newQueue.slice(0, 5);
          const remainingQueue = newQueue.slice(5);
          
          setUpcomingGames((prevUpcoming) => {
            // Pad to 5 slots with nulls
            const teamSlots: (Player | null)[] = [...teamPlayers];
            while (teamSlots.length < 5) teamSlots.push(null);
            
            const newTeam: Team = {
              id: `upcoming-team-${Date.now()}`,
              name: `Team ${prevUpcoming.length + 1}`,
              players: teamSlots.slice(0, 5),
              color: prevUpcoming.length % 2 === 0 ? '#1E88E5' : '#F44336',
            };
            return [...prevUpcoming, newTeam];
          });
          
          return {
            ...prev,
            queue: remainingQueue,
          };
        }
        
        return {
          ...prev,
          queue: newQueue,
        };
      }

      // If current game has 10 players (teams are full), add to queue
      const currentGamePlayers = 
        prev.team1.players.filter(p => p !== null).length + 
        prev.team2.players.filter(p => p !== null).length;
      if (currentGamePlayers >= 10) {
        return {
          ...prev,
          queue: [...prev.queue, player],
        };
      }

      // Add player to queue
      const newQueue = [...prev.queue, player];
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

      return {
        ...prev,
        queue: newQueue,
      };
    });
  }, []);

  const leaveGame = useCallback((playerId: string) => {
    // Remove from upcoming games first
    setUpcomingGames((prev) =>
      prev
        .map((team) => ({
          ...team,
          players: team.players.map(p => p && p.id === playerId ? null : p) as (Player | null)[],
        }))
        .filter((team) => team.players.some(p => p !== null))
    );

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
            queue: [],
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
      if (!prev || prev.status !== 'ready') return prev;
      
      return {
        ...prev,
        status: 'in-progress',
        startedAt: new Date(),
      };
    });
  }, []);

  const endGame = useCallback((winner: 'team1' | 'team2') => {
    setCurrentGame((prev) => {
      if (!prev || prev.status !== 'in-progress') return prev;

      const winningTeam = winner === 'team1' ? prev.team1 : prev.team2;
      const losingTeam = winner === 'team1' ? prev.team2 : prev.team1;

      // Get next team from queue (first 5 players)
      const nextTeamPlayers = prev.queue.slice(0, 5);
      const remainingQueue = prev.queue.slice(5);

      // If we have a full team in queue, create new game with winners vs next team
      if (nextTeamPlayers.length === 5) {
        const nextTeamSlots: (Player | null)[] = [...nextTeamPlayers];
        while (nextTeamSlots.length < 5) nextTeamSlots.push(null);
        
        const nextTeam: Team = {
          id: `team-${Date.now()}`,
          name: 'Next Team',
          players: nextTeamSlots.slice(0, 5),
          color: winningTeam.color === '#1E88E5' ? '#F44336' : '#1E88E5',
        };

        return {
          ...prev,
          status: 'ready',
          team1: winner === 'team1' ? winningTeam : nextTeam,
          team2: winner === 'team2' ? winningTeam : nextTeam,
          queue: remainingQueue,
          winner: undefined,
          startedAt: undefined,
        };
      }

      // If no full team ready, just mark game as completed and keep winners
      const emptyTeam: (Player | null)[] = [null, null, null, null, null];
      return {
        ...prev,
        status: 'waiting',
        team1: winner === 'team1' ? winningTeam : { ...losingTeam, players: emptyTeam },
        team2: winner === 'team2' ? winningTeam : { ...losingTeam, players: emptyTeam },
        queue: remainingQueue,
        winner,
      };
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        currentGame,
        upcomingGames,
        addPlayerToTeam,
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

