import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Set Mapbox access token
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '');

export interface HitchhikingSpot {
    id: string;
    name: string;
    type: 'rest_stop' | 'gas_station' | 'bridge' | 'highway_entrance' | 'town_center' | 'other';
    coordinates: [number, number]; // [longitude, latitude]
    rating: number;
    safetyRating: 'high' | 'medium' | 'low';
    description?: string;
    addedBy?: string;
    lastUpdated?: string;
}

interface MapViewProps {
    style?: any;
    showUserLocation?: boolean;
    zoomLevel?: number;
    spots?: HitchhikingSpot[];
    onSpotPress?: (spot: HitchhikingSpot) => void;
    onMapPress?: (coordinates: [number, number]) => void;
}

export const MapView = React.forwardRef<
    { flyToLocation: (coordinates: [number, number], zoom?: number) => void; flyToUserLocation: () => void },
    MapViewProps
>(({
       style,
       showUserLocation = true,
       zoomLevel = 10,
       spots = [],
       onSpotPress,
       onMapPress
   }, ref) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<MapboxGL.MapView>(null);
    const cameraRef = useRef<MapboxGL.Camera>(null);

    useEffect(() => {
        getLocationPermission();
    }, []);

    const getLocationPermission = async () => {
        try {
            // Request location permissions
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Location Permission',
                    'Please enable location access to see your position and find nearby spots.',
                    [{ text: 'OK' }]
                );
                setLoading(false);
                return;
            }

            // Get current location
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setLocation(currentLocation);
        } catch (error) {
            console.error('Location error:', error);
            Alert.alert('Info', 'Could not get your location. You can still explore the map.');
        } finally {
            setLoading(false);
        }
    };

    const flyToLocation = (coordinates: [number, number], zoom = 12) => {
        cameraRef.current?.setCamera({
            centerCoordinate: coordinates,
            zoomLevel: zoom,
            animationDuration: 1500,
            animationMode: 'flyTo',
        });
    };

    const flyToUserLocation = () => {
        if (location) {
            flyToLocation([location.coords.longitude, location.coords.latitude], 15);
        }
    };

    const getSpotColor = (safetyRating: string) => {
        switch (safetyRating) {
            case 'high': return '#4CAF50'; // Green
            case 'medium': return '#FF9800'; // Orange
            case 'low': return '#F44336'; // Red
            default: return '#2196F3'; // Blue
        }
    };

    const handleMapPress = (feature: any) => {
        if (onMapPress && feature.geometry) {
            const coordinates = feature.geometry.coordinates as [number, number];
            onMapPress(coordinates);
        }
    };

    const handleSpotPress = (spot: HitchhikingSpot) => {
        if (onSpotPress) {
            onSpotPress(spot);
        }
        // Fly to the spot
        flyToLocation(spot.coordinates, 16);
    };

    // Expose methods via useImperativeHandle
    React.useImperativeHandle(ref, () => ({
        flyToLocation,
        flyToUserLocation,
    }));

    if (loading) {
        return <LoadingSpinner message="Loading map..." />;
    }

    // Default center (Europe - Berlin) or user location
    const centerCoordinate = location
        ? [location.coords.longitude, location.coords.latitude]
        : [13.4050, 52.5200]; // Berlin coordinates

    return (
        <View style={[styles.container, style]}>
            <MapboxGL.MapView
                ref={mapRef}
                style={styles.map}
                styleURL="mapbox://styles/mapbox/outdoors-v12" // Perfect for travel/hiking
                onPress={handleMapPress}
                compassEnabled={true}
                compassViewPosition={3} // Top right
                logoEnabled={false}
                attributionEnabled={false}
            >
                <MapboxGL.Camera
                    ref={cameraRef}
                    centerCoordinate={centerCoordinate}
                    zoomLevel={zoomLevel}
                    animationMode="flyTo"
                    animationDuration={2000}
                />

                {/* User Location */}
                {showUserLocation && location && (
                    <MapboxGL.PointAnnotation
                        id="userLocation"
                        coordinate={[location.coords.longitude, location.coords.latitude]}
                    >
                        <View style={styles.userLocationMarker}>
                            <View style={styles.userLocationDot} />
                        </View>
                    </MapboxGL.PointAnnotation>
                )}

                {/* Hitchhiking Spots */}
                {spots.map((spot) => (
                    <MapboxGL.PointAnnotation
                        key={spot.id}
                        id={spot.id}
                        coordinate={spot.coordinates}
                        onSelected={() => handleSpotPress(spot)}
                    >
                        <View style={[
                            styles.spotMarker,
                            { backgroundColor: getSpotColor(spot.safetyRating) }
                        ]}>
                            <View style={styles.spotIconContainer}>
                                <View style={[
                                    styles.spotIcon,
                                    { backgroundColor: '#ffffff' }
                                ]} />
                            </View>
                        </View>
                    </MapboxGL.PointAnnotation>
                ))}
            </MapboxGL.MapView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    userLocationMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(74, 144, 226, 0.3)',
        borderWidth: 2,
        borderColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userLocationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4A90E2',
    },
    spotMarker: {
        width: 32,
        height: 32,
        borderRadius: 16,
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
    spotIconContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spotIcon: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});