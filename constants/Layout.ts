// constants/Layout.ts - Add missing spacing values
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
    // Screen dimensions
    screen: {
        width,
        height,
    },

    // Spacing scale (8px base) - FIXED: Added missing md property
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,        // ADDED: This was missing
        base: 16,      // Keep existing for compatibility
        lg: 24,
        xl: 32,
        xxl: 40,       // ADDED: For consistency
        '2xl': 40,
        '3xl': 48,
        '4xl': 64,
    },

    // Border radius - FIXED: Added missing md property
    radius: {
        sm: 4,
        md: 8,         // ADDED: This was missing
        base: 8,       // Keep existing for compatibility
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },

    // Component sizes
    components: {
        button: {
            height: 48,
            minWidth: 120,
        },
        input: {
            height: 48,
        },
        avatar: {
            sm: 32,
            base: 40,
            lg: 56,
            xl: 80,
        },
        icon: {
            sm: 16,
            base: 20,
            lg: 24,
            xl: 32,
        },
    },
};