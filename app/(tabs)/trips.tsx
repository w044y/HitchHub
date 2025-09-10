// app/(tabs)/trips.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { apiClient } from '@/app/services/api';
import { Trip, TripStatus } from '../types/trip';

const TRIP_STATUS_COLORS: Record<TripStatus, string> = {
    [TripStatus.PLANNED]: '#FFA500',
    [TripStatus.ACTIVE]: '#4CAF50',
    [TripStatus.PAUSED]: '#FF9800',
    [TripStatus.COMPLETED]: '#2196F3',
    [TripStatus.CANCELLED]: '#F44336',
};

const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
    [TripStatus.PLANNED]: 'Planned',
    [TripStatus.ACTIVE]: 'Active',
    [TripStatus.PAUSED]: 'Paused',
    [TripStatus.COMPLETED]: 'Completed',
    [TripStatus.CANCELLED]: 'Cancelled'
};

export default function TripsScreen() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filterStatus, setFilterStatus] = useState<TripStatus | 'all'>('all');

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { user } = useAuth();

    useEffect(() => {
        loadTrips();
    }, [filterStatus]);

    const loadTrips = async () => {
        if (!user?.id) return;

        try {
            setIsLoading(true);
            const result = await apiClient.getMyTrips({
                status: filterStatus === 'all' ? undefined : filterStatus,
                limit: 50,
            });
            setTrips(result.data);
        } catch (error) {
            console.error('Failed to load trips:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadTrips();
        setRefreshing(false);
    };

    const renderTripCard = ({ item: trip }: { item: Trip }) => (
        <TouchableOpacity
            style={[styles.tripCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => router.push(`/trip/${trip.id}`)}
            activeOpacity={0.7}
        >
            <View style={styles.tripHeader}>
                <View style={styles.tripInfo}>
                    <Text style={[styles.tripTitle, { color: colors.text }]} numberOfLines={1}>
                        {trip.title}
                    </Text>
                    <Text style={[styles.tripRoute, { color: colors.textSecondary }]} numberOfLines={1}>
                        {trip.start_address} → {trip.end_address}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: TRIP_STATUS_COLORS[trip.status] }]}>
                    <Text style={styles.statusText}>
                        {TRIP_STATUS_LABELS[trip.status]}
                    </Text>
                </View>
            </View>

            <View style={styles.tripDetails}>
                <View style={styles.tripStat}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distance</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {trip.estimated_distance ? `${trip.estimated_distance}km` : 'Unknown'}
                    </Text>
                </View>
                <View style={styles.tripStat}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spots</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {trip.trip_spots?.length || 0}
                    </Text>
                </View>
                <View style={styles.tripStat}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Modes</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {trip.travel_modes.length}
                    </Text>
                </View>
            </View>

            {trip.planned_start_date && (
                <View style={styles.tripFooter}>
                    <Text style={[styles.startDate, { color: colors.textSecondary }]}>
                        Starts: {new Date(trip.planned_start_date).toLocaleDateString()}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderFilterButton = (status: TripStatus | 'all', label: string) => (
        <TouchableOpacity
            key={status}
            style={[
                styles.filterButton,
                {
                    backgroundColor: filterStatus === status ? colors.tint : colors.inputBackground,
                    borderColor: colors.border,
                }
            ]}
            onPress={() => setFilterStatus(status)}
        >
            <Text style={[
                styles.filterText,
                {
                    color: filterStatus === status ? colors.background : colors.text
                }
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Screen>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        My Trips
                    </Text>
                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: colors.tint }]}
                        onPress={() => router.push('/trip/create')}
                    >
                        <Text style={[styles.createButtonText, { color: colors.background }]}>
                            + Create
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Buttons */}
                <View style={styles.filterContainer}>
                    {renderFilterButton('all', 'All')}
                    {Object.entries(TRIP_STATUS_LABELS).map(([status, label]) =>
                        renderFilterButton(status as keyof typeof TRIP_STATUS_LABELS, label as string)
                    )}
                </View>

                {/* Trip List */}
                <FlatList
                    data={trips}
                    renderItem={renderTripCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                                No trips yet
                            </Text>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                Create your first trip to start planning your adventure
                            </Text>
                            <TouchableOpacity
                                style={[styles.emptyButton, { backgroundColor: colors.tint }]}
                                onPress={() => router.push('/trip/create')}
                            >
                                <Text style={[styles.emptyButtonText, { color: colors.background }]}>
                                    Create Trip
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Layout.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.lg,
        paddingTop: Layout.spacing.md,
    },
    headerTitle: {
        ...Typography.heading.h1,
    },
    createButton: {
        paddingHorizontal: Layout.spacing.lg,
        paddingVertical: Layout.spacing.md,
        borderRadius: Layout.radius.md,
    },
    createButtonText: {
        ...Typography.button.primary,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: Layout.spacing.sm,
        marginBottom: Layout.spacing.lg,
        flexWrap: 'wrap',
    },
    filterButton: {
        paddingHorizontal: Layout.spacing.md,
        paddingVertical: Layout.spacing.sm,
        borderRadius: Layout.radius.sm,
        borderWidth: 1,
    },
    filterText: {
        ...Typography.body.small,
        fontWeight: '600',
    },
    listContainer: {
        paddingBottom: Layout.spacing.xl,
    },
    tripCard: {
        padding: Layout.spacing.lg,
        borderRadius: Layout.radius.lg,
        borderWidth: 1,
        marginBottom: Layout.spacing.md,
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Layout.spacing.md,
    },
    tripInfo: {
        flex: 1,
        marginRight: Layout.spacing.md,
    },
    tripTitle: {
        ...Typography.heading.h3,
        marginBottom: Layout.spacing.xs,
    },
    tripRoute: {
        ...Typography.body.default,
    },
    statusBadge: {
        paddingHorizontal: Layout.spacing.sm,
        paddingVertical: Layout.spacing.xs,
        borderRadius: Layout.radius.sm,
    },
    statusText: {
        ...Typography.body.small,
        color: 'white',
        fontWeight: '600',
    },
    tripDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Layout.spacing.md,
    },
    tripStat: {
        alignItems: 'center',
    },
    statLabel: {
        ...Typography.body.small,
        marginBottom: Layout.spacing.xs,
    },
    statValue: {
        ...Typography.body.medium,
        fontWeight: '600',
    },
    tripFooter: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        paddingTop: Layout.spacing.md,
    },
    startDate: {
        ...Typography.body.small,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Layout.spacing.xxl,
    },
    emptyTitle: {
        ...Typography.heading.h2,
        marginBottom: Layout.spacing.md,
    },
    emptyText: {
        ...Typography.body.large,
        textAlign: 'center',
        marginBottom: Layout.spacing.xl,
        lineHeight: 24,
    },
    emptyButton: {
        paddingHorizontal: Layout.spacing.xl,
        paddingVertical: Layout.spacing.lg,
        borderRadius: Layout.radius.md,
    },
    emptyButtonText: {
        ...Typography.button.primary,
    },
});