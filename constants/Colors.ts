// constants/Colors.ts - Completely rewritten for reliability
export interface ColorPalette {
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  border: string;
  separator: string;
  success: string;
  warning: string;
  error: string;
  tabIconDefault: string;
  tabIconSelected: string;
  tint: string;
}

const lightColors: ColorPalette = {
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  text: '#000000',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  primary: '#D4622A',
  primaryLight: '#E67E22',
  primaryDark: '#B8541F',
  border: '#E5E7EB',
  separator: '#F3F4F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  tabIconDefault: '#9CA3AF',
  tabIconSelected: '#D4622A',
  tint: '#D4622A',
};

const darkColors: ColorPalette = {
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  primary: '#E67E22',
  primaryLight: '#F39C12',
  primaryDark: '#D4622A',
  border: '#374151',
  separator: '#1F2937',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  tabIconDefault: '#6B7280',
  tabIconSelected: '#E67E22',
  tint: '#E67E22',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
  safety: {
    high: '#10B981',
    medium: '#F59E0B',
    low: '#EF4444',
  },
  map: {
    userLocation: '#007AFF',
    selectedMarker: '#D4622A',
    markerBorder: '#FFFFFF',
  },
};

export type ColorScheme = 'light' | 'dark';