// components/map/MapView.tsx
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, Region, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { SpotMarker } from '../spots/SpotMarker';

export interface HitchhikingSpot {
    id: string;
    name: string;
    type: 'rest_stop' | 'gas_station' | 'bridge' | 'highway_entrance' | 'town_center' | 'other';
    coordinates: {
        latitude: number;
        longitude: number;
    };
    rating: number;
    safetyRating: 'high' | 'medium' | 'low';
    description: string;
    addedBy: string;
    lastUpdated: string;
    verified: boolean;
}

export interface MapViewHandle {
    animateToRegion: (region: Region) => void;
    animateToCoordinate: (coordinate: { latitude: number; longitude: number }) => void;
    getCurrentRegion: () => Promise<Region | undefined>;
}

interface HitchhikingMapViewProps {
    style?: any;
    initialRegion?: Region;
    spots?: HitchhikingSpot[];
    showUserLocation?: boolean;
    onSpotPress?: (spot: HitchhikingSpot) => void;
    onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
    onRegionChange?: (region: Region) => void;
    customMapStyle?: any[];
}

export const HitchhikingMapView = forwardRef<MapViewHandle, HitchhikingMapViewProps>(
    ({
         style,
         initialRegion,
         spots = [],
         showUserLocation = true,
         onSpotPress,
         onMapPress,
         onRegionChange,
         customMapStyle
     }, ref) => {
        const [location, setLocation] = useState<Location.LocationObject | null>(null);
        const [loading, setLoading] = useState(true);
        const [region, setRegion] = useState<Region>(
            initialRegion || {
                latitude: 52.5200, // Berlin default
                longitude: 13.4050,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        );

        const mapRef = useRef<MapView>(null);

        // Expose methods to parent components
        useImperativeHandle(ref, () => ({
            animateToRegion: (newRegion: Region) => {
                mapRef.current?.animateToRegion(newRegion, 1000);
            },
            animateToCoordinate: (coordinate: { latitude: number; longitude: number }) => {
                mapRef.current?.animateToRegion({
                    ...coordinate,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 1000);
            },
            getCurrentRegion: async () => {
                return await mapRef.current?.getMapBoundaries().then(boundaries => ({
                    latitude: (boundaries.northEast.latitude + boundaries.southWest.latitude) / 2,
                    longitude: (boundaries.northEast.longitude + boundaries.southWest.longitude) / 2,
                    latitudeDelta: boundaries.northEast.latitude - boundaries.southWest.latitude,
                    longitudeDelta: boundaries.northEast.longitude - boundaries.southWest.longitude,
                }));
            }
        }));

        useEffect(() => {
            initializeLocation();
        }, []);

        const initializeLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    console.warn('Location permission denied');
                    setLoading(false);
                    return;
                }

                const currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                setLocation(currentLocation);

                if (!initialRegion) {
                    setRegion({
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                }
            } catch (error) {
                console.error('Location error:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleMapPress = (event: MapPressEvent) => {
            console.log('🗺️ Map pressed!', event.nativeEvent); // Add this for debugging

            if (onMapPress) {
                const { coordinate } = event.nativeEvent;
                console.log('📍 Coordinate:', coordinate); // Add this for debugging
                onMapPress(coordinate);
            }
        };

        const handleRegionChangeComplete = (newRegion: Region) => {
            setRegion(newRegion);
            if (onRegionChange) {
                onRegionChange(newRegion);
            }
        };

        if (loading) {
            return (
                <View style={[styles.container, style]}>
                    <LoadingSpinner message="Loading map..." color="#2E7D32" />
                </View>
            );
        }

        return (
            <View style={[styles.container, style]}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={handleRegionChangeComplete}
                    onPress={handleMapPress}
                    showsUserLocation={showUserLocation}
                    showsMyLocationButton={false}
                    showsCompass={true}
                    showsScale={Platform.OS === 'ios'}
                    customMapStyle={customMapStyle}
                    loadingEnabled={true}
                    loadingIndicatorColor="#2E7D32"
                    loadingBackgroundColor="#f5f5f5"
                >
                    {spots.map((spot) => (
                        <SpotMarker
                            key={spot.id}
                            spot={spot}
                            onPress={() => onSpotPress?.(spot)}
                        />
                    ))}
                </MapView>
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});