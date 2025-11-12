import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Player } from '@/types/game';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PlayerCard } from './PlayerCard';

interface QueueTeamsProps {
  players: Player[];
  onPlayerRemove?: (playerId: string) => void;
}

export function QueueTeams({ players, onPlayerRemove }: QueueTeamsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Organize players into teams of 5
  const teams: Player[][] = [];
  for (let i = 0; i < players.length; i += 5) {
    teams.push(players.slice(i, i + 5));
  }

  if (players.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn.delay(300)} style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Waiting Queue</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        {players.length} player{players.length !== 1 ? 's' : ''} waiting
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {teams.map((team, teamIndex) => (
          <View
            key={teamIndex}
            style={[styles.teamCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.teamHeader}>
              <Text style={[styles.teamLabel, { color: colors.text }]}>
                Team {teamIndex + 1}
              </Text>
              <Text style={[styles.teamCount, { color: colors.court }]}>
                {team.length}/5
              </Text>
            </View>
            <View style={styles.playersContainer}>
              {team.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  size="small"
                  clickable={!!onPlayerRemove}
                  onPress={onPlayerRemove ? () => onPlayerRemove(player.id) : undefined}
                />
              ))}
              {Array.from({ length: 5 - team.length }).map((_, index) => (
                <View key={`empty-${index}`} style={styles.emptySlot}>
                  <View
                    style={[
                      styles.emptyCircle,
                      {
                        borderColor: colors.court,
                        backgroundColor: colors.background,
                      },
                    ]}>
                    <Text style={[styles.emptyText, { color: colors.court }]}>+</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: 16,
  },
  teamCard: {
    width: 200,
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  teamCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  playersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  emptySlot: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

