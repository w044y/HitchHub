// app/(tabs)/trips.tsx - Ensure proper default export
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { Colors, ColorPalette } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';

// Main Component - ENSURE THIS IS THE DEFAULT EXPORT
function TripsScreen() {
    const [activeTab, setActiveTab] = useState('current');
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <Screen scrollable>
            {/* Tab Selector */}
            <View style={styles.tabSelector}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        { backgroundColor: colors.backgroundSecondary },
                        activeTab === 'current' && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setActiveTab('current')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'current' ? '#FFFFFF' : colors.textSecondary }
                    ]}>
                        🎯 Current
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        { backgroundColor: colors.backgroundSecondary },
                        activeTab === 'planned' && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setActiveTab('planned')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'planned' ? '#FFFFFF' : colors.textSecondary }
                    ]}>
                        📅 Planned
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        { backgroundColor: colors.backgroundSecondary },
                        activeTab === 'history' && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setActiveTab('history')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'history' ? '#FFFFFF' : colors.textSecondary }
                    ]}>
                        📚 History
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <Card style={styles.card}>
                <Text style={styles.placeholderEmoji}>🎒</Text>
                <Text style={[styles.placeholderTitle, { color: colors.text }]}>
                    {activeTab === 'current' && 'Current Trips'}
                    {activeTab === 'planned' && 'Plan New Trip'}
                    {activeTab === 'history' && 'Trip History'}
                </Text>
                <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                    Track your sustainable travel adventures, plan eco-friendly routes, and share your journey with the community.
                </Text>
                <TouchableOpacity
                    style={[styles.comingSoonButton, { backgroundColor: colors.primary }]}
                    onPress={() => Alert.alert('Trips', 'Trip features coming soon!')}
                >
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                </TouchableOpacity>
            </Card>
        </Screen>
    );
}

const styles = StyleSheet.create({
    tabSelector: {
        flexDirection: 'row',
        marginBottom: Layout.spacing.base,
        gap: Layout.spacing.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: Layout.spacing.sm,
        paddingHorizontal: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        alignItems: 'center',
    },
    tabText: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.medium,
    },
    card: {
        alignItems: 'center',
        paddingVertical: Layout.spacing['3xl'],
    },
    placeholderEmoji: {
        fontSize: 64,
        marginBottom: Layout.spacing.lg,
    },
    placeholderTitle: {
        fontSize: Typography.sizes['2xl'],
        fontFamily: Typography.fonts.bold,
        marginBottom: Layout.spacing.base,
        textAlign: 'center',
    },
    placeholderText: {
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.regular,
        textAlign: 'center',
        marginBottom: Layout.spacing.xl,
        lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
        paddingHorizontal: Layout.spacing.lg,
    },
    comingSoonButton: {
        paddingHorizontal: Layout.spacing.xl,
        paddingVertical: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    comingSoonText: {
        color: '#FFFFFF',
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.semiBold,
    },
});

// CRITICAL: Make sure this is the default export
export default TripsScreen;