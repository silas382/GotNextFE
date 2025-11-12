import { JoinButton } from '@/components/JoinButton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

export default function SignInScreen() {
  const [name, setName] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSignIn = () => {
    if (name.trim().length > 0) {
      // In a real app, this would save to context/storage
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.court }]}>
            <IconSymbol name="basketball.fill" size={64} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>GotNext</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Join the game. Call your shot.
          </Text>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(200)} style={styles.form}>
          <View style={styles.inputContainer}>
            <IconSymbol name="person.fill" size={20} color={colors.icon} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.court }]}
              placeholder="Enter your name"
              placeholderTextColor={colors.icon}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />
          </View>

          <JoinButton
            onPress={handleSignIn}
            label="Get Started"
            disabled={name.trim().length === 0}
          />

          <Text style={[styles.footerText, { color: colors.icon }]}>
            By continuing, you agree to fair play and good sportsmanship
          </Text>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});

