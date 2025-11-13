import { AddPlayerModal } from '@/components/AddPlayerModal';
import { BasketballAnimation } from '@/components/BasketballAnimation';
import { CourtView } from '@/components/CourtView';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { JoinButton } from '@/components/JoinButton';
import { UpcomingTeams } from '@/components/UpcomingTeams';
import { WinnerSelectionModal } from '@/components/WinnerSelectionModal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useGame } from '@/context/GameContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Player } from '@/types/game';
import { HapticFeedback } from '@/utils/haptics';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  const { currentGame, upcomingGames, addPlayerToTeam, addPlayerToQueueTeam, joinGame, leaveGame, startGame, endGame, createNewGame } = useGame();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBasketballAnimation, setShowBasketballAnimation] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{ teamId: string; position: number; teamName: string; teamType?: 'court' | 'queue' } | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  useEffect(() => {
    if (!currentGame) {
      createNewGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmptySlotPress = (teamId: string, position: number) => {
    if (currentGame?.status === 'in-progress') return;
    
    const team = teamId === 'team1' ? currentGame?.team1 : currentGame?.team2;
    setSelectedTeam({
      teamId,
      position,
      teamName: team?.name || (teamId === 'team1' ? 'Team 1' : 'Team 2'),
      teamType: 'court',
    });
    setShowAddPlayerModal(true);
  };

  const handleQueueSlotPress = (teamIndex: number, position: number) => {
    if (currentGame?.status === 'in-progress') return;
    
    setSelectedTeam({
      teamId: `queue-team-${teamIndex}`,
      position,
      teamName: `Queue Team ${teamIndex + 1}`,
      teamType: 'queue',
    });
    setShowAddPlayerModal(true);
  };

  const handlePlayerPress = (playerId: string) => {
    if (currentGame?.status === 'in-progress') return;
    // Find the player from current game or upcoming games
    const allPlayers = [
      ...(currentGame?.team1.players.filter((p): p is Player => p !== null) || []),
      ...(currentGame?.team2.players.filter((p): p is Player => p !== null) || []),
      ...(upcomingGames.flatMap(team => team.players.filter((p): p is Player => p !== null))),
    ];
    const player = allPlayers.find(p => p.id === playerId);
    if (player) {
      setPlayerToDelete(player);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (playerToDelete) {
      leaveGame(playerToDelete.id);
      setShowDeleteModal(false);
      setPlayerToDelete(null);
      HapticFeedback.notification(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPlayerToDelete(null);
  };

  const handleAddPlayer = (name: string) => {
    if (!selectedTeam || !currentGame) return;

    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random()}`,
      name: name.trim(),
      joinedAt: new Date(),
    };

    if (selectedTeam.teamType === 'queue') {
      // Extract team index from teamId (format: "queue-team-0")
      const teamIndexMatch = selectedTeam.teamId.match(/queue-team-(\d+)/);
      const teamIndex = teamIndexMatch ? parseInt(teamIndexMatch[1], 10) : 0;
      addPlayerToQueueTeam(teamIndex, selectedTeam.position, newPlayer);
    } else {
      // Add to court team
      addPlayerToTeam(selectedTeam.teamId, newPlayer, selectedTeam.position);
    }
    
    setShowAddPlayerModal(false);
    setSelectedTeam(null);
    HapticFeedback.notification(Haptics.NotificationFeedbackType.Success);
  };

  const handleStartGame = () => {
    if (!currentGame) return;
    
    const totalPlayers = (currentGame.team1.players.filter(p => p !== null).length +
      currentGame.team2.players.filter(p => p !== null).length);
    
    // Always allow starting the game (regardless of player count)
    if (currentGame.status === 'waiting' || currentGame.status === 'ready') {
      startGame();
      setShowBasketballAnimation(true);
      HapticFeedback.impact(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handleEndGame = () => {
    if (currentGame?.status === 'in-progress') {
      setShowWinnerModal(true);
    }
  };

  const handleSelectWinner = (winner: 'team1' | 'team2') => {
    endGame(winner);
    setShowWinnerModal(false);
    HapticFeedback.notification(Haptics.NotificationFeedbackType.Success);
  };

  const totalPlayers =
    currentGame
      ? currentGame.team1.players.filter(p => p !== null).length + 
        currentGame.team2.players.filter(p => p !== null).length
      : 0;

  const isReady = currentGame?.status === 'ready' && totalPlayers === 10;
  const isInProgress = currentGame?.status === 'in-progress';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.webContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>GotNext</Text>
                <Text style={[styles.subtitle, { color: colors.icon }]}>
                  Basketball Pickup Games
                </Text>
              </View>
              <View style={[styles.statusIndicator, { backgroundColor: colors.court }]}>
                <IconSymbol name="basketball.fill" size={24} color="#FFFFFF" />
              </View>
            </View>
          </Animated.View>

          {/* Court View */}
          {currentGame && (
            <Animated.View entering={FadeIn.delay(200)}>
              <CourtView
                game={currentGame}
                onPlayerPress={handlePlayerPress}
                onPlayerRemove={leaveGame}
                onEmptySlotPress={handleEmptySlotPress}
              />
            </Animated.View>
          )}

          {/* Upcoming Teams - Show 3 teams of 5 below the court */}
          <UpcomingTeams
            teams={upcomingGames}
            onPlayerRemove={leaveGame}
            onPlayerPress={handlePlayerPress}
            onEmptySlotPress={handleQueueSlotPress}
          />


          {/* Player Count Info */}
          <Animated.View
            entering={FadeIn.delay(400)}
            style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.infoRow}>
              <IconSymbol name="person.3.fill" size={20} color={colors.court} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                {totalPlayers} / 10 players
              </Text>
            </View>
            {isReady && (
              <View style={styles.infoRow}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text style={[styles.infoText, { color: colors.success }]}>
                  Ready to start!
                </Text>
              </View>
            )}
            {isInProgress && (
              <View style={styles.infoRow}>
                <IconSymbol name="play.circle.fill" size={20} color={colors.court} />
                <Text style={[styles.infoText, { color: colors.court }]}>
                  Game in progress
                </Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Action Buttons */}
        <Animated.View entering={SlideInDown.delay(500)} style={styles.footer}>
          {(currentGame?.status === 'waiting' || currentGame?.status === 'ready') && (
            <JoinButton
              onPress={handleStartGame}
              label="Start Game"
              variant="primary"
            />
          )}
          {isInProgress && (
            <JoinButton
              onPress={handleEndGame}
              label="End Game"
              variant="secondary"
            />
          )}
          {!isReady && !isInProgress && (
            <Text style={[styles.instructionText, { color: colors.icon }]}>
              Tap empty circles to add players
            </Text>
          )}
        </Animated.View>
      </View>

      {/* Add Player Modal */}
      <AddPlayerModal
        visible={showAddPlayerModal}
        onClose={() => {
          setShowAddPlayerModal(false);
          setSelectedTeam(null);
        }}
        onAdd={handleAddPlayer}
        teamName={selectedTeam?.teamName}
        position={selectedTeam?.position}
      />

      {/* Winner Selection Modal */}
      {currentGame && (
        <WinnerSelectionModal
          visible={showWinnerModal}
          team1={currentGame.team1}
          team2={currentGame.team2}
          onSelectWinner={handleSelectWinner}
          onClose={() => setShowWinnerModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={showDeleteModal}
        player={playerToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Basketball Animation */}
      <BasketballAnimation
        visible={showBasketballAnimation}
        onComplete={() => setShowBasketballAnimation(false)}
      />
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
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  statusIndicator: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
