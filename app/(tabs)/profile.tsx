// app/(tabs)/profile.tsx
import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '../../constants/Colors';
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
    level: 'Experienced Hitchhiker',
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
                    onPress: () => Alert.alert('Logout', 'Logout functionality coming soon!')
                }
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>AT</Text>
                </View>
                <Text style={[styles.userName, { color: colors.text }]}>{mockUser.name}</Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{mockUser.email}</Text>
                <Text style={[styles.userLevel, { color: colors.primary }]}>{mockUser.level}</Text>
                <Text style={[styles.joinDate, { color: colors.textSecondary }]}>
                    Member since {mockUser.joinDate}
                </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>{mockUser.spotsAdded}</Text>
                    <Text style={[styles.statLabel, { color: colors.text }]}>Spots Added</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>{mockUser.totalRides}</Text>
                    <Text style={[styles.statLabel, { color: colors.text }]}>Total Rides</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>{mockUser.countries}</Text>
                    <Text style={[styles.statLabel, { color: colors.text }]}>Countries</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>⭐ {mockUser.rating}</Text>
                    <Text style={[styles.statLabel, { color: colors.text }]}>Rating</Text>
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
                        style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}
                        onPress={() => Alert.alert(action.title, 'Feature coming soon!')}
                    >
                        <Text style={styles.actionIcon}>{action.icon}</Text>
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
                        style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}
                        onPress={() => Alert.alert(setting.title, 'Feature coming soon!')}
                    >
                        <Text style={styles.actionIcon}>{setting.icon}</Text>
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
        padding: 16,
    },
    profileHeader: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        marginBottom: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        marginBottom: 8,
    },
    userLevel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    joinDate: {
        fontSize: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    actionIcon: {
        fontSize: 20,
        marginRight: 12,
        width: 24,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 12,
    },
    actionArrow: {
        fontSize: 18,
    },
    logoutButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 20,
    },
});