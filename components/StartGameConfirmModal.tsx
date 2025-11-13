import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface StartGameConfirmModalProps {
  visible: boolean;
  playerCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StartGameConfirmModal({
  visible,
  playerCount,
  onConfirm,
  onCancel,
}: StartGameConfirmModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <Pressable onPress={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
            <Text style={[styles.title, { color: colors.text }]}>Start Game?</Text>
            <Text style={[styles.message, { color: colors.icon }]}>
              Are you sure you want to start this game with only {playerCount} player{playerCount !== 1 ? 's' : ''}?
            </Text>
            <Text style={[styles.subMessage, { color: colors.icon }]}>
              A full game requires 10 players (5 per team).
            </Text>
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={onCancel}>
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.confirmButton, { backgroundColor: colors.court }]}
                onPress={onConfirm}>
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Start Game</Text>
              </Pressable>
            </View>
          </Pressable>
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
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  subMessage: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  confirmButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

