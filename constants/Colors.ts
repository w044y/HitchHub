// Updated colors to match your HitchSpot branding
const primaryBlue = '#4A90E2';
const darkBlue = '#357ABD';
const lightGray = '#F9F9F9';
const mediumGray = '#666666';
const darkGray = '#333333';
const errorRed = '#FF6B6B';
const borderGray = '#E0E0E0';

export default {
  light: {
    text: darkGray,
    background: '#ffffff',
    tint: primaryBlue,
    tabIconDefault: '#CCCCCC',
    tabIconSelected: primaryBlue,
    // Additional colors for your app
    primary: primaryBlue,
    secondary: lightGray,
    accent: darkBlue,
    error: errorRed,
    border: borderGray,
    textSecondary: mediumGray,
    inputBackground: lightGray,
    shadow: primaryBlue,
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    tint: '#ffffff',
    tabIconDefault: '#666666',
    tabIconSelected: '#ffffff',
    // Dark mode versions
    primary: primaryBlue,
    secondary: '#1a1a1a',
    accent: '#ffffff',
    error: errorRed,
    border: '#333333',
    textSecondary: '#CCCCCC',
    inputBackground: '#1a1a1a',
    shadow: '#000000',
  },
};