// app/trip/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';
import { useLocalSearchParams, router } from 'expo-router';
import { apiClient } from '@/app/services/api';
import { Trip, TripSpot, TripStatus, TripSpotStatus } from '@/app/types/trip';
import { HitchhikingMapView, HitchhikingSpot } from '@/components/map/MapView';

export default function TripDetailScreen() {
    const [trip, setTrip] = useState<Trip | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [spots, setSpots] = useState<HitchhikingSpot[]>([]);
    const { id } = useLocalSearchParams<{ id: string }>();

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        if (id) {
            loadTrip();
            loadNearbySpots();
        }
    }, [id]);

    const loadTrip = async () => {
        try {
            setIsLoading(true);
            const result = await apiClient.getTripById(id!);
            setTrip(result.data);
        } catch (error) {
            console.error('Failed to load trip:', error);
            Alert.alert('Error', 'Failed to load trip details');
        } finally {
            setIsLoading(false);
        }
    };

    const loadNearbySpots = async () => {
        try {
            // Get spots near the route (simplified - you'd want to get spots between start and end)
            const result = await apiClient.getNearbySpots(50.0, 14.0, 50, 20); // Example coordinates
            setSpots(result.data.map(spot => ({
                id: spot.id,
                name: spot.name,
                description: spot.description,
                latitude: spot.latitude,
                longitude: spot.longitude,
                spot_type: spot.spot_type,
                safety_rating: spot.safety_rating,
                overall_rating: spot.overall_rating,
                is_verified: spot.is_verified,
                created_by: spot.created_by.display_name,
            })));
        } catch (error) {
            console.error('Failed to load spots:', error);
        }
    };

    const handleAddSpotToTrip = async (spotId: string) => {
        if (!trip) return;

        try {
            const result = await apiClient.addSpotToTrip(trip.id, {
                spot_id: spotId,
            });

            Alert.alert('Success', 'Spot added to your trip!');
            loadTrip(); // Reload to show updated spots
        } catch (error: any) {
            console.error('Failed to add spot:', error);
            Alert.alert('Error', `Failed to add spot: ${error.message}`);
        }
    };

    const handleUpdateTripStatus = async (status: TripStatus) => {
        if (!trip) return;

        try {
            await apiClient.updateTrip(trip.id, { status });
            setTrip(prev => prev ? { ...prev, status } : null);
            Alert.alert('Success', `Trip status updated to ${status}`);
        } catch (error: any) {
            console.error('Failed to update trip:', error);
            Alert.alert('Error', `Failed to update trip: ${error.message}`);
        }
    };

    const handleUpdateSpotStatus = async (tripSpotId: string, status: TripSpotStatus) => {
        try {
            await apiClient.updateTripSpot(tripSpotId, { status });
            loadTrip(); // Reload to show updated status
        } catch (error: any) {
            console.error('Failed to update spot status:', error);
            Alert.alert('Error', `Failed to update spot: ${error.message}`);
        }
    };

    const renderTripSpot = (tripSpot: TripSpot, index: number) => (
        <View key={tripSpot.id} style={[styles.tripSpotCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={styles.tripSpotHeader}>
                <View style={styles.spotIndex}>
                    <Text style={[styles.spotIndexText, { color: colors.background }]}>
                        {index + 1}
                    </Text>
                </View>
                <View style={styles.tripSpotInfo}>
                    <Text style={[styles.tripSpotName, { color: colors.text }]}>
                        {tripSpot.spot.name}
                    </Text>
                    <Text style={[styles.tripSpotType, { color: colors.textSecondary }]}>
                        {tripSpot.spot.spot_type.replace('_', ' ')}
                    </Text>
                </View>
                <View style={[styles.spotStatusBadge, { backgroundColor: getSpotStatusColor(tripSpot.status) }]}>
                    <Text style={styles.spotStatusText}>
                        {tripSpot.status}
                    </Text>
                </View>
            </View>

            {tripSpot.notes && (
                <Text style={[styles.tripSpotNotes, { color: colors.textSecondary }]}>
                    {tripSpot.notes}
                </Text>
            )}

            <View style={styles.tripSpotActions}>
                {tripSpot.status === TripSpotStatus.PLANNED && (
                    <TouchableOpacity
                        style={[styles.spotActionButton, { backgroundColor: colors.tint }]}
                        onPress={() => handleUpdateSpotStatus(tripSpot.id, TripSpotStatus.CURRENT)}
                    >
                        <Text style={[styles.spotActionText, { color: colors.background }]}>
                            Arrive
                        </Text>
                    </TouchableOpacity>
                )}
                {tripSpot.status === TripSpotStatus.CURRENT && (
                    <TouchableOpacity
                        style={[styles.spotActionButton, { backgroundColor: '#4CAF50' }]}
                        onPress={() => handleUpdateSpotStatus(tripSpot.id, TripSpotStatus.COMPLETED)}
                    >
                        <Text style={[styles.spotActionText, { color: 'white' }]}>
                            Complete
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const getSpotStatusColor = (status: TripSpotStatus): string => {
        switch (status) {
            case TripSpotStatus.PLANNED: return '#FFA500';
            case TripSpotStatus.CURRENT: return '#4CAF50';
            case TripSpotStatus.COMPLETED: return '#2196F3';
            case TripSpotStatus.SKIPPED: return '#F44336';
            default: return '#999';
        }
    };

    if (isLoading) {
        return (
            <Screen>
                <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        Loading trip...
                    </Text>
                </View>
            </Screen>
        );
    }

    if (!trip) {
        return (
            <Screen>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.text }]}>
                        Trip not found
                    </Text>
                </View>
            </Screen>
        );
    }

    return (
        <Screen>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Trip Header */}
                <View style={[styles.tripHeader, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.tripTitle, { color: colors.text }]}>
                        {trip.title}
                    </Text>
                    <Text style={[styles.tripRoute, { color: colors.textSecondary }]}>
                        {trip.start_address} → {trip.end_address}
                    </Text>

                    {trip.description && (
                        <Text style={[styles.tripDescription, { color: colors.textSecondary }]}>
                            {trip.description}
                        </Text>
                    )}

                    <View style={styles.tripStats}>
                        <View style={styles.tripStat}>
                            <Text style={[styles.statValue, { color: colors.text }]}>
                                {trip.estimated_distance || 0}km
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                Distance
                            </Text>
                        </View>
                        <View style={styles.tripStat}>
                            <Text style={[styles.statValue, { color: colors.text }]}>
                                {trip.trip_spots?.length || 0}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                Spots
                            </Text>
                        </View>
                        <View style={styles.tripStat}>
                            <Text style={[styles.statValue, { color: colors.text }]}>
                                {trip.travel_modes.length}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                Modes
                            </Text>
                        </View>
                    </View>

                    {/* Trip Controls */}
                    <View style={styles.tripControls}>
                        {trip.status === TripStatus.PLANNED && (
                            <TouchableOpacity
                                style={[styles.controlButton, { backgroundColor: '#4CAF50' }]}
                                onPress={() => handleUpdateTripStatus(TripStatus.ACTIVE)}
                            >
                                <Text style={styles.controlButtonText}>Start Trip</Text>
                            </TouchableOpacity>
                        )}
                        {trip.status === TripStatus.ACTIVE && (
                            <>
                                <TouchableOpacity
                                    style={[styles.controlButton, { backgroundColor: '#FF9800' }]}
                                    onPress={() => handleUpdateTripStatus(TripStatus.PAUSED)}
                                >
                                    <Text style={styles.controlButtonText}>Pause</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.controlButton, { backgroundColor: '#2196F3' }]}
                                    onPress={() => handleUpdateTripStatus(TripStatus.COMPLETED)}
                                >
                                    <Text style={styles.controlButtonText}>Complete</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                {/* Route Map */}
                <View style={styles.mapContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Route & Spots
                    </Text>
                    <View style={styles.mapWrapper}>
                        <HitchhikingMapView
                            spots={spots}
                            onSpotPress={(spot) => {
                                Alert.alert(
                                    spot.name,
                                    'Add this spot to your trip?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Add Spot', onPress: () => handleAddSpotToTrip(spot.id) }
                                    ]
                                );
                            }}
                            initialRegion={{
                                latitude: trip.start_location.latitude,
                                longitude: trip.start_location.longitude,
                                latitudeDelta: 0.5,
                                longitudeDelta: 0.5,
                            }}
                        />
                    </View>
                </View>

                {/* Trip Spots List */}
                <View style={styles.spotsContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Trip Spots ({trip.trip_spots?.length || 0})
                    </Text>

                    {trip.trip_spots && trip.trip_spots.length > 0 ? (
                        trip.trip_spots.map((tripSpot, index) => renderTripSpot(tripSpot, index))
                    ) : (
                        <View style={styles.emptySpots}>
                            <Text style={[styles.emptySpotsText, { color: colors.textSecondary }]}>
                                No spots added yet. Tap spots on the map to add them to your trip.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.body.large,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        ...Typography.heading.h2,
    },
    tripHeader: {
        padding: Layout.spacing.lg,
        margin: Layout.spacing.lg,
        borderRadius: Layout.radius.lg,
    },
    tripTitle: {
        ...Typography.heading.h1,
        marginBottom: Layout.spacing.sm,
    },
    tripRoute: {
        ...Typography.body.large,
        marginBottom: Layout.spacing.md,
    },
    tripDescription: {
        ...Typography.body.default,
        marginBottom: Layout.spacing.lg,
        lineHeight: 22,
    },
    tripStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Layout.spacing.lg,
        paddingVertical: Layout.spacing.md,
    },
    tripStat: {
        alignItems: 'center',
    },
    statValue: {
        ...Typography.heading.h2,
        marginBottom: Layout.spacing.xs,
    },
    statLabel: {
        ...Typography.body.small,
    },
    tripControls: {
        flexDirection: 'row',
        gap: Layout.spacing.md,
    },
    controlButton: {
        flex: 1,
        paddingVertical: Layout.spacing.md,
        borderRadius: Layout.radius.md,
        alignItems: 'center',
    },
    controlButtonText: {
        ...Typography.button.primary,
        color: 'white',
    },
    mapContainer: {
        padding: Layout.spacing.lg,
    },
    sectionTitle: {
        ...Typography.heading.h2,
        marginBottom: Layout.spacing.lg,
    },
    mapWrapper: {
        height: 300,
        borderRadius: Layout.radius.lg,
        overflow: 'hidden',
    },
    spotsContainer: {
        padding: Layout.spacing.lg,
    },
    tripSpotCard: {
        padding: Layout.spacing.lg,
        borderRadius: Layout.radius.lg,
        borderWidth: 1,
        marginBottom: Layout.spacing.md,
    },
    tripSpotHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Layout.spacing.md,
    },
    spotIndex: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Layout.spacing.md,
    },
    spotIndexText: {
        ...Typography.body.medium,
        fontWeight: 'bold',
    },
    tripSpotInfo: {
        flex: 1,
    },
    tripSpotName: {
        ...Typography.heading.h3,
        marginBottom: Layout.spacing.xs,
    },
    tripSpotType: {
        ...Typography.body.default,
    },
    spotStatusBadge: {
        paddingHorizontal: Layout.spacing.sm,
        paddingVertical: Layout.spacing.xs,
        borderRadius: Layout.radius.sm,
    },
    spotStatusText: {
        ...Typography.body.small,
        color: 'white',
        fontWeight: '600',
    },
    tripSpotNotes: {
        ...Typography.body.default,
        marginBottom: Layout.spacing.md,
        fontStyle: 'italic',
    },
    tripSpotActions: {
        flexDirection: 'row',
        gap: Layout.spacing.sm,
    },
    spotActionButton: {
        paddingHorizontal: Layout.spacing.md,
        paddingVertical: Layout.spacing.sm,
        borderRadius: Layout.radius.md,
    },
    spotActionText: {
        ...Typography.body.medium,
        fontWeight: '600',
    },
    emptySpots: {
        padding: Layout.spacing.xl,
        alignItems: 'center',
    },
    emptySpotsText: {
        ...Typography.body.large,
        textAlign: 'center',
        lineHeight: 24,
    },
});