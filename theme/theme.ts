import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Sustainable color palette with earth tones
export const sustainableColors = {
    // Primary greens - representing nature and sustainability
    primary: '#2E7D32', // Forest green
    primaryLight: '#4CAF50', // Lighter forest green
    primaryDark: '#1B5E20', // Dark forest green

    // Secondary earth tones
    secondary: '#8D6E63', // Warm brown
    secondaryLight: '#A1887F', // Light brown
    secondaryDark: '#5D4037', // Dark brown

    // Accent blues - representing clean water/air
    accent: '#0277BD', // Ocean blue
    accentLight: '#03A9F4', // Sky blue
    accentDark: '#01579B', // Deep ocean blue

    // Background colors
    background: '#FAFAFA',
    backgroundDark: '#121212',
    surface: '#FFFFFF',
    surfaceDark: '#1E1E1E',

    // Text colors
    onBackground: '#212121',
    onBackgroundDark: '#FFFFFF',
    onSurface: '#212121',
    onSurfaceDark: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onAccent: '#FFFFFF',

    // Status colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Neutral grays
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
};

// Light theme configuration
export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: sustainableColors.primary,
        primaryContainer: sustainableColors.primaryLight,
        secondary: sustainableColors.secondary,
        secondaryContainer: sustainableColors.secondaryLight,
        tertiary: sustainableColors.accent,
        tertiaryContainer: sustainableColors.accentLight,
        surface: sustainableColors.surface,
        surfaceVariant: sustainableColors.gray100,
        background: sustainableColors.background,
        error: sustainableColors.error,
        errorContainer: '#FFEBEE',
        onPrimary: sustainableColors.onPrimary,
        onSecondary: sustainableColors.onSecondary,
        onTertiary: sustainableColors.onAccent,
        onSurface: sustainableColors.onSurface,
        onBackground: sustainableColors.onBackground,
        onError: '#FFFFFF',
        outline: sustainableColors.gray400,
        outlineVariant: sustainableColors.gray200,
        shadow: sustainableColors.gray900,
        scrim: sustainableColors.gray900,
        inverseSurface: sustainableColors.gray800,
        inverseOnSurface: sustainableColors.gray100,
        inversePrimary: sustainableColors.primaryLight,
    },
    fonts: {
        ...MD3LightTheme.fonts,
        default: {
            fontFamily: 'Roboto-Regular',
        },
        displayLarge: {
            fontFamily: 'Roboto-Bold',
            fontSize: 57,
            fontWeight: '400' as const,
            lineHeight: 64,
        },
        displayMedium: {
            fontFamily: 'Roboto-Bold',
            fontSize: 45,
            fontWeight: '400' as const,
            lineHeight: 52,
        },
        displaySmall: {
            fontFamily: 'Roboto-Bold',
            fontSize: 36,
            fontWeight: '400' as const,
            lineHeight: 44,
        },
        headlineLarge: {
            fontFamily: 'Roboto-Bold',
            fontSize: 32,
            fontWeight: '400' as const,
            lineHeight: 40,
        },
        headlineMedium: {
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '400' as const,
            lineHeight: 36,
        },
        headlineSmall: {
            fontFamily: 'Roboto-Medium',
            fontSize: 24,
            fontWeight: '400' as const,
            lineHeight: 32,
        },
        titleLarge: {
            fontFamily: 'Roboto-Medium',
            fontSize: 22,
            fontWeight: '400' as const,
            lineHeight: 28,
        },
        titleMedium: {
            fontFamily: 'Roboto-Medium',
            fontSize: 16,
            fontWeight: '500' as const,
            lineHeight: 24,
        },
        titleSmall: {
            fontFamily: 'Roboto-Medium',
            fontSize: 14,
            fontWeight: '500' as const,
            lineHeight: 20,
        },
        bodyLarge: {
            fontFamily: 'Roboto-Regular',
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 24,
        },
        bodyMedium: {
            fontFamily: 'Roboto-Regular',
            fontSize: 14,
            fontWeight: '400' as const,
            lineHeight: 20,
        },
        bodySmall: {
            fontFamily: 'Roboto-Regular',
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 16,
        },
        labelLarge: {
            fontFamily: 'Roboto-Medium',
            fontSize: 14,
            fontWeight: '500' as const,
            lineHeight: 20,
        },
        labelMedium: {
            fontFamily: 'Roboto-Medium',
            fontSize: 12,
            fontWeight: '500' as const,
            lineHeight: 16,
        },
        labelSmall: {
            fontFamily: 'Roboto-Medium',
            fontSize: 11,
            fontWeight: '500' as const,
            lineHeight: 16,
        },
    },
};

// Dark theme configuration
export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: sustainableColors.primaryLight,
        primaryContainer: sustainableColors.primaryDark,
        secondary: sustainableColors.secondaryLight,
        secondaryContainer: sustainableColors.secondaryDark,
        tertiary: sustainableColors.accentLight,
        tertiaryContainer: sustainableColors.accentDark,
        surface: sustainableColors.surfaceDark,
        surfaceVariant: sustainableColors.gray800,
        background: sustainableColors.backgroundDark,
        error: '#CF6679',
        errorContainer: '#8C1D18',
        onPrimary: sustainableColors.gray900,
        onSecondary: sustainableColors.gray900,
        onTertiary: sustainableColors.gray900,
        onSurface: sustainableColors.onSurfaceDark,
        onBackground: sustainableColors.onBackgroundDark,
        onError: '#000000',
        outline: sustainableColors.gray500,
        outlineVariant: sustainableColors.gray700,
        shadow: '#000000',
        scrim: '#000000',
        inverseSurface: sustainableColors.gray100,
        inverseOnSurface: sustainableColors.gray800,
        inversePrimary: sustainableColors.primary,
    },
    fonts: lightTheme.fonts, // Use same fonts for both themes
};

// Default theme (light)
export const theme = lightTheme;

// Custom spacing values
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
};

// Custom border radius values
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
};

// Elevation values for shadows
export const elevation = {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 16,
};

// Animation durations
export const duration = {
    fast: 150,
    normal: 300,
    slow: 500,
};

// Breakpoints for responsive design
export const breakpoints = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
};

