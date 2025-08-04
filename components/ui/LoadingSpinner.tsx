import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Text } from '../Themed';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'large';
    color?: string;
}

export function LoadingSpinner({
                                   message = 'Loading...',
                                   size = 'large',
                                   color = '#2E7D32'
                               }: LoadingSpinnerProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
});