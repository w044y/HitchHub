// app/(tabs)/explore.tsx - Much cleaner version
import React, {useState, useRef, useEffect} from 'react';
import { View, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { Text } from '../../components/Themed';
import { Screen } from '../../components/layout/Screen';
import { HitchhikingMapView, MapViewHandle, HitchhikingSpot } from '../../components/map/MapView';
import { MapControls } from '../../components/map/MapControls';
import { Region } from 'react-native-maps';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { router } from 'expo-router';
import {apiClient} from "@/app/services/api";



export default function MapScreen() {
    const [spots, setSpots] = useState<HitchhikingSpot[]>([]); // Start with empty array

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpot, setSelectedSpot] = useState<HitchhikingSpot | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const mapRef = useRef<MapViewHandle>(null);

    useEffect(() => {
        fetchSpots();
    }, []);
    const fetchSpots = async () => {
        try {
            console.log('🔍 Fetching spots from API...');
            const response = await apiClient.getSpots({ limit: 100 });

            // Convert API response to HitchhikingSpot format
            const convertedSpots: HitchhikingSpot[] = response.data.map((apiSpot: any) => ({
                id: apiSpot.id,
                name: apiSpot.name,
                type: apiSpot.spot_type,
                coordinates: {
                    latitude: parseFloat(apiSpot.latitude),
                    longitude: parseFloat(apiSpot.longitude)
                },
                rating: apiSpot.overall_rating || 0,
                safetyRating: apiSpot.safety_rating > 4 ? 'high' : apiSpot.safety_rating > 2.5 ? 'medium' : 'low',
                description: apiSpot.description,
                addedBy: apiSpot.created_by?.display_name || 'Unknown',
                lastUpdated: new Date(apiSpot.created_at).toLocaleDateString(),
                verified: apiSpot.is_verified || false,
            }));

            setSpots(convertedSpots);
            console.log(`✅ Loaded ${convertedSpots.length} spots from API`);
        } catch (error) {
            console.error('❌ Error fetching spots:', error);
            Alert.alert('Error', 'Could not load spots from server');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpotPress = (spot: HitchhikingSpot) => {
        setSelectedSpot(spot);
        Alert.alert(
            `${spot.name} ${spot.verified ? '✓' : ''}`,
            `${spot.description}\n\n⭐ Rating: ${spot.rating}/5\n🛡️ Safety: ${spot.safetyRating}\n📍 Type: ${spot.type.replace('_', ' ')}\n👤 Added by: ${spot.addedBy}\n🕒 Updated: ${spot.lastUpdated}`,
            [
                {
                    text: 'Navigate',
                    onPress: () => handleNavigateToSpot(spot)
                },
                {
                    text: 'Details',
                    onPress: () => router.push({
                        pathname: '/spots/[id]',
                        params: { id: spot.id }
                    })
                },
                { text: 'Close', style: 'cancel' }
            ]
        );
    };

    // NEW: Simple map press handler - always available
    const handleMapPress = (coordinate: { latitude: number; longitude: number }) => {
        console.log('🗺️ Map tapped at:', coordinate);

        // Check if user tapped near an existing spot (within ~100m)
        const isNearExistingSpot = spots.some(spot => {
            const distance = getDistanceBetweenPoints(
                coordinate.latitude,
                coordinate.longitude,
                spot.coordinates.latitude,
                spot.coordinates.longitude
            );
            return distance < 100; // 100 meters
        });

        if (isNearExistingSpot) {
            // Too close to existing spot, don't offer to add
            console.log('🚫 Too close to existing spot');
            return;
        }

        // Show add spot option immediately
        Alert.alert(
            '📍 Add Hitchhiking Spot',
            `Add a new spot at this location?\n\nLatitude: ${coordinate.latitude.toFixed(6)}\nLongitude: ${coordinate.longitude.toFixed(6)}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: '✅ Add Spot',
                    onPress: () => {
                        console.log('✅ Navigating to add spot with coordinates:', coordinate);
                        router.push({
                            pathname: '/spots/add',
                            params: {
                                latitude: coordinate.latitude.toString(),
                                longitude: coordinate.longitude.toString(),
                            }
                        });
                    }
                }
            ]
        );
    };

    // Helper function to calculate distance between two points
    const getDistanceBetweenPoints = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in meters
    };

    const handleMyLocationPress = () => {
        Alert.alert('My Location', 'Centering map on your current location...');
    };

    const handleFilterPress = () => {
        Alert.alert('Filter', 'Filter spots by safety, type, rating, etc.');
    };

    const handleSearchPress = () => {
        Alert.alert('Search', 'Search for specific locations or spot types');
    };

    const handleNavigateToSpot = (spot: HitchhikingSpot) => {
        mapRef.current?.animateToCoordinate(spot.coordinates);
        Alert.alert('Navigation', `Opening navigation to ${spot.name}`);
    };

    const handleRegionChange = (region: Region) => {
        console.log('Region changed:', region);
    };

    const filteredSpots = spots.filter(spot =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Screen padding={false}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.searchInput, {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border
                    }]}
                    placeholder="Search hitchhiking spots..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
            </View>

            {/* Map - Always fully visible and interactive */}
            <HitchhikingMapView
                ref={mapRef}
                style={styles.map}
                spots={filteredSpots}
                onSpotPress={handleSpotPress}
                onMapPress={handleMapPress}
                onRegionChange={handleRegionChange}
                showUserLocation={true}
            />

            {/* Simplified Map Controls - No add button needed */}
            <MapControls
                onMyLocationPress={handleMyLocationPress}
                onFilterPress={handleFilterPress}
                onSearchPress={handleSearchPress}
            />

            {/* Enhanced Stats Bar with Tap-to-Add Hint */}
            <View style={[styles.statsBar, { backgroundColor: `${colors.primary}F0` }]}>
                <Text style={styles.statsText}>
                    📍 {filteredSpots.length} spots {searchQuery ? `matching "${searchQuery}"` : 'in area'} •
                    🛡️ {filteredSpots.filter(s => s.safetyRating === 'high').length} high safety •
                    ✓ {filteredSpots.filter(s => s.verified).length} verified •
                    💡 Tap empty area to add spot
                </Text>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        top: 20,
        left: 16,
        right: 16,
        zIndex: 1000,
    },
    searchInput: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
    },
    statsBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 12,
        paddingHorizontal: 16,
        zIndex: 1000,
    },
    statsText: {
        color: '#FFFFFF',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 16,
    },
});