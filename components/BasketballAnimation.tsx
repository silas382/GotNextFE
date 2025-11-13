import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface BasketballAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

export function BasketballAnimation({ visible, onComplete }: BasketballAnimationProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Animation values
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const bounceY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const textScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Reset values
      scale.value = 0;
      rotation.value = 0;
      bounceY.value = 0;
      opacity.value = 0;
      textScale.value = 0;

      // Start animations
      opacity.value = withTiming(1, { duration: 200 });
      
      // Basketball appears with scale and rotation
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 100,
      });
      
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 2000,
          easing: Easing.linear,
        }),
        -1,
        false
      );

      // Bouncing animation
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-30, {
            duration: 400,
            easing: Easing.out(Easing.quad),
          }),
          withTiming(0, {
            duration: 400,
            easing: Easing.in(Easing.quad),
          })
        ),
        -1,
        false
      );

      // Text appears
      textScale.value = withSequence(
        withSpring(0, { damping: 10 }),
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 }, () => {
          if (onComplete) {
            onComplete();
          }
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  const basketballStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
        { translateY: bounceY.value },
      ],
      opacity: opacity.value,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textScale.value }],
      opacity: opacity.value,
    };
  });

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.overlay, { opacity: opacity.value }]} />
      
      {/* Basketball */}
      <Animated.View style={[styles.basketballContainer, basketballStyle]}>
        <View style={[styles.basketball, { backgroundColor: '#FF6B35' }]}>
          {/* Basketball lines */}
          <View style={styles.basketballLine1} />
          <View style={styles.basketballLine2} />
          <View style={styles.basketballLine3} />
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={[styles.gameText, { color: colors.court }]}>GAME</Text>
        <Text style={[styles.startedText, { color: colors.court }]}>STARTED!</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  basketballContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  basketball: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  basketballLine1: {
    position: 'absolute',
    width: 120,
    height: 4,
    backgroundColor: '#000',
    opacity: 0.3,
  },
  basketballLine2: {
    position: 'absolute',
    width: 4,
    height: 120,
    backgroundColor: '#000',
    opacity: 0.3,
  },
  basketballLine3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#000',
    opacity: 0.2,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  gameText: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  startedText: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: -8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});

