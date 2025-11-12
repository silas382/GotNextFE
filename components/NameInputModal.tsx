import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Storage } from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { IconSymbol } from './ui/icon-symbol';

interface NameInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
}

const STORAGE_KEY = 'gotnext_player_name';

export function NameInputModal({ visible, onClose, onSave, initialName }: NameInputModalProps) {
  const [name, setName] = useState(initialName || '');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (visible) {
      // Load saved name
      Storage.getItem(STORAGE_KEY).then((savedName) => {
        if (savedName) {
          setName(savedName);
        } else if (initialName) {
          setName(initialName);
        }
      });
    }
  }, [visible, initialName]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      Storage.setItem(STORAGE_KEY, trimmedName);
      onSave(trimmedName);
      onClose();
    }
  };

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
            <Text style={[styles.title, { color: colors.text }]}>Enter Your Name</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark.circle.fill" size={24} color={colors.icon} />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <IconSymbol name="person.fill" size={20} color={colors.court} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.court }]}
              placeholder="Your name"
              placeholderTextColor={colors.icon}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>

          <Pressable
            style={[
              styles.saveButton,
              {
                backgroundColor: name.trim().length > 0 ? colors.court : colors.icon,
              },
            ]}
            onPress={handleSave}
            disabled={name.trim().length === 0}>
            <Text style={styles.saveButtonText}>Save Name</Text>
          </Pressable>

          <Text style={[styles.hint, { color: colors.icon }]}>
            Your name will be saved for future games
          </Text>
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
    fontSize: 24,
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
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
  },
});

