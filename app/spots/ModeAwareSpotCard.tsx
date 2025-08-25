// components/spots/ModeAwareSpotCard.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useColorScheme } from '@/components/useColorScheme';
import { TransportMode, TRANSPORT_MODE_EMOJIS } from '@/app/types/transport';
import { getModeSpecificData, getModeSpecificQuickActions } from '@/app/utils/modeAdaptations';

interface ModeAwareSpotCardProps {
    spot: any;
    selectedMode: TransportMode | 'all';
    onPress?: () => void;
    onQuickAction?: (action: string) => void;
}

export const ModeAwareSpotCard: React.FC<ModeAwareSpotCardProps> = ({
                                                                        spot,
                                                                        selectedMode,
                                                                        onPress,
                                                                        onQuickAction
                                                                    }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Get mode-specific data
    const effectiveMode = selectedMode === 'all' ? TransportMode.HITCHHIKING : selectedMode;
    const modeData = getModeSpecificData(spot, effectiveMode);
    const quickActions = getModeSpecificQuickActions(effectiveMode);

    // Check if spot supports the selected mode
    const supportsMode = selectedMode === 'all' ||
        spot.transportModes?.includes(selectedMode) ||
        !spot.transportModes?.length;

    return (
        <Card style={[styles.card, !supportsMode && styles.dimmedCard]}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.mainInfo}>
                        <Text style={[styles.spotName, { color: colors.text }]}>
                            {spot.name}
                            {spot.verified && <Text style={[styles.verified, { color: colors.success }]}> ✓</Text>}
                        </Text>
                        <Text style={[styles.spotType, { color: colors.textSecondary }]}>
                            {spot.spot_type.replace('_', ' ')} • {spot.addedBy}
                        </Text>
                    </View>

                    {/* Mode indicator */}
                    <View style={styles.modeIndicator}>
                        <Text style={styles.modeEmoji}>
                            {selectedMode === 'all' ? '🌍' : TRANSPORT_MODE_EMOJIS[effectiveMode]}
                        </Text>
                        <Text style={[styles.overallRating, { color: colors.primary }]}>
                            {spot.overall_rating.toFixed(1)}
                        </Text>
                    </View>
                </View>

                {/* Mode-specific primary metric */}
                <View style={[styles.primaryMetric, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.primaryMetricText, { color: colors.primary }]}>
                        📊 {modeData.primaryMetric}
                    </Text>
                    <Text style={[styles.secondaryInfo, { color: colors.textSecondary }]}>
                        {modeData.secondaryInfo}
                    </Text>
                </View>

                {/* Standard metrics row */}
                <View style={styles.metricsRow}>
                    <View style={styles.metric}>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Safety</Text>
                        <Text style={[styles.metricValue, { color: colors.success }]}>
                            🛡️ {spot.safety_rating.toFixed(1)}
                        </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Distance</Text>
                        <Text style={[styles.metricValue, { color: colors.textSecondary }]}>
                            📍 {spot.distance || 'Unknown'}
                        </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Reviews</Text>
                        <Text style={[styles.metricValue, { color: colors.textSecondary }]}>
                            💬 {spot.totalReviews || 0}
                        </Text>
                    </View>
                </View>

                {/* Mode-specific tip */}
                {supportsMode && (
                    <View style={styles.tipContainer}>
                        <Text style={[styles.tip, { color: colors.textSecondary }]}>
                            💡 {modeData.contextualTip}
                        </Text>
                    </View>
                )}

                {/* Quick actions */}
                <View style={styles.actionsRow}>
                    {quickActions.slice(0, 2).map((action, index) => (
                        <TouchableOpacity
                            key={action.label}
                            style={[
                                styles.actionButton,
                                action.primary && { backgroundColor: colors.primary },
                                !action.primary && {
                                    backgroundColor: colors.backgroundSecondary,
                                    borderWidth: 1,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => onQuickAction?.(action.label)}
                        >
                            <Text style={[
                                styles.actionText,
                                { color: action.primary ? '#FFFFFF' : colors.text }
                            ]}>
                                {action.emoji} {action.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: Layout.spacing.base,
    },
    dimmedCard: {
        opacity: 0.6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Layout.spacing.sm,
    },
    mainInfo: {
        flex: 1,
    },
    spotName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    verified: {
        fontSize: 16,
    },
    spotType: {
        fontSize: 14,
        textTransform: 'capitalize',
    },
    modeIndicator: {
        alignItems: 'center',
        marginLeft: Layout.spacing.sm,
    },
    modeEmoji: {
        fontSize: 20,
        marginBottom: 2,
    },
    overallRating: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    primaryMetric: {
        padding: Layout.spacing.sm,
        borderRadius: Layout.radius.base,
        marginBottom: Layout.spacing.sm,
    },
    primaryMetricText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    secondaryInfo: {
        fontSize: 14,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Layout.spacing.sm,
    },
    metric: {
        alignItems: 'center',
        flex: 1,
    },
    metricLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    metricValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    tipContainer: {
        marginBottom: Layout.spacing.sm,
    },
    tip: {
        fontSize: 12,
        fontStyle: 'italic',
        lineHeight: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: Layout.spacing.sm,
    },
    actionButton: {
        flex: 1,
        paddingVertical: Layout.spacing.sm,
        paddingHorizontal: Layout.spacing.sm,
        borderRadius: Layout.radius.base,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
    },
});