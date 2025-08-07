import {Colors} from "@/constants/Colors";

export const Typography = {
    // Font families
    fonts: {
        regular: 'Inter-Regular',
        medium: 'Inter-Medium',
        semiBold: 'Inter-SemiBold',
        bold: 'Inter-Bold',
        // For headings - more adventurous
        heading: 'Poppins-Bold',
    },

    // Font sizes
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

    // Line heights
    lineHeights: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
    },

    // Text styles
    styles: {
        h1: {
            fontFamily: 'Poppins-Bold',
            fontSize: 36,
            lineHeight: 40,
            color: Colors.text.primary,
        },
        h2: {
            fontFamily: 'Poppins-Bold',
            fontSize: 30,
            lineHeight: 34,
            color: Colors.text.primary,
        },
        h3: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 24,
            lineHeight: 28,
            color: Colors.text.primary,
        },
        body: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            lineHeight: 22,
            color: Colors.text.primary,
        },
        caption: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
            lineHeight: 16,
            color: Colors.text.secondary,
        },
    },
};