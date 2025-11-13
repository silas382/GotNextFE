import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Player } from '@/types/game';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface DeleteConfirmModalProps {
  visible: boolean;
  player: Player | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ visible, player, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!player) return null;

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
            <Text style={[styles.title, { color: colors.text }]}>Remove Player?</Text>
            <Text style={[styles.message, { color: colors.icon }]}>
              Are you sure you want to remove {player.name} from the game?
            </Text>
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={onCancel}>
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.confirmButton, { backgroundColor: colors.error }]}
                onPress={onConfirm}>
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Remove</Text>
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
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
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

