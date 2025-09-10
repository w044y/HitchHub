// components/trip/TripCard.tsx
import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Text } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';
import { TripWithFlexibleLocation, TripStatus } from '@/types/trip';
import { TransportMode } from '@/types/transport';
import { formatDate, formatDistance } from '@/utils/formatting';

interface TripCardProps {
    trip: TripWithFlexibleLocation;
    onPress: () => void;
    onStartTrip?: (tripId: string) => void;
    onCompleteTrip?: (tripId: string) => void;
    showActions?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
                                                      trip,
                                                      onPress,
                                                      onStartTrip,
                                                      onCompleteTrip,
                                                      showActions = true
                                                  }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getStatusInfo = (status: TripStatus) => {
        switch (status) {
            case TripStatus.ACTIVE:
                return { label: 'Active', color: '#4CAF50', emoji: '🚀', bgColor: '#E8F5E8' };
            case TripStatus.PLANNED:
                return { label: 'Planned', color: '#2196F3', emoji: '📋', bgColor: '#E3F2FD' };
            case TripStatus.PAUSED:
                return { label: 'Paused', color: '#FF9800', emoji: '⏸️', bgColor: '#FFF3E0' };
            case TripStatus.COMPLETED:
                return { label: 'Completed', color: '#9C27B0', emoji: '✅', bgColor: '#F3E5F5' };
            case TripStatus.CANCELLED:
                return { label: 'Cancelled', color: '#757575', emoji: '❌', bgColor: '#F5F5F5' };
            default:
                return { label: 'Unknown', color: '#757575', emoji: '❓', bgColor: '#F5F5F5' };
        }
    };

    const getModeEmoji = (mode: string) => {
        const emojis: Record<string, string> = {
            [TransportMode.HITCHHIKING]: '👍',
            [TransportMode.CYCLING]: '🚲',
            [TransportMode.VAN_LIFE]: '🚐',
            [TransportMode.WALKING]: '🚶',
        };
        return emojis[mode] || '🚀';
    };

    const getLocationDisplay = () => {
        if (trip.exploration_area) {
            return {
                icon: '📍',
                text: `Exploring ${trip.exploration_area.name}`,
                subText: `${trip.exploration_area.radius}km radius`
            };
        }

        if (trip.general_direction) {
            return {
                icon: '🧭',
                text: trip.general_direction,
                subText: 'Open journey'
            };
        }

        if (trip.start_address && trip.end_address) {
            return {
                icon: '📍',
                text: `${trip.start_address} → ${trip.end_address}`,
                subText: 'Point-to-point'
            };
        }

        return {
            icon: '🌍',
            text: 'Adventure awaits',
            subText: 'Flexible destination'
        };
    };

    const handleStartTrip = () => {
        if (!onStartTrip) return;

        Alert.alert(
            'Start Trip',
            `Ready to begin "${trip.title}"? This will start tracking your journey.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Start Trip',
                    style: 'default',
                    onPress: () => onStartTrip(trip.id)
                }
            ]
        );
    };

    const handleCompleteTrip = () => {
        if (!onCompleteTrip) return;

        Alert.alert(
            'Complete Trip',
            `Mark "${trip.title}" as completed? You can still view and edit your memories.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Complete',
                    style: 'default',
                    onPress: () => onCompleteTrip(trip.id)
                }
            ]
        );
    };

    const statusInfo = getStatusInfo(trip.status);
    const locationInfo = getLocationDisplay();

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                            {trip.title}
                        </Text>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: statusInfo.bgColor },
                            ]}
                        >
                            <Text style={styles.statusEmoji}>{statusInfo.emoji}</Text>
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: statusInfo.color },
                                ]}
                            >
                                {statusInfo.label}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                {trip.description && (
                    <Text
                        style={[styles.description, { color: colors.textSecondary }]}
                        numberOfLines={2}
                    >
                        {trip.description}
                    </Text>
                )}

                {/* Location Info */}
                <View style={styles.locationContainer}>
                    <Text style={styles.locationIcon}>{locationInfo.icon}</Text>
                    <View style={styles.locationTextContainer}>
                        <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={1}>
                            {locationInfo.text}
                        </Text>
                        <Text style={[styles.locationSubText, { color: colors.textSecondary }]}>
                            {locationInfo.subText}
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statEmoji}>📍</Text>
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                            {trip.spots_discovered || 0} spots
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statEmoji}>📸</Text>
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                            {trip.memories_captured || 0} memories
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statEmoji}>📅</Text>
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                            {formatDate(trip.actual_start_date || trip.created_at)}
                        </Text>
                    </View>

                    {trip.travel_modes && trip.travel_modes.length > 0 && (
                        <View style={styles.statItem}>
                            <Text style={[styles.statText, { color: colors.textSecondary }]}>
                                {trip.travel_modes.slice(0, 3).map(mode => getModeEmoji(mode)).join(' ')}
                                {trip.travel_modes.length > 3 && ' +'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                {showActions && (
                    <>
                        {trip.status === TripStatus.PLANNED && onStartTrip && (
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                                onPress={handleStartTrip}
                            >
                                <Text style={styles.actionButtonText}>🚀 Start Journey</Text>
                            </TouchableOpacity>
                        )}

                        {trip.status === TripStatus.ACTIVE && onCompleteTrip && (
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                                onPress={handleCompleteTrip}
                            >
                                <Text style={styles.actionButtonText}>✅ Complete Trip</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: Layout.spacing.base,
        marginBottom: Layout.spacing.sm,
    },
    header: {
        marginBottom: Layout.spacing.sm,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: Layout.spacing.sm,
    },
    title: {
        flex: 1,
        fontSize: Typography.sizes.lg,
        fontFamily: Typography.fonts.semiBold,
        lineHeight: Typography.lineHeights.tight * Typography.sizes.lg,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Layout.spacing.sm,
        paddingVertical: Layout.spacing.xs,
        borderRadius: Layout.radius.sm,
        gap: Layout.spacing.xs,
    },
    statusEmoji: {
        fontSize: 10,
    },
    statusText: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.medium,
    },
    description: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.regular,
        marginBottom: Layout.spacing.sm,
        lineHeight: Typography.lineHeights.relaxed * Typography.sizes.sm,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Layout.spacing.sm,
        gap: Layout.spacing.sm,
    },
    locationIcon: {
        fontSize: 16,
    },
    locationTextContainer: {
        flex: 1,
    },
    locationText: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.medium,
    },
    locationSubText: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.regular,
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: Layout.spacing.base,
        marginBottom: Layout.spacing.sm,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Layout.spacing.xs,
    },
    statEmoji: {
        fontSize: 12,
    },
    statText: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.regular,
    },
    actionButton: {
        paddingVertical: Layout.spacing.sm,
        paddingHorizontal: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        alignItems: 'center',
        marginTop: Layout.spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.semiBold,
    },
});