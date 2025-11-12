import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { IconSymbol } from './ui/icon-symbol';

interface AddPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
  teamName?: string;
  position?: number;
}

export function AddPlayerModal({ visible, onClose, onAdd, teamName, position }: AddPlayerModalProps) {
  const [name, setName] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleAdd = () => {
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      onAdd(trimmedName);
      setName('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Pressable onPress={() => {}}>
          <Animated.View
            entering={SlideInUp}
            style={[styles.modal, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {teamName ? `Add Player to ${teamName}` : 'Add Player'}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark.circle.fill" size={24} color={colors.icon} />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <IconSymbol name="person.fill" size={20} color={colors.court} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.court }]}
              placeholder="Enter player name"
              placeholderTextColor={colors.icon}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
          </View>

          <Pressable
            style={[
              styles.addButton,
              {
                backgroundColor: name.trim().length > 0 ? colors.court : colors.icon,
              },
            ]}
            onPress={handleAdd}
            disabled={name.trim().length === 0}>
            <Text style={styles.addButtonText}>Add Player</Text>
          </Pressable>
          </Animated.View>
        </Pressable>
      </View>
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
    position: 'relative',
  },
  modal: {
    width: '100%',
    maxWidth: 400,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

