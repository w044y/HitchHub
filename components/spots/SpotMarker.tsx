// components/spots/SpotMarker.tsx - Clean imports
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Text } from 'react-native';
import { HitchhikingSpot, TransportMode, TRANSPORT_MODE_EMOJIS } from '@/app/types/transport';

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

    const getPrimaryTransportEmoji = () => {
        if (!spot.transportModes || spot.transportModes.length === 0) {
            return '👍'; // Default to hitchhiking
        }
        return TRANSPORT_MODE_EMOJIS[spot.transportModes[0]];
    };

    return (
        <Marker
            coordinate={spot.coordinates}
            onPress={onPress}
            title={spot.name}
            description={`${spot.rating}⭐ • ${spot.safetyRating} safety • ${spot.transportModes?.length || 1} transport modes`}
        >
            <View style={[styles.marker, { borderColor: getSafetyColor(spot.safetyRating) }]}>
                {/* Main spot icon */}
                <Text style={styles.markerText}>
                    {getSpotIcon(spot.type)}
                </Text>

                {/* Transport mode indicator in bottom right */}
                <View style={styles.transportIndicator}>
                    <Text style={styles.transportEmoji}>
                        {getPrimaryTransportEmoji()}
                    </Text>
                    {/* Show count if multiple transport modes */}
                    {spot.transportModes && spot.transportModes.length > 1 && (
                        <Text style={styles.modeCount}>
                            {spot.transportModes.length}
                        </Text>
                    )}
                </View>

                {/* Verified badge */}
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
        minWidth: 40,
        minHeight: 40,
    },
    markerText: {
        fontSize: 16,
    },
    transportIndicator: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        backgroundColor: '#2196F3',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    transportEmoji: {
        fontSize: 10,
    },
    modeCount: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#FF4444',
        color: '#FFFFFF',
        fontSize: 8,
        fontWeight: 'bold',
        borderRadius: 6,
        width: 12,
        height: 12,
        textAlign: 'center',
        lineHeight: 12,
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