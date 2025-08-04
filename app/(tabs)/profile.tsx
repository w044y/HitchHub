import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
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
                    onPress: () => router.replace('../auth/login')
                }
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: colors.inputBackground }]}>
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

                <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={styles.actionIcon}>📍</Text>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>My Spots</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                            View and manage your added spots
                        </Text>
                    </View>
                    <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={styles.actionIcon}>❤️</Text>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Saved Spots</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                            Your favorite hitchhiking locations
                        </Text>
                    </View>
                    <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={styles.actionIcon}>🗺️</Text>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Trip History</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                            Track your hitchhiking journeys
                        </Text>
                    </View>
                    <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Settings */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

                <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={styles.actionIcon}>👤</Text>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Edit Profile</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                            Update your personal information
                        </Text>
                    </View>
                    <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={styles.actionIcon}>🔔</Text>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Notifications</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                            Manage notification preferences
                        </Text>
                    </View>
                    <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={styles.actionIcon}>🛡️</Text>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Privacy & Safety</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                            Control your privacy settings
                        </Text>
                    </View>
                    <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={styles.actionIcon}>❓</Text>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Help & Support</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                            Get help and contact support
                        </Text>
                    </View>
                    <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>
            </View>

            {/* About */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>

                <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={styles.actionIcon}>⭐</Text>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Rate HitchSpot</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                            Help us improve the app
                        </Text>
                    </View>
                    <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={styles.actionIcon}>📄</Text>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>Terms & Privacy</Text>
                        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                            Legal information
                        </Text>
                    </View>
                    <Text style={[styles.actionArrow, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>
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
                HitchSpot v1.0.0
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