import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Team } from '@/types/game';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PlayerCard } from './PlayerCard';

interface UpcomingTeamsProps {
  teams: Team[];
  onPlayerRemove?: (playerId: string) => void;
}

export function UpcomingTeams({ teams, onPlayerRemove }: UpcomingTeamsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Show only next 3 teams, always show component even if empty
  const displayTeams = teams.slice(0, 3);
  
  // If no teams, show empty state with placeholder slots
  if (displayTeams.length === 0) {
    // Create 3 empty teams to show the structure
    const emptyTeams: Team[] = Array.from({ length: 3 }).map((_, index) => ({
      id: `empty-team-${index}`,
      name: `Team ${index + 1}`,
      players: [null, null, null, null, null],
      color: index % 2 === 0 ? '#1E88E5' : '#F44336',
    }));
    return (
      <Animated.View entering={FadeIn.delay(200)} style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Up Next</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {emptyTeams.map((team) => (
            <View
              key={team.id}
              style={[styles.teamCard, { backgroundColor: colors.cardBackground }]}>
              <View style={[styles.teamHeader, { backgroundColor: team.color }]}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamCount}>0/5</Text>
              </View>
              <View style={styles.playersContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
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

  return (
    <Animated.View entering={FadeIn.delay(200)} style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Up Next</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {displayTeams.map((team, teamIndex) => (
          <View
            key={team.id}
            style={[styles.teamCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.teamHeader, { backgroundColor: team.color }]}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamCount}>{team.players.filter(p => p !== null).length}/5</Text>
            </View>
            <View style={styles.playersContainer}>
              {/* Always show 5 slots */}
              {Array.from({ length: 5 }).map((_, index) => {
                const player = team.players[index];
                if (player) {
                  return (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      teamColor={team.color}
                      size="small"
                      clickable={!!onPlayerRemove}
                      onPress={onPlayerRemove ? () => onPlayerRemove(player.id) : undefined}
                    />
                  );
                } else {
                  return (
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
                  );
                }
              })}
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
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingRight: 16,
  },
  teamCard: {
    width: 200,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  teamCount: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  playersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
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

