// components/map/SpotMarker.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Text } from '../Themed';
import { HitchhikingSpot } from '../map/MapView';

interface SpotMarkerProps {
    spot: HitchhikingSpot;
    onPress?: () => void;
    size?: 'small' | 'medium' | 'large';
}

export const SpotMarker: React.FC<SpotMarkerProps> = ({
                                                          spot,
                                                          onPress,
                                                          size = 'medium'
                                                      }) => {
    const getSafetyColor = (rating: string) => {
        switch (rating) {
            case 'high': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'low': return '#F44336';
            default: return '#2196F3';
        }
    };

    const getSpotTypeIcon = (type: string) => {
        switch (type) {
            case 'rest_stop': return '🛑';
            case 'gas_station': return '⛽';
            case 'bridge': return '🌉';
            case 'highway_entrance': return '🛣️';
            case 'town_center': return '🏘️';
            default: return '📍';
        }
    };

    const getMarkerSize = () => {
        switch (size) {
            case 'small': return { width: 30, height: 30 };
            case 'large': return { width: 50, height: 50 };
            default: return { width: 40, height: 40 };
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
        <Marker
            coordinate={spot.coordinates}
            onPress={onPress}
            title={spot.name}
            description={`⭐ ${spot.rating} • 🛡️ ${spot.safetyRating} • ${spot.type.replace('_', ' ')}`}
        >
            <View style={[
                styles.markerContainer,
                getMarkerSize(),
                { backgroundColor: getSafetyColor(spot.safetyRating) }
            ]}>
                <Text style={[styles.markerIcon, { fontSize: getIconSize() }]}>
                    {getSpotTypeIcon(spot.type)}
                </Text>

                {spot.verified && (
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedIcon}>✓</Text>
                    </View>
                )}

                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐{spot.rating}</Text>
                </View>
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        borderRadius: 20,
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
    markerIcon: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    verifiedBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    verifiedIcon: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    ratingBadge: {
        position: 'absolute',
        bottom: -8,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    ratingText: {
        color: '#ffffff',
        fontSize: 8,
        fontWeight: 'bold',
    },
});