// app/(tabs)/explore.tsx - Add transport mode filtering
import React, { useState, useRef, useEffect } from 'react';
import {View, StyleSheet, TextInput, Alert, Platform, TouchableOpacity} from 'react-native';
import { Text } from '../../components/Themed';
import { Screen } from '../../components/layout/Screen';
import { HitchhikingMapView, MapViewHandle, HitchhikingSpot } from '../../components/map/MapView';
import { MapControls } from '../../components/map/MapControls';
import { Region } from 'react-native-maps';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { router } from 'expo-router';
import { apiClient } from "@/app/services/api";
import {TRANSPORT_MODE_EMOJIS, TRANSPORT_MODE_LABELS, TransportMode} from "@/app/types/transport";
import {Typography} from "@/constants/Typography";
import {Layout} from "@/constants/Layout";

export default function MapScreen() {
    const [spots, setSpots] = useState<HitchhikingSpot[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpot, setSelectedSpot] = useState<HitchhikingSpot | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // NEW: Transport mode filtering state
    const [activeTransportModes, setActiveTransportModes] = useState<Set<TransportMode>>(
        new Set(Object.values(TransportMode)) // Start with all modes active
    );
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const mapRef = useRef<MapViewHandle>(null);

    useEffect(() => {
        const loadSpots = async () => {
            await fetchSpots();
        };
        loadSpots();
    }, []);

    const fetchSpots = async () => {
        try {
            console.log('🔍 Fetching spots from API...');
            const response = await apiClient.getSpots({ limit: 100 });

            // Convert API response with transport mode info
            const convertedSpots: HitchhikingSpot[] = response.data.map((apiSpot: any) => {
                const safetyRating = parseFloat(apiSpot.safety_rating || 0);
                const overallRating = parseFloat(apiSpot.overall_rating || 0);

                return {
                    id: apiSpot.id,
                    name: apiSpot.name,
                    type: apiSpot.spot_type,
                    coordinates: {
                        latitude: parseFloat(apiSpot.latitude),
                        longitude: parseFloat(apiSpot.longitude)
                    },
                    rating: overallRating,
                    safetyRating: safetyRating > 4 ? 'high' : safetyRating > 2.5 ? 'medium' : 'low',
                    description: apiSpot.description,
                    addedBy: apiSpot.created_by?.display_name || 'Unknown',
                    lastUpdated: new Date(apiSpot.created_at).toLocaleDateString(),
                    verified: apiSpot.is_verified || false,
                    // NEW: Add transport modes to the spot data
                    transportModes: apiSpot.transport_modes || [TransportMode.HITCHHIKING], // Default to hitchhiking if none specified
                    modeRatings: apiSpot.mode_ratings || {},
                    totalReviews: apiSpot.total_reviews || 0,
                };
            });

            setSpots(convertedSpots);
            console.log(`✅ Successfully loaded ${convertedSpots.length} spots`);
        } catch (error) {
            console.error('❌ Error fetching spots:', error);
            Alert.alert('Error', 'Could not load spots from server');

            // Fallback with mock data that includes transport modes
            setSpots([
                {
                    id: 'fallback-1',
                    name: 'Fallback Test Spot',
                    type: 'rest_stop',
                    coordinates: { latitude: 52.5200, longitude: 13.4050 },
                    rating: 4.0,
                    safetyRating: 'high',
                    description: 'Fallback data - API connection failed',
                    addedBy: 'System',
                    lastUpdated: 'Now',
                    verified: false,
                    transportModes: [TransportMode.HITCHHIKING, TransportMode.CYCLING],
                    modeRatings: {},
                    totalReviews: 0,
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // NEW: Toggle transport mode filter
    const toggleTransportMode = (mode: TransportMode) => {
        setActiveTransportModes(prev => {
            const newModes = new Set(prev);
            if (newModes.has(mode)) {
                newModes.delete(mode);
            } else {
                newModes.add(mode);
            }
            return newModes;
        });
    };

    // NEW: Clear all filters
    const clearAllFilters = () => {
        setActiveTransportModes(new Set(Object.values(TransportMode)));
    };

    // NEW: Filter spots based on active transport modes and search
    const getFilteredSpots = () => {
        let filtered = spots;

        // Filter by transport modes
        if (activeTransportModes.size < Object.values(TransportMode).length) {
            filtered = filtered.filter(spot =>
                spot.transportModes?.some(mode => activeTransportModes.has(mode)) ||
                (spot.transportModes?.length === 0 && activeTransportModes.has(TransportMode.HITCHHIKING)) // Default for spots without transport modes
            );
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(spot =>
                spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                spot.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                spot.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredSpots = getFilteredSpots();

    // NEW: Get stats for filtered spots
    const getFilterStats = () => {
        const stats = {
            total: filteredSpots.length,
            highSafety: filteredSpots.filter(s => s.safetyRating === 'high').length,
            verified: filteredSpots.filter(s => s.verified).length,
            byMode: {} as Record<TransportMode, number>
        };

        // Count spots by transport mode
        Object.values(TransportMode).forEach(mode => {
            stats.byMode[mode] = filteredSpots.filter(spot =>
                spot.transportModes?.includes(mode) ||
                (spot.transportModes?.length === 0 && mode === TransportMode.HITCHHIKING)
            ).length;
        });

        return stats;
    };

    const stats = getFilterStats();

    // NEW: Render transport mode filter panel
    const renderTransportModeFilters = () => {
        if (!showFilterPanel) return null;

        return (
            <View style={[styles.filterPanel, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={styles.filterHeader}>
                    <Text style={[styles.filterTitle, { color: colors.text }]}>Filter by Transport Mode</Text>
                    <TouchableOpacity onPress={clearAllFilters}>
                        <Text style={[styles.clearButton, { color: colors.primary }]}>Show All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.transportModeFilters}>
                    {Object.values(TransportMode).map((mode) => {
                        const isActive = activeTransportModes.has(mode);
                        const count = stats.byMode[mode];

                        return (
                            <TouchableOpacity
                                key={mode}
                                style={[
                                    styles.transportModeFilter,
                                    {
                                        backgroundColor: isActive ? colors.primary : colors.backgroundSecondary,
                                        borderColor: isActive ? colors.primary : colors.border,
                                    }
                                ]}
                                onPress={() => toggleTransportMode(mode)}
                            >
                                <Text style={styles.filterModeEmoji}>
                                    {TRANSPORT_MODE_EMOJIS[mode]}
                                </Text>
                                <Text style={[
                                    styles.filterModeLabel,
                                    { color: isActive ? '#FFFFFF' : colors.text }
                                ]}>
                                    {TRANSPORT_MODE_LABELS[mode]}
                                </Text>
                                <Text style={[
                                    styles.filterModeCount,
                                    { color: isActive ? '#FFFFFF' : colors.textSecondary }
                                ]}>
                                    ({count})
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    // Update existing handlers
    const handleSpotPress = (spot: HitchhikingSpot) => {
        setSelectedSpot(spot);

        // Show transport modes in the alert
        const transportInfo = spot.transportModes && spot.transportModes.length > 0
            ? `🚀 Modes: ${spot.transportModes.map(mode => TRANSPORT_MODE_EMOJIS[mode]).join(' ')}`
            : '';

        Alert.alert(
            `${spot.name} ${spot.verified ? '✓' : ''}`,
            `${spot.description}\n\n⭐ Rating: ${spot.rating}/5\n🛡️ Safety: ${spot.safetyRating}\n📍 Type: ${spot.type.replace('_', ' ')}\n${transportInfo}\n👤 Added by: ${spot.addedBy}\n🕒 Updated: ${spot.lastUpdated}`,
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
                    })// Fix 1: Use query parameter approach
                },
                { text: 'Close', style: 'cancel' }
            ]
        );
    };

    const handleMapPress = (coordinate: { latitude: number; longitude: number }) => {
        console.log('🗺️ Map tapped at:', coordinate);

        const isNearExistingSpot = filteredSpots.some(spot => {
            const distance = getDistanceBetweenPoints(
                coordinate.latitude,
                coordinate.longitude,
                spot.coordinates.latitude,
                spot.coordinates.longitude
            );
            return distance < 100;
        });

        if (isNearExistingSpot) {
            console.log('🚫 Too close to existing spot');
            return;
        }

        Alert.alert(
            '📍 Add Sustainable Transport Spot',
            `Add a new spot at this location?\n\nLatitude: ${coordinate.latitude.toFixed(6)}\nLongitude: ${coordinate.longitude.toFixed(6)}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: '✅ Add Spot',
                    onPress: () => {
                        console.log('✅ Navigating to add spot with coordinates:', coordinate);
                        router.push({
                            pathname: '/spots/add', // Fix 2: This is correct if add-spot is in tabs
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

    // Helper functions (keep existing ones)
    const getDistanceBetweenPoints = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const handleMyLocationPress = () => {
        Alert.alert('My Location', 'Centering map on your current location...');
    };

    const handleFilterPress = () => {
        setShowFilterPanel(!showFilterPanel);
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
                    placeholder="Search sustainable transport spots..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
            </View>

            {/* Transport Mode Filter Panel */}
            {renderTransportModeFilters()}

            {/* Map */}
            <HitchhikingMapView
                ref={mapRef}
                style={[styles.map, showFilterPanel && { marginTop: 180 }]}
                spots={filteredSpots}
                onSpotPress={handleSpotPress}
                onMapPress={handleMapPress}
                onRegionChange={handleRegionChange}
                showUserLocation={true}
            />

            {/* Map Controls */}
            <MapControls
                onMyLocationPress={handleMyLocationPress}
                onFilterPress={handleFilterPress}
                onSearchPress={handleSearchPress}
            />

            {/* Enhanced Stats Bar */}
            <View style={[styles.statsBar, { backgroundColor: `${colors.primary}F0` }]}>
                <Text style={styles.statsText}>
                    {activeTransportModes.size === Object.values(TransportMode).length ? (
                        // All modes active - show general stats
                        `📍 ${stats.total} spots ${searchQuery ? `matching "${searchQuery}"` : 'in area'} • 🛡️ ${stats.highSafety} high safety • ✓ ${stats.verified} verified`
                    ) : (
                        // Filtered view - show mode-specific stats
                        `${Array.from(activeTransportModes).map(mode => TRANSPORT_MODE_EMOJIS[mode]).join('')} ${stats.total} filtered spots • 🛡️ ${stats.highSafety} safe • ✓ ${stats.verified} verified`
                    )}
                    {'\n💡 Tap empty area to add spot • 🎛️ Tap filter to change modes'}
                </Text>
            </View>
        </Screen>
    );
}

// Add new styles
const styles = StyleSheet.create({
    map: {
        flex: 1,
    },

    searchContainer: {
        position: 'absolute',
        top: Layout.spacing.lg,
        left: Layout.spacing.base,
        right: Layout.spacing.base,
        zIndex: 1000,
    },

    searchInput: {
        paddingHorizontal: Layout.spacing.base,
        paddingVertical: Layout.spacing.sm + 4, // 12px
        borderRadius: Layout.radius.lg,
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.regular,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
    },

    filterPanel: {
        position: 'absolute',
        top: 80,
        left: Layout.spacing.base,
        right: Layout.spacing.base,
        zIndex: 999,
        borderRadius: Layout.radius.lg,
        padding: Layout.spacing.base,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
    },

    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.sm + 4, // 12px
    },

    filterTitle: {
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.semiBold,
        fontWeight: '600',
    },

    clearButton: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.medium,
        fontWeight: '500',
    },

    transportModeFilters: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Layout.spacing.xs + 4, // 8px
    },

    transportModeFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Layout.spacing.sm + 4, // 12px
        paddingVertical: Layout.spacing.xs + 4, // 8px
        borderRadius: Layout.radius.full,
        borderWidth: 2,
    },

    filterModeEmoji: {
        fontSize: Typography.sizes.base,
        marginRight: 6,
    },

    filterModeLabel: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.medium,
        fontWeight: '500',
        marginRight: 4,
    },

    filterModeCount: {
        fontSize: 11,
        fontFamily: Typography.fonts.regular,
    },

    statsBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: Layout.spacing.sm + 4, // 12px
        paddingHorizontal: Layout.spacing.base,
        zIndex: 1000,
    },

    statsText: {
        color: '#FFFFFF',
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.medium,
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: Typography.sizes.base,
    },
});