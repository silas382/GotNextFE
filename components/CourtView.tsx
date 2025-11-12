import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Game } from '@/types/game';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { PlayerCard } from './PlayerCard';

const { width } = Dimensions.get('window');

interface CourtViewProps {
  game: Game;
  onPlayerPress?: (playerId: string) => void;
  onPlayerRemove?: (playerId: string) => void;
  onEmptySlotPress?: (teamId: string, position: number) => void;
}

export function CourtView({ game, onPlayerPress, onPlayerRemove, onEmptySlotPress }: CourtViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderTeam = (team: typeof game.team1, isTop: boolean) => {
    // Ensure we have 5 slots (pad with null if needed)
    const playersWithSlots: (typeof team.players[0] | null)[] = [...team.players];
    while (playersWithSlots.length < 5) {
      playersWithSlots.push(null);
    }

    return (
      <View style={styles.teamRow}>
        {/* Always show 5 slots - filled players or empty slots */}
        {Array.from({ length: 5 }).map((_, index) => {
          const player = playersWithSlots[index];
          
          if (player) {
            return (
              <Animated.View
                key={player.id}
                entering={isTop ? FadeInDown.delay(index * 100) : FadeInUp.delay(index * 100)}
                style={styles.playerSlot}>
                <PlayerCard
                  player={player}
                  teamColor={team.color}
                  size="medium"
                  showActions={game.status === 'ready'}
                  clickable={!!onPlayerRemove && (game.status === 'waiting' || game.status === 'ready')}
                  onPress={onPlayerRemove ? () => onPlayerRemove(player.id) : undefined}
                />
              </Animated.View>
            );
          } else {
            return (
              <Pressable
                key={`empty-${team.id}-${index}`}
                style={[
                  styles.emptySlot,
                  {
                    borderColor: colors.court,
                    backgroundColor: colors.background,
                  },
                ]}
                onPress={onEmptySlotPress ? () => onEmptySlotPress(team.id, index) : undefined}
                disabled={!onEmptySlotPress || game.status === 'in-progress'}>
                <Text style={[styles.emptyText, { color: colors.court }]}>+</Text>
              </Pressable>
            );
          }
        })}
      </View>
    );
  };

  return (
    <View style={[styles.court, { backgroundColor: colors.court }]}>
      {/* Court lines */}
      <View style={[styles.centerLine, { backgroundColor: colors.background }]} />
      <View style={[styles.centerCircle, { borderColor: colors.background }]} />

      {/* Team 1 (Top) */}
      <View style={styles.teamSection}>
        <View style={[styles.teamLabel, { backgroundColor: game.team1.color }]}>
          <Text style={styles.teamLabelText}>{game.team1.name}</Text>
          <Text style={styles.teamCountText}>{game.team1.players.filter(p => p !== null).length}/5</Text>
        </View>
        {renderTeam(game.team1, true)}
      </View>

      {/* Team 2 (Bottom) */}
      <View style={styles.teamSection}>
        <View style={[styles.teamLabel, { backgroundColor: game.team2.color }]}>
          <Text style={styles.teamLabelText}>{game.team2.name}</Text>
          <Text style={styles.teamCountText}>{game.team2.players.filter(p => p !== null).length}/5</Text>
        </View>
        {renderTeam(game.team2, false)}
      </View>

      {/* Status indicator */}
      <View style={[styles.statusBadge, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.statusText, { color: colors.text }]}>
          {game.status === 'waiting'
            ? 'Waiting for players...'
            : game.status === 'ready'
              ? 'Ready to start!'
              : 'Game in progress'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  court: {
    width: '100%',
    minHeight: 240,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 16,
    paddingVertical: 20,
  },
  centerLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    top: '50%',
    zIndex: 1,
  },
  centerCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
    zIndex: 1,
  },
  teamSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 8,
    flex: 1,
  },
  teamLabel: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  teamLabelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  teamCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.9,
  },
  playerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 80,
  },
  emptySlot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -80,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

