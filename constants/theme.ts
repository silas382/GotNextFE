/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// GotNext Basketball Theme
const tintColorLight = '#FF6B35'; // Energetic orange
const tintColorDark = '#FF6B35';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    // Basketball court colors
    court: '#FF6B35',
    courtSecondary: '#FF8C5A',
    courtDark: '#E55A2B',
    // Team colors
    team1: '#1E88E5', // Blue
    team2: '#F44336', // Red
    // Status colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    // Backgrounds
    cardBackground: '#F8F9FA',
    queueBackground: '#FFF5F0',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0F0F0F',
    tint: tintColorDark,
    icon: '#CCCCCC',
    tabIconDefault: '#888888',
    tabIconSelected: tintColorDark,
    // Basketball court colors
    court: '#FF6B35',
    courtSecondary: '#FF8C5A',
    courtDark: '#E55A2B',
    // Team colors
    team1: '#42A5F5',
    team2: '#EF5350',
    // Status colors
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    // Backgrounds
    cardBackground: '#1A1A1A',
    queueBackground: '#1F0F0A',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
