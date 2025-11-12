import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Team } from '@/types/game';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { IconSymbol } from './ui/icon-symbol';

interface WinnerSelectionModalProps {
  visible: boolean;
  team1: Team;
  team2: Team;
  onSelectWinner: (winner: 'team1' | 'team2') => void;
  onClose: () => void;
}

export function WinnerSelectionModal({
  visible,
  team1,
  team2,
  onSelectWinner,
  onClose,
}: WinnerSelectionModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          entering={SlideInUp}
          style={[styles.modal, { backgroundColor: colors.cardBackground }]}
          onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Select Winner</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark.circle.fill" size={24} color={colors.icon} />
            </Pressable>
          </View>

          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Who won the game?
          </Text>

          <View style={styles.teamsContainer}>
            <Pressable
              style={[styles.teamButton, { backgroundColor: team1.color }]}
              onPress={() => onSelectWinner('team1')}>
              <Text style={styles.teamButtonText}>{team1.name}</Text>
              <IconSymbol name="trophy.fill" size={32} color="#FFFFFF" />
            </Pressable>

            <Pressable
              style={[styles.teamButton, { backgroundColor: team2.color }]}
              onPress={() => onSelectWinner('team2')}>
              <Text style={styles.teamButtonText}>{team2.name}</Text>
              <IconSymbol name="trophy.fill" size={32} color="#FFFFFF" />
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  teamsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  teamButton: {
    flex: 1,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  teamButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

