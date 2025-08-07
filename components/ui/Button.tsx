// components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../Themed';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';
import { Layout} from '../../constants/Layout';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'base' | 'lg';
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
                                                  title,
                                                  onPress,
                                                  variant = 'primary',
                                                  size = 'base',
                                                  disabled = false,
                                                  icon,
                                                  style,
                                              }) => {
    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: Layout.radius.lg,
            paddingHorizontal: Layout.spacing.lg,
            ...getSizeStyle(),
        };

        switch (variant) {
            case 'primary':
                return {
                    ...baseStyle,
                    backgroundColor: disabled ? Colors.neutral[300] : Colors.primary[500],
                    shadowColor: Colors.primary[700],
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                };
            case 'secondary':
                return {
                    ...baseStyle,
                    backgroundColor: disabled ? Colors.neutral[200] : Colors.secondary[500],
                };
            case 'outline':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: disabled ? Colors.neutral[300] : Colors.primary[500],
                };
            case 'ghost':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                };
            default:
                return baseStyle;
        }
    };

    const getTextStyle = (): TextStyle => {
        const baseTextStyle: TextStyle = {
            fontFamily: Typography.fonts.semiBold,
            ...getSizeTextStyle(),
        };

        switch (variant) {
            case 'primary':
                return {
                    ...baseTextStyle,
                    color: Colors.text.inverse,
                };
            case 'secondary':
                return {
                    ...baseTextStyle,
                    color: Colors.text.inverse,
                };
            case 'outline':
                return {
                    ...baseTextStyle,
                    color: disabled ? Colors.neutral[400] : Colors.primary[500],
                };
            case 'ghost':
                return {
                    ...baseTextStyle,
                    color: disabled ? Colors.neutral[400] : Colors.primary[500],
                };
            default:
                return baseTextStyle;
        }
    };

    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'sm':
                return { height: 36, paddingHorizontal: Layout.spacing.base };
            case 'lg':
                return { height: 56, paddingHorizontal: Layout.spacing.xl };
            default:
                return { height: Layout.components.button.height };
        }
    };

    const getSizeTextStyle = (): TextStyle => {
        switch (size) {
            case 'sm':
                return { fontSize: Typography.sizes.sm };
            case 'lg':
                return { fontSize: Typography.sizes.lg };
            default:
                return { fontSize: Typography.sizes.base };
        }
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {icon && <Text style={[{ marginRight: Layout.spacing.xs }, getTextStyle()]}>{icon}</Text>}
            <Text style={getTextStyle()}>{title}</Text>
        </TouchableOpacity>
    );
};