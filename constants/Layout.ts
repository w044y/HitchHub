// constants/Layout.ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
    // Screen dimensions
    screen: {
        width,
        height,
    },

    // Spacing scale (8px base)
    spacing: {
        xs: 4,
        sm: 8,
        base: 16,
        lg: 24,
        xl: 32,
        '2xl': 40,
        '3xl': 48,
        '4xl': 64,
    },

    // Border radius
    radius: {
        sm: 4,
        base: 8,
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