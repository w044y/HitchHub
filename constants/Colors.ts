// constants/Colors.ts - Minimal like Strava/AllTrails
export const Colors = {
  light: {
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',

    // Text
    text: '#000000',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',

    // Primary action color - Terracotta
    primary: '#D4622A',
    primaryLight: '#E67E22',
    primaryDark: '#B8541F',

    // UI Elements
    border: '#E5E7EB',
    separator: '#F3F4F6',

    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    // Tab bar
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#D4622A',
    tint: '#D4622A',
  },

  dark: {
    // Backgrounds
    background: '#000000',
    backgroundSecondary: '#1C1C1E',

    // Text
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',

    // Primary action color - Brighter terracotta for dark mode
    primary: '#E67E22',
    primaryLight: '#F39C12',
    primaryDark: '#D4622A',

    // UI Elements
    border: '#374151',
    separator: '#1F2937',

    // Semantic colors (adjusted for dark)
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',

    // Tab bar
    tabIconDefault: '#6B7280',
    tabIconSelected: '#E67E22',
    tint: '#E67E22',
  },

  // Safety colors (same for both modes, high contrast)
  safety: {
    high: '#10B981',    // Green
    medium: '#F59E0B',  // Amber
    low: '#EF4444',     // Red
  },

  // Map-specific colors (work on both light/dark backgrounds)
  map: {
    userLocation: '#007AFF',
    selectedMarker: '#D4622A',
    markerBorder: '#FFFFFF',
  },
};