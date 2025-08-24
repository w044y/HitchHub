// Typography.ts - Add the missing text styles
import {Colors} from "../constants/Colors";

export const Typography = {
    fonts: {
        regular: 'Inter-Regular',
        medium: 'Inter-Medium',
        semiBold: 'Inter-SemiBold',
        bold: 'Inter-Bold',
        heading: 'Poppins-Bold',
    },

    sizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    lineHeights: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
    },

    // ADD: Complete text styles using your design tokens
    styles: {
        h1: {
            fontFamily: 'Poppins-Bold',
            fontSize: 48,
            lineHeight: 48 * 1.2,
            fontWeight: 'bold' as const,
        },
        h2: {
            fontFamily: 'Poppins-Bold',
            fontSize: 36,
            lineHeight: 36 * 1.2,
            fontWeight: 'bold' as const,
        },
        h3: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 24,
            lineHeight: 24 * 1.2,
            fontWeight: '600' as const,
        },
        h4: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 20,
            lineHeight: 20 * 1.4,
            fontWeight: '600' as const,
        },
        body: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            lineHeight: 16 * 1.4,
            fontWeight: 'normal' as const,
        },
        bodySmall: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            lineHeight: 14 * 1.4,
            fontWeight: 'normal' as const,
        },
        caption: {
            fontFamily: 'Inter-Regular',
            fontSize: 12,
            lineHeight: 12 * 1.4,
            fontWeight: 'normal' as const,
        },
        button: {
            fontFamily: 'Inter-Medium',
            fontSize: 16,
            lineHeight: 16 * 1.2,
            fontWeight: '500' as const,
        },
    },
};