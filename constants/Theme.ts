// constants/Theme.ts
import { Colors, ColorScheme } from './Colors';
import { Typography } from './Typography';
import { Layout } from './Layout';

export const createTheme = (colorScheme: ColorScheme) => ({
    colors: Colors[colorScheme],
    typography: Typography,
    layout: Layout,

    // Component-specific styles using your design tokens
    components: {
        button: {
            primary: {
                backgroundColor: Colors[colorScheme].primary,
                height: Layout.components.button.height,
                borderRadius: Layout.radius.base,
                paddingHorizontal: Layout.spacing.lg,
            },
            secondary: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: Colors[colorScheme].border,
                height: Layout.components.button.height,
                borderRadius: Layout.radius.base,
                paddingHorizontal: Layout.spacing.lg,
            },
        },
        input: {
            backgroundColor: Colors[colorScheme].background,
            borderWidth: 1,
            borderColor: Colors[colorScheme].border,
            height: Layout.components.input.height,
            borderRadius: Layout.radius.base,
            paddingHorizontal: Layout.spacing.base,
            ...Typography.styles.body,
        },
        card: {
            backgroundColor: Colors[colorScheme].backgroundSecondary,
            borderRadius: Layout.radius.lg,
            padding: Layout.spacing.base,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
    },
});

export type Theme = ReturnType<typeof createTheme>;