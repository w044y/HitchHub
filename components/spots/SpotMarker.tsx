import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../components/Themed';
import { HitchhikingSpot } from '../map/MapView';

interface SpotMarkerProps {
    spot: HitchhikingSpot;
    onPress?: () => void;
    size?: 'small' | 'medium' | 'large';
}

export function SpotMarker({ spot, onPress, size = 'medium' }: SpotMarkerProps) {
    const getSpotColor = (safetyRating: string) => {
        switch (safetyRating) {
            case 'high': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'low': return '#F44336';
            default: return '#2196F3';
        }
    };

    const getSpotIcon = (type: string) => {
        switch (type) {
            case 'rest_stop': return '🛑';
            case 'gas_station': return '⛽';
            case 'bridge': return '🌉';
            case 'highway_entrance': return '🛣️';
            case 'town_center': return '🏘️';
            default: return '📍';
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small': return { width: 24, height: 24, borderRadius: 12 };
            case 'large': return { width: 40, height: 40, borderRadius: 20 };
            default: return { width: 32, height: 32, borderRadius: 16 };
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'small': return 12;
            case 'large': return 20;
            default: return 16;
        }
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={[
                styles.marker,
                getSizeStyle(),
                { backgroundColor: getSpotColor(spot.safetyRating) }
            ]}>
                <Text style={[styles.icon, { fontSize: getIconSize() }]}>
                    {getSpotIcon(spot.type)}
                </Text>
            </View>

            {/* Rating badge */}
            {spot.rating && (
                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐{spot.rating}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    marker: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    icon: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    ratingBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FF6B00',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 8,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});