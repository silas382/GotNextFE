import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Player } from '@/types/game';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { PlayerCard } from './PlayerCard';

interface QueueListProps {
  players: Player[];
  onPlayerRemove?: (playerId: string) => void;
  maxSlots?: number;
}

export function QueueList({ players, onPlayerRemove, maxSlots = 10 }: QueueListProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const slotsNeeded = maxSlots - players.length;
  const emptySlots = Array.from({ length: Math.max(0, slotsNeeded) }, (_, i) => i);

  return (
    <View style={[styles.container, { backgroundColor: colors.queueBackground }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Waiting Queue</Text>
        <Text style={[styles.count, { color: colors.court }]}>
          {players.length}/{maxSlots}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {players.map((player, index) => (
          <Animated.View
            key={player.id}
            entering={FadeInRight.delay(index * 50)}
            style={styles.playerWrapper}>
            <PlayerCard
              player={player}
              size="small"
              onRemove={onPlayerRemove ? () => onPlayerRemove(player.id) : undefined}
              showActions={true}
            />
            <Text style={[styles.position, { color: colors.court }]}>#{index + 1}</Text>
          </Animated.View>
        ))}
        {emptySlots.map((_, index) => (
          <View key={`empty-${index}`} style={styles.emptySlot}>
            <View
              style={[
                styles.emptyCircle,
                {
                  borderColor: colors.court,
                  backgroundColor: colors.cardBackground,
                },
              ]}>
              <Text style={[styles.emptyText, { color: colors.court }]}>+</Text>
            </View>
            <Text style={[styles.emptyLabel, { color: colors.icon }]}>
              Slot {players.length + index + 1}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingRight: 16,
  },
  playerWrapper: {
    alignItems: 'center',
    marginRight: 12,
  },
  position: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  emptySlot: {
    alignItems: 'center',
    marginRight: 12,
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});

