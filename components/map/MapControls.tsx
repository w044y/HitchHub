// components/map/MapControls.tsx - Simplified version
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface MapControlsProps {
    onMyLocationPress: () => void;
    onFilterPress: () => void;
    onSearchPress: () => void;
    style?: any;
}

export const MapControls: React.FC<MapControlsProps> = ({
                                                            onMyLocationPress,
                                                            onFilterPress,
                                                            onSearchPress,
                                                            style
                                                        }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={[styles.container, style]}>
            {/* Primary Controls */}
            <View style={styles.primaryControls}>
                <TouchableOpacity
                    style={[styles.controlButton, { backgroundColor: colors.primary }]}
                    onPress={onMyLocationPress}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>📍</Text>
                </TouchableOpacity>
            </View>

            {/* Secondary Controls */}
            <View style={styles.secondaryControls}>
                <TouchableOpacity
                    style={[styles.controlButton, styles.secondaryButton, { borderColor: colors.primary }]}
                    onPress={onSearchPress}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>🔍</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlButton, styles.secondaryButton, { borderColor: colors.primary }]}
                    onPress={onFilterPress}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>⚙️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 16,
        bottom: 120,
        zIndex: 1000,
    },
    primaryControls: {
        gap: 12,
        marginBottom: 16,
    },
    secondaryControls: {
        gap: 8,
    },
    controlButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    secondaryButton: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
    },
    primaryButtonText: {
        fontSize: 20,
        color: '#ffffff',
    },
    secondaryButtonText: {
        fontSize: 18,
    },
});