import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Player } from '@/types/game';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { PlayerCard } from './PlayerCard';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface QueueLineProps {
  players: Player[];
  onPlayerRemove?: (playerId: string) => void;
  onEmptySlotPress?: (position: number) => void;
}

export function QueueLine({ players, onPlayerRemove, onEmptySlotPress }: QueueLineProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Calculate evenly spaced positions in a horizontal line (similar to teams)
  const cardWidth = 70;
  const spacing = Math.max(8, (width - cardWidth * 5) / 6);
  
  // Show up to 10 players (2 rows of 5, or scroll horizontally for more)
  const maxVisible = 10;
  const displayPlayers = players.slice(0, maxVisible);
  
  // Create positions for horizontal line
  const positions = Array.from({ length: 5 }).map((_, index) => ({
    x: spacing + index * (cardWidth + spacing),
    y: 0,
  }));

  // Split into rows of 5
  const row1 = displayPlayers.slice(0, 5);
  const row2 = displayPlayers.slice(5, 10);

  // Always show queue, even if empty

  return (
    <Animated.View entering={FadeIn.delay(300)} style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Queue</Text>
      <View style={[styles.queueContainer, { backgroundColor: colors.queueBackground }]}>
        {/* Row 1 */}
        <View style={styles.row}>
          {Array.from({ length: 5 }).map((_, index) => {
            const player = row1[index];
            const position = positions[index];
            
            if (player) {
              return (
                <View
                  key={player.id}
                  style={[
                    styles.playerSlot,
                    {
                      left: position.x,
                    },
                  ]}>
                  <PlayerCard
                    player={player}
                    size="small"
                    clickable={!!onPlayerRemove}
                    onPress={onPlayerRemove ? () => onPlayerRemove(player.id) : undefined}
                  />
                </View>
              );
            } else {
              return (
                <Pressable
                  key={`empty-1-${index}`}
                  style={[
                    styles.emptySlot,
                    {
                      left: position.x,
                      borderColor: colors.court,
                      backgroundColor: colors.background,
                    },
                  ]}
                  onPress={onEmptySlotPress ? () => onEmptySlotPress(index) : undefined}
                  disabled={!onEmptySlotPress}>
                  <Text style={[styles.emptyText, { color: colors.court }]}>+</Text>
                </Pressable>
              );
            }
          })}
        </View>

        {/* Row 2 - Always show 5 slots */}
        <View style={[styles.row, { marginTop: 80 }]}>
          {Array.from({ length: 5 }).map((_, index) => {
            const player = row2[index];
            const position = positions[index];
            
            if (player) {
              return (
                <View
                  key={player.id}
                  style={[
                    styles.playerSlot,
                    {
                      left: position.x,
                    },
                  ]}>
                  <PlayerCard
                    player={player}
                    size="small"
                    clickable={!!onPlayerRemove}
                    onPress={onPlayerRemove ? () => onPlayerRemove(player.id) : undefined}
                  />
                </View>
              );
            } else {
              return (
                <Pressable
                  key={`empty-2-${index}`}
                  style={[
                    styles.emptySlot,
                    {
                      left: position.x,
                      borderColor: colors.court,
                      backgroundColor: colors.background,
                    },
                  ]}
                  onPress={onEmptySlotPress ? () => onEmptySlotPress(index + 5) : undefined}
                  disabled={!onEmptySlotPress}>
                  <Text style={[styles.emptyText, { color: colors.court }]}>+</Text>
                </Pressable>
              );
            }
          })}
        </View>
      </View>
      {players.length > 10 && (
        <Text style={[styles.moreText, { color: colors.icon }]}>
          +{players.length - 10} more in queue
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  queueContainer: {
    minHeight: 160,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  row: {
    position: 'relative',
    height: 70,
    width: '100%',
  },
  playerSlot: {
    position: 'absolute',
  },
  emptySlot: {
    position: 'absolute',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  moreText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

