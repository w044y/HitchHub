// components/spots/SpotMarker.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Text } from 'react-native';
import { HitchhikingSpot } from '../map/MapView';

interface SpotMarkerProps {
    spot: HitchhikingSpot;
    onPress?: () => void;
}

export const SpotMarker: React.FC<SpotMarkerProps> = ({ spot, onPress }) => {
    const getSafetyColor = (rating: string) => {
        switch (rating) {
            case 'high': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'low': return '#F44336';
            default: return '#666';
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

    return (
        <Marker
            coordinate={spot.coordinates}
            onPress={onPress}
            title={spot.name}
            description={`${spot.rating}★ • ${spot.safetyRating} safety`}
        >
            <View style={[styles.marker, { borderColor: getSafetyColor(spot.safetyRating) }]}>
                <Text style={styles.markerText}>
                    {getSpotIcon(spot.type)}
                </Text>
                {spot.verified && (
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                    </View>
                )}
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    marker: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    markerText: {
        fontSize: 16,
    },
    verifiedBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});