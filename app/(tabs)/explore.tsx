// app/(tabs)/explore.tsx - FIXED VERSION
import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '../../components/Themed';
import { Screen } from '../../components/layout/Screen';
import { HitchhikingMapView, HitchhikingSpot, MapViewHandle } from '../../components/map/MapView';
import { MapControls } from '../../components/map/MapControls';
import { Region } from 'react-native-maps';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { router } from 'expo-router';
import { apiClient } from "@/app/services/api";
import { TRANSPORT_MODE_EMOJIS, TRANSPORT_MODE_LABELS, TransportMode } from "@/app/types/transport";
import { Typography } from "@/constants/Typography";
import { Layout } from "@/constants/Layout";
import { useProfile } from "@/app/contexts/ProfileContext";
import * as Location from 'expo-location';

// app/(tabs)/explore.tsx - FIXED VERSION

export default function MapScreen() {
    const [spots, setSpots] = useState<HitchhikingSpot[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpot, setSelectedSpot] = useState<HitchhikingSpot | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

    const { profile } = useProfile();
    const [currentFilterMode, setCurrentFilterMode] = useState<'personal' | 'all' | 'custom'>('personal');
    const [customTransportModes, setCustomTransportModes] = useState<Set<TransportMode>>(new Set());
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    // FIXED: Remove the loading ref that was causing issues
    const [hasInitialized, setHasInitialized] = useState(false);

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const mapRef = useRef<MapViewHandle>(null);

    // FIXED: Stable loadSpots function without debounce dependency issues
    const loadSpots = useCallback(async () => {
        if (!profile) return;

        try {
            setIsLoading(true);
            console.log('🔍 Loading spots with smart filtering...');

            let response;

            switch (currentFilterMode) {
                case 'personal':
                    const personalModes = profile.selectedModes || [TransportMode.HITCHHIKING];
                    console.log('👤 Loading personal spots for modes:', personalModes);

                    response = await apiClient.getSpots({
                        limit: 100,
                    });

                    // Client-side filtering for now
                    response.data = response.data.filter((apiSpot: any) => {
                        const spotModes = apiSpot.transport_modes || [TransportMode.HITCHHIKING];
                        return personalModes.some(mode => spotModes.includes(mode));
                    });
                    break;

                case 'custom':
                    if (customTransportModes.size === 0) {
                        console.log('⚠️ No custom transport modes selected');
                        setSpots([]);
                        setIsLoading(false);
                        return;
                    }

                    console.log('🎛️ Loading custom spots for modes:', Array.from(customTransportModes));

                    response = await apiClient.getSpots({ limit: 100 });

                    // Client-side filtering
                    response.data = response.data.filter((apiSpot: any) => {
                        const spotModes = apiSpot.transport_modes || [TransportMode.HITCHHIKING];
                        return Array.from(customTransportModes).some(mode => spotModes.includes(mode));
                    });
                    break;

                case 'all':
                default:
                    console.log('🌍 Loading all spots');
                    response = await apiClient.getSpots({ limit: 100 });
                    break;
            }

            // Convert API response
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
                    transportModes: apiSpot.transport_modes || [TransportMode.HITCHHIKING],
                    modeRatings: apiSpot.mode_ratings || {},
                    totalReviews: apiSpot.total_reviews || 0,
                };
            });

            setSpots(convertedSpots);
            console.log(`✅ Loaded ${convertedSpots.length} spots`);

        } catch (error) {
            console.error('❌ Error loading spots:', error);
            Alert.alert('Error', 'Could not load spots from server');
        } finally {
            setIsLoading(false);
        }
    }, [profile, currentFilterMode, customTransportModes]); // FIXED: Stable dependencies

    // FIXED: Initialize custom modes once when profile loads
    useEffect(() => {
        if (profile && !hasInitialized) {
            setCustomTransportModes(new Set(profile.selectedModes));
            setHasInitialized(true);
            console.log('🔄 Profile loaded, initializing custom modes:', profile.selectedModes);
        }
    }, [profile, hasInitialized]);

    // FIXED: Load spots when dependencies actually change
    useEffect(() => {
        if (profile && hasInitialized) {
            console.log('🔄 Dependencies changed, loading spots...');
            loadSpots();
        }
    }, [profile, currentFilterMode, customTransportModes, hasInitialized, loadSpots]);

    // Get user location effect (unchanged)
    useEffect(() => {
        getUserLocation();
    }, []);

    // FIXED: Remove the debounced function and complex parameter checking
    // The rest of your component code stays the same...

    const getUserLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Location permission denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const newLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            setUserLocation(newLocation);
            console.log('✅ Location updated:', newLocation);
        } catch (error) {
            console.error('❌ Error getting location:', error);
        }
    };


    const handleFilterModeChange = (newMode: 'personal' | 'all' | 'custom') => {
        if (newMode === currentFilterMode) return;

        console.log(`🎛️ Filter mode changed: ${currentFilterMode} → ${newMode}`);
        setCurrentFilterMode(newMode);
        setShowFilterPanel(false);
    };

    const toggleCustomTransportMode = (mode: TransportMode) => {
        setCustomTransportModes(prev => {
            const newModes = new Set(prev);
            if (newModes.has(mode)) {
                newModes.delete(mode);
            } else {
                newModes.add(mode);
            }
            console.log(`🎯 Custom modes updated:`, Array.from(newModes));
            return newModes;
        });
    };

    const getFilterStats = () => {
        const stats = {
            total: spots.length,
            highSafety: spots.filter(s => s.safetyRating === 'high').length,
            verified: spots.filter(s => s.verified).length,
            byMode: {} as Record<TransportMode, number>
        };

        Object.values(TransportMode).forEach(mode => {
            stats.byMode[mode] = spots.filter(spot =>
                spot.transportModes?.includes(mode)
            ).length;
        });

        return stats;
    };

    const renderFilterPanel = () => {
        if (!showFilterPanel) return null;

        return (
            <View style={[styles.filterPanel, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={styles.filterHeader}>
                    <Text style={[styles.filterTitle, { color: colors.text }]}>🎯 Smart Filtering</Text>
                    <TouchableOpacity onPress={() => setShowFilterPanel(false)}>
                        <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Mode Selection */}
                <View style={styles.filterModeSection}>
                    <TouchableOpacity
                        style={[
                            styles.filterModeButton,
                            currentFilterMode === 'personal' && { backgroundColor: colors.primary },
                            { borderColor: colors.border }
                        ]}
                        onPress={() => handleFilterModeChange('personal')}
                    >
                        <Text style={[
                            styles.filterModeText,
                            { color: currentFilterMode === 'personal' ? '#FFFFFF' : colors.text }
                        ]}>
                            🎒 My Travel Style
                        </Text>
                        {profile && (
                            <Text style={[
                                styles.filterModeSubtext,
                                { color: currentFilterMode === 'personal' ? '#FFFFFF' : colors.textSecondary }
                            ]}>
                                {profile.selectedModes.map(m => TRANSPORT_MODE_EMOJIS[m]).join(' ')} {profile.selectedModes.map(m => TRANSPORT_MODE_LABELS[m]).join(' & ')}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterModeButton,
                            currentFilterMode === 'custom' && { backgroundColor: colors.primary },
                            { borderColor: colors.border }
                        ]}
                        onPress={() => handleFilterModeChange('custom')}
                    >
                        <Text style={[
                            styles.filterModeText,
                            { color: currentFilterMode === 'custom' ? '#FFFFFF' : colors.text }
                        ]}>
                            🎛️ Custom Selection
                        </Text>
                        <Text style={[
                            styles.filterModeSubtext,
                            { color: currentFilterMode === 'custom' ? '#FFFFFF' : colors.textSecondary }
                        ]}>
                            Pick specific modes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterModeButton,
                            currentFilterMode === 'all' && { backgroundColor: colors.primary },
                            { borderColor: colors.border }
                        ]}
                        onPress={() => handleFilterModeChange('all')}
                    >
                        <Text style={[
                            styles.filterModeText,
                            { color: currentFilterMode === 'all' ? '#FFFFFF' : colors.text }
                        ]}>
                            🌍 Show Everything
                        </Text>
                        <Text style={[
                            styles.filterModeSubtext,
                            { color: currentFilterMode === 'all' ? '#FFFFFF' : colors.textSecondary }
                        ]}>
                            All transport modes
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Custom Mode Selection - only show when custom mode is active */}
                {currentFilterMode === 'custom' && (
                    <View style={styles.customModesSection}>
                        <Text style={[styles.customModesTitle, { color: colors.text }]}>
                            Select Transport Modes:
                        </Text>
                        <View style={styles.customModesGrid}>
                            {Object.values(TransportMode).filter(mode => mode !== TransportMode.ALL).map((mode) => {
                                const isActive = customTransportModes.has(mode);
                                const count = getFilterStats().byMode[mode] || 0;

                                return (
                                    <TouchableOpacity
                                        key={mode}
                                        style={[
                                            styles.customModeButton,
                                            {
                                                backgroundColor: isActive ? colors.primary : colors.backgroundSecondary,
                                                borderColor: isActive ? colors.primary : colors.border,
                                            }
                                        ]}
                                        onPress={() => toggleCustomTransportMode(mode)}
                                    >
                                        <Text style={styles.customModeEmoji}>
                                            {TRANSPORT_MODE_EMOJIS[mode]}
                                        </Text>
                                        <Text style={[
                                            styles.customModeLabel,
                                            { color: isActive ? '#FFFFFF' : colors.text }
                                        ]}>
                                            {TRANSPORT_MODE_LABELS[mode]}
                                        </Text>
                                        <Text style={[
                                            styles.customModeCount,
                                            { color: isActive ? '#FFFFFF' : colors.textSecondary }
                                        ]}>
                                            ({count})
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const handleSpotPress = (spot: HitchhikingSpot) => {
        const relevantModes = currentFilterMode === 'personal'
            ? profile?.selectedModes || [TransportMode.HITCHHIKING] // FIXED: selectedModes
            : currentFilterMode === 'custom'
                ? Array.from(customTransportModes)
                : spot.transportModes || [TransportMode.HITCHHIKING];

        const primaryMode = relevantModes[0];
        const modeEmoji = TRANSPORT_MODE_EMOJIS[primaryMode];
        const modeLabel = TRANSPORT_MODE_LABELS[primaryMode];

        Alert.alert(
            `${spot.name} ${spot.verified ? '✓' : ''}`,
            `${spot.description}\n\n${modeEmoji} Great for ${modeLabel}\n⭐ Rating: ${spot.rating}/5\n🛡️ Safety: ${spot.safetyRating}\n👤 Added by: ${spot.addedBy}`,
            [
                {
                    text: 'Quick Review',
                    onPress: () => router.push({
                        pathname: '/review/add',
                        params: { spotId: spot.id, spotName: spot.name }
                    })
                },
                {
                    text: 'Full Details',
                    onPress: () => router.push({
                        pathname: '/spots/[id]',
                        params: { id: spot.id }
                    })
                },
                { text: 'Close', style: 'cancel' }
            ]
        );
    };

    const handleMapPress = (coordinate: { latitude: number; longitude: number }) => {
        console.log('🗺️ Map tapped at:', coordinate);

        Alert.alert(
            '📍 Add New Spot',
            `Add a new sustainable transport spot here?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: '✅ Add Spot',
                    onPress: () => {
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

    // REMOVED: handleCacheDebug function since getCacheStats doesn't exist

    const getStatsBarText = () => {
        if (isLoading) return 'Loading spots...';

        const stats = getFilterStats();
        const modeDescription =
            currentFilterMode === 'personal' ? `${profile?.selectedModes.map(m => TRANSPORT_MODE_EMOJIS[m]).join('')} personalized` : // FIXED: selectedModes
                currentFilterMode === 'custom' ? `${Array.from(customTransportModes).map(m => TRANSPORT_MODE_EMOJIS[m]).join('')} custom` :
                    '🌍 all modes';

        return `📍 ${stats.total} spots (${modeDescription}) • 🛡️ ${stats.highSafety} safe • ✓ ${stats.verified} verified\n💡 Tap map to add spot • 🎛️ Tap filter to change modes`;
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
                    placeholder="Search spots for your travel style..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
            </View>

            {/* Filter Panel */}
            {renderFilterPanel()}

            {/* Map */}
            <HitchhikingMapView
                ref={mapRef}
                style={[styles.map, showFilterPanel && { marginTop: 400 }]}
                spots={spots}
                onSpotPress={handleSpotPress}
                onMapPress={handleMapPress}
                showUserLocation={true}
            />

            {/* Map Controls */}
            <MapControls
                onMyLocationPress={() => {
                    if (userLocation) {
                        mapRef.current?.animateToCoordinate(userLocation);
                    } else {
                        getUserLocation();
                    }
                }}
                onFilterPress={() => setShowFilterPanel(!showFilterPanel)}
                onSearchPress={() => Alert.alert('Search', 'Search functionality coming soon!')}
            />

            {/* Enhanced Stats Bar */}
            <View style={[styles.statsBar, { backgroundColor: `${colors.primary}F0` }]}>
                <Text style={styles.statsText}>
                    {getStatsBarText()}
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
        top: Layout.spacing.lg,
        left: Layout.spacing.base,
        right: Layout.spacing.base,
        zIndex: 1000,
    },
    searchInput: {
        paddingHorizontal: Layout.spacing.base,
        paddingVertical: Layout.spacing.sm + 4,
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
        maxHeight: 350,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.base,
    },
    filterTitle: {
        fontSize: Typography.sizes.lg,
        fontFamily: Typography.fonts.semiBold,
        fontWeight: '600',
    },
    closeButton: {
        fontSize: Typography.sizes.lg,
        fontWeight: 'bold',
        padding: 4,
    },
    filterModeSection: {
        marginBottom: Layout.spacing.base,
    },
    filterModeButton: {
        padding: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        borderWidth: 1,
        marginBottom: Layout.spacing.sm,
    },
    filterModeText: {
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.semiBold,
        fontWeight: '600',
        marginBottom: 2,
    },
    filterModeSubtext: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.regular,
    },
    customModesSection: {
        marginBottom: Layout.spacing.base,
    },
    customModesTitle: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.medium,
        marginBottom: Layout.spacing.sm,
    },
    customModesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Layout.spacing.xs,
    },
    customModeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Layout.spacing.sm,
        paddingVertical: Layout.spacing.xs,
        borderRadius: Layout.radius.full,
        borderWidth: 1,
        marginBottom: Layout.spacing.xs,
    },
    customModeEmoji: {
        fontSize: Typography.sizes.sm,
        marginRight: 4,
    },
    customModeLabel: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.medium,
        marginRight: 4,
    },
    customModeCount: {
        fontSize: 10,
        fontFamily: Typography.fonts.regular,
    },
    statsBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: Layout.spacing.sm + 4,
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