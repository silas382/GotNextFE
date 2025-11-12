import { PlayerCard } from '@/components/PlayerCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useGame } from '@/context/GameContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ExploreScreen() {
  const { currentGame } = useGame();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const allPlayers = currentGame
    ? [
        ...currentGame.team1.players.filter((p): p is NonNullable<typeof p> => p !== null),
        ...currentGame.team2.players.filter((p): p is NonNullable<typeof p> => p !== null),
        ...currentGame.queue
      ]
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.webContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.delay(100)}>
          <Text style={[styles.title, { color: colors.text }]}>Game Details</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Manage players and view game information
          </Text>
        </Animated.View>

        {currentGame && (
          <>
            {/* Game Status */}
            <Animated.View
              entering={FadeIn.delay(200)}
              style={[styles.card, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  name={
                    currentGame.status === 'in-progress'
                      ? 'play.circle.fill'
                      : currentGame.status === 'ready'
                        ? 'checkmark.circle.fill'
                        : 'clock.fill'
                  }
                  size={24}
                  color={colors.court}
                />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Game Status</Text>
              </View>
              <Text style={[styles.cardValue, { color: colors.text }]}>
                {currentGame.status === 'waiting'
                  ? 'Waiting for players...'
                  : currentGame.status === 'ready'
                    ? 'Ready to start!'
                    : 'Game in progress'}
              </Text>
            </Animated.View>

            {/* Team Information */}
            <Animated.View entering={FadeIn.delay(300)}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Teams</Text>
              
              <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.teamInfo}>
                  <View style={[styles.teamColorBar, { backgroundColor: currentGame.team1.color }]} />
                  <View style={styles.teamDetails}>
                    <Text style={[styles.teamName, { color: colors.text }]}>
                      {currentGame.team1.name}
                    </Text>
                    <Text style={[styles.teamCount, { color: colors.icon }]}>
                      {currentGame.team1.players.filter(p => p !== null).length} players
                    </Text>
                  </View>
                </View>
                <View style={styles.teamPlayers}>
                  {currentGame.team1.players
                    .filter((p): p is NonNullable<typeof p> => p !== null)
                    .map((player) => (
                      <PlayerCard key={player.id} player={player} teamColor={currentGame.team1.color} />
                    ))}
                </View>
              </View>

              <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.teamInfo}>
                  <View style={[styles.teamColorBar, { backgroundColor: currentGame.team2.color }]} />
                  <View style={styles.teamDetails}>
                    <Text style={[styles.teamName, { color: colors.text }]}>
                      {currentGame.team2.name}
                    </Text>
                    <Text style={[styles.teamCount, { color: colors.icon }]}>
                      {currentGame.team2.players.filter(p => p !== null).length} players
                    </Text>
                  </View>
                </View>
                <View style={styles.teamPlayers}>
                  {currentGame.team2.players
                    .filter((p): p is NonNullable<typeof p> => p !== null)
                    .map((player) => (
                      <PlayerCard key={player.id} player={player} teamColor={currentGame.team2.color} />
                    ))}
                </View>
              </View>
            </Animated.View>

            {/* All Players */}
            {allPlayers.length > 0 && (
              <Animated.View entering={FadeIn.delay(400)}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>All Players</Text>
                <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                  <View style={styles.allPlayersGrid}>
                    {allPlayers.map((player) => (
                      <PlayerCard key={player.id} player={player} size="small" />
                    ))}
                  </View>
                </View>
              </Animated.View>
            )}
          </>
        )}

        {!currentGame && (
          <Animated.View entering={FadeIn.delay(200)}>
            <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
              <IconSymbol name="basketball" size={48} color={colors.icon} />
              <Text style={[styles.emptyText, { color: colors.text }]}>No active game</Text>
              <Text style={[styles.emptySubtext, { color: colors.icon }]}>
                Go to the home screen to start a new game
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 1200 : '100%',
    width: '100%',
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamColorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamCount: {
    fontSize: 14,
  },
  teamPlayers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allPlayersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emptyState: {
    padding: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
