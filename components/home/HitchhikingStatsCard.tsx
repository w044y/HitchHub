// components/home/HitchhikingStatsCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useColorScheme } from '@/components/useColorScheme';

interface HitchhikingStatsCardProps {
    stats: {
        totalRides: number;
        totalDistance: number;
        averageRating: number;
        lastRide?: Date;
    };
}

export const HitchhikingStatsCard: React.FC<HitchhikingStatsCardProps> = ({ stats }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    };

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.modeEmoji}>👍</Text>
                <Text style={[styles.title, { color: colors.text }]}>Hitchhiking Journey</Text>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>
                        {stats.totalRides}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        rides caught
                    </Text>
                </View>

                <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>
                        {(stats.totalDistance / 1000).toFixed(1)}k
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        km traveled
                    </Text>
                </View>

                <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: colors.success }]}>
                        {stats.averageRating.toFixed(1)}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        avg rating
                    </Text>
                </View>
            </View>

            {stats.lastRide && (
                <Text style={[styles.lastActivity, { color: colors.textSecondary }]}>
                    Last ride: {formatDate(stats.lastRide)}
                </Text>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: Layout.spacing.base,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Layout.spacing.base,
    },
    modeEmoji: {
        fontSize: 24,
        marginRight: Layout.spacing.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Layout.spacing.sm,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 16,
    },
    lastActivity: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});