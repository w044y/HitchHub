// components/home/CyclingStatsCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useColorScheme } from '@/components/useColorScheme';

interface CyclingStatsCardProps {
    stats: {
        totalDistance: number;
        totalRoutes: number;
        lastRide?: Date;
    };
}

export const CyclingStatsCard: React.FC<CyclingStatsCardProps> = ({ stats }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.modeEmoji}>🚲</Text>
                <Text style={[styles.title, { color: colors.text }]}>Cycling Adventures</Text>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: colors.success }]}>
                        {stats.totalDistance}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        km cycled
                    </Text>
                </View>

                <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: colors.success }]}>
                        {stats.totalRoutes}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        routes completed
                    </Text>
                </View>
            </View>

            {stats.lastRide && (
                <Text style={[styles.lastActivity, { color: colors.textSecondary }]}>
                    Last ride: 3 days ago
                </Text>
            )}
        </Card>
    );
};

// Same styles as HitchhikingStatsCard
const styles = StyleSheet.create({
    card: { marginBottom: Layout.spacing.base },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: Layout.spacing.base },
    modeEmoji: { fontSize: 24, marginRight: Layout.spacing.sm },
    title: { fontSize: 18, fontWeight: 'bold' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Layout.spacing.sm },
    stat: { alignItems: 'center', flex: 1 },
    statNumber: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    statLabel: { fontSize: 12, textAlign: 'center', lineHeight: 16 },
    lastActivity: { fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
});