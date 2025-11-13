import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Player } from '@/types/game';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

interface PlayerCardProps {
  player: Player;
  onRemove?: () => void;
  onSubstitute?: () => void;
  onPress?: () => void;
  teamColor?: string;
  size?: 'small' | 'medium' | 'large';
  showActions?: boolean;
  clickable?: boolean;
}

export function PlayerCard({
  player,
  onRemove,
  onSubstitute,
  onPress,
  teamColor,
  size = 'medium',
  showActions = false,
  clickable = false,
}: PlayerCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cardSize = size === 'small' ? 60 : size === 'large' ? 100 : 80;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const AvatarComponent = clickable && onPress ? Pressable : View;

  return (
    <View style={[styles.container, { width: cardSize, height: cardSize }]}>
      <AvatarComponent
        style={[
          styles.avatar,
          {
            backgroundColor: teamColor || colors.court,
            width: cardSize - 8,
            height: cardSize - 8,
            borderRadius: (cardSize - 8) / 2,
          },
          clickable && styles.clickable,
        ]}
        onPress={clickable && onPress ? onPress : undefined}>
        <Text
          style={[
            styles.initials,
            {
              fontSize: size === 'small' ? 12 : size === 'large' ? 20 : 16,
              color: '#FFFFFF',
              marginBottom: 2,
            },
          ]}>
          {getInitials(player.name)}
        </Text>
        <Text
          style={[
            styles.nameOnCircle,
            {
              fontSize: size === 'small' ? 8 : size === 'large' ? 12 : 10,
              color: '#FFFFFF',
            },
          ]}
          numberOfLines={1}>
          {player.name}
        </Text>
      </AvatarComponent>
      <Text
        style={[
          styles.name,
          {
            fontSize: size === 'small' ? 10 : size === 'large' ? 14 : 12,
            color: colors.text,
          },
        ]}
        numberOfLines={2}
        ellipsizeMode="tail">
        {player.name}
      </Text>
      {showActions && (onRemove || onSubstitute) && (
        <View style={styles.actions}>
          {onSubstitute && (
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.warning }]}
              onPress={onSubstitute}>
              <IconSymbol name="arrow.triangle.swap" size={12} color="#FFFFFF" />
            </Pressable>
          )}
          {onRemove && (
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={onRemove}>
              <IconSymbol name="xmark" size={12} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 4,
  },
  clickable: {
    cursor: 'pointer',
  },
  initials: {
    fontWeight: 'bold',
  },
  nameOnCircle: {
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 100,
    minHeight: 28,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 4,
  },
  actionButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

