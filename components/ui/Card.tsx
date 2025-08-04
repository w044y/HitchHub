import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: any;
    padding?: number;
    margin?: boolean;
}

export function Card({
                         children,
                         onPress,
                         style,
                         padding = 16,
                         margin = true
                     }: CardProps) {
    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            style={[
                styles.card,
                { padding },
                margin && styles.margin,
                style
            ]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            {children}
        </Component>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    margin: {
        marginBottom: 12,
    },
});