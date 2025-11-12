import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HapticFeedback } from '@/utils/haptics';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface JoinButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  variant?: 'primary' | 'secondary';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function JoinButton({
  onPress,
  disabled = false,
  loading = false,
  label = 'Call Next',
  variant = 'primary',
}: JoinButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    HapticFeedback.impact(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      HapticFeedback.impact(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const backgroundColor = variant === 'primary' ? colors.court : colors.cardBackground;
  const textColor = variant === 'primary' ? '#FFFFFF' : colors.court;

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          backgroundColor: disabled ? colors.icon : backgroundColor,
          borderColor: variant === 'secondary' ? colors.court : 'transparent',
          borderWidth: variant === 'secondary' ? 2 : 0,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

