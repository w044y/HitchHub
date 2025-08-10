// app/(tabs)/you.tsx - Aligned styling
import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { useColorScheme } from '../../components/useColorScheme';
import { router } from 'expo-router';

const mockUser = {
    name: 'Alex Traveler',
    email: 'alex@example.com',
    joinDate: 'March 2024',
    spotsAdded: 12,
    totalRides: 47,
    countries: 8,
    rating: 4.8,
    level: 'Road Wanderer',
    totalDistance: '2,340 km',
};

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => router.replace('/welcome')
                }
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>🏕️</Text>
                </View>
                <Text style={[styles.userName, { color: colors.text }]}>{mockUser.name}</Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{mockUser.email}</Text>
                <View style={[styles.levelBadge, { backgroundColor: `${colors.primary}20`, borderColor: colors.primary }]}>
                    <Text style={[styles.userLevel, { color: colors.primary }]}>🎒 {mockUser.level}</Text>
                </View>
                <Text style={[styles.joinDate, { color: colors.textSecondary }]}>
                    Member since {mockUser.joinDate}
                </Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>{mockUser.spotsAdded}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spots Added</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>{mockUser.totalRides}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Rides</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>{mockUser.countries}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Countries</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>⭐ {mockUser.rating}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
                </View>
            </View>

            {/* Journey Stats */}
            <View style={[styles.sectionCard, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Journey Stats</Text>
                <View style={styles.journeyRow}>
                    <View style={styles.journeyItem}>
                        <Text style={styles.journeyEmoji}>🛣️</Text>
                        <Text style={[styles.journeyNumber, { color: colors.primary }]}>{mockUser.totalDistance}</Text>
                        <Text style={[styles.journeyLabel, { color: colors.textSecondary }]}>Total Distance</Text>
                    </View>
                    <View style={styles.journeyItem}>
                        <Text style={styles.journeyEmoji}>🌍</Text>
                        <Text style={[styles.journeyNumber, { color: colors.primary }]}>35</Text>
                        <Text style={[styles.journeyLabel, { color: colors.textSecondary }]}>Cities Visited</Text>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>

                {[
                    { icon: '📍', title: 'My Spots', subtitle: 'View and manage your added spots' },
                    { icon: '❤️', title: 'Saved Spots', subtitle: 'Your favorite hitchhiking locations' },
                    { icon: '🗺️', title: 'Trip History', subtitle: 'Track your hitchhiking journeys' },
                ].map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.actionItem, { backgroundColor: colors.backgroundSecondary }]}
                        onPress={() => Alert.alert(action.title, 'Feature coming soon!')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.actionIconContainer, { backgroundColor: `${colors.primary}20` }]}>
                            <Text style={styles.actionIcon}>{action.icon}</Text>
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
                            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>{action.subtitle}</Text>
                        </View>
                        <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Settings */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

                {[
                    { icon: '👤', title: 'Edit Profile', subtitle: 'Update your personal information' },
                    { icon: '🔔', title: 'Notifications', subtitle: 'Manage notification preferences' },
                    { icon: '🛡️', title: 'Privacy & Safety', subtitle: 'Control your privacy settings' },
                    { icon: '❓', title: 'Help & Support', subtitle: 'Get help and contact support' },
                ].map((setting, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.actionItem, { backgroundColor: colors.backgroundSecondary }]}
                        onPress={() => Alert.alert(setting.title, 'Feature coming soon!')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.actionIconContainer, { backgroundColor: `${colors.primary}20` }]}>
                            <Text style={styles.actionIcon}>{setting.icon}</Text>
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={[styles.actionTitle, { color: colors.text }]}>{setting.title}</Text>
                            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>{setting.subtitle}</Text>
                        </View>
                        <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout */}
            <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: colors.error }]}
                onPress={handleLogout}
                activeOpacity={0.8}
            >
                <Text style={styles.logoutButtonText}>🚪 Logout</Text>
            </TouchableOpacity>

            {/* Version */}
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>
                HitchHub v1.0.0
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Layout.spacing.base,
    },
    profileHeader: {
        alignItems: 'center',
        padding: Layout.spacing.lg,
        borderRadius: Layout.radius.base,
        marginBottom: Layout.spacing.lg,
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
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Layout.spacing.base,
    },
    avatarText: {
        fontSize: 32,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        marginBottom: Layout.spacing.base,
    },
    levelBadge: {
        paddingHorizontal: Layout.spacing.base,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 8,
    },
    userLevel: {
        fontSize: 14,
        fontWeight: '600',
    },
    joinDate: {
        fontSize: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: Layout.spacing.sm,
        marginBottom: Layout.spacing.lg,
    },
    statCard: {
        flex: 1,
        padding: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 16,
    },
    sectionCard: {
        padding: Layout.spacing.lg,
        borderRadius: Layout.radius.base,
        marginBottom: Layout.spacing.lg,
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
    journeyRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    journeyItem: {
        alignItems: 'center',
    },
    journeyEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    journeyNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    journeyLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    section: {
        marginBottom: Layout.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Layout.spacing.base,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        marginBottom: Layout.spacing.base,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    actionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Layout.spacing.base,
    },
    actionIcon: {
        fontSize: 20,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        lineHeight: 20,
    },
    actionSubtitle: {
        fontSize: 13,
        lineHeight: 18,
    },
    actionArrow: {
        fontSize: 20,
        fontWeight: '300',
    },
    logoutButton: {
        paddingVertical: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        alignItems: 'center',
        marginBottom: Layout.spacing.base,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: Layout.spacing.lg,
    },
});