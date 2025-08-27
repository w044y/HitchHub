// app/(tabs)/home.tsx - Replace the existing content
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useColorScheme } from '@/components/useColorScheme';
import { useProfile } from '@/app/contexts/ProfileContext';
import { TransportMode } from '@/app/types/transport';

// Import our modular components
import { HitchhikingStatsCard } from '@/components/home/HitchhikingStatsCard';
import { CyclingStatsCard } from '@/components/home/CyclingStatsCard';
import { QuickActionsCard } from '@/components/home/QuickActionsCard';

export default function HomeScreen() {
    const { profile, stats, isLoading } = useProfile();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    if (isLoading || !profile) {
        return (
            <LoadingSpinner
                message="Loading your travel profile..."
                color={colors.primary}
            />
        );
    }

    return (
        <Screen scrollable>
            {/* Welcome Card */}
            <Card style={styles.welcomeCard}>
                <View style={styles.welcomeHeader}>
                    <Text style={styles.welcomeEmoji}>🎒</Text>
                    <View style={styles.welcomeInfo}>
                        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                            Welcome back, Explorer!
                        </Text>
                        <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                            Ready for your next adventure?
                        </Text>
                    </View>
                </View>

                {/* Show user's travel modes */}
                <View style={styles.modesRow}>
                    <Text style={[styles.modesLabel, { color: colors.textSecondary }]}>
                        Your travel modes:
                    </Text>
                    <View style={styles.modesList}>
                        {profile.travelModes.map((mode) => (
                            <View key={mode} style={[styles.modeTag, { backgroundColor: colors.backgroundSecondary }]}>
                                <Text style={styles.modeTagText}>
                                    {mode === TransportMode.HITCHHIKING && '👍 Hitchhiking'}
                                    {mode === TransportMode.CYCLING && '🚲 Cycling'}
                                    {mode === TransportMode.VAN_LIFE && '🚐 Van Life'}
                                    {mode === TransportMode.WALKING && '🚶 Walking'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Card>

            {/* Conditional Stats Cards based on user's travel modes */}
            {profile.travelModes.includes(TransportMode.HITCHHIKING) && stats?.hitchhiking && (
                <HitchhikingStatsCard stats={stats.hitchhiking} />
            )}

            {profile.travelModes.includes(TransportMode.CYCLING) && stats?.cycling && (
                <CyclingStatsCard stats={stats.cycling} />
            )}

            {/* TODO: Add VanLifeStatsCard and WalkingStatsCard when those modes are selected */}

            {/* Smart Quick Actions */}
            <QuickActionsCard travelModes={profile.travelModes} />

            {/* Recent Activity - TODO: Make this mode-aware too */}
            <Card style={styles.card}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
                <Text style={[styles.comingSoon, { color: colors.textSecondary }]}>
                    Recent activity feed coming soon!
                </Text>
            </Card>
        </Screen>
    );
}

const styles = StyleSheet.create({
    welcomeCard: {
        marginBottom: Layout.spacing.base,
    },
    welcomeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Layout.spacing.base,
    },
    welcomeEmoji: {
        fontSize: 40,
        marginRight: Layout.spacing.base,
    },
    welcomeInfo: {
        flex: 1,
    },
    welcomeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontSize: 16,
    },
    modesRow: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: Layout.spacing.base,
    },
    modesLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: Layout.spacing.sm,
    },
    modesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Layout.spacing.xs,
    },
    modeTag: {
        paddingHorizontal: Layout.spacing.sm,
        paddingVertical: Layout.spacing.xs,
        borderRadius: Layout.radius.full,
    },
    modeTagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    card: {
        marginBottom: Layout.spacing.base,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Layout.spacing.base,
    },
    comingSoon: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: Layout.spacing.lg,
    },
});