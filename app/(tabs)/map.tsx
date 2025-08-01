import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function MapScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
                <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
                    🔍 Search locations...
                </Text>
            </View>

            {/* Map Placeholder */}
            <View style={[styles.mapContainer, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.mapPlaceholder, { color: colors.textSecondary }]}>
                    🗺️ Interactive Map Coming Soon
                </Text>
                <Text style={[styles.mapSubtext, { color: colors.textSecondary }]}>
                    Find the best hitchhiking spots near you
                </Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.actionButtonText}>📍 My Location</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accent }]}>
                    <Text style={styles.actionButtonText}>🔄 Refresh Spots</Text>
                </TouchableOpacity>
            </View>

            {/* Nearby Spots Preview */}
            <View style={styles.nearbyContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Nearby Spots</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3].map((spot) => (
                        <TouchableOpacity
                            key={spot}
                            style={[styles.spotCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                        >
                            <Text style={[styles.spotTitle, { color: colors.text }]}>Highway Exit {spot}</Text>
                            <Text style={[styles.spotRating, { color: colors.primary }]}>⭐ 4.{spot}/5</Text>
                            <Text style={[styles.spotDistance, { color: colors.textSecondary }]}>0.{spot} km away</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    searchPlaceholder: {
        fontSize: 16,
    },
    mapContainer: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    mapPlaceholder: {
        fontSize: 24,
        marginBottom: 8,
    },
    mapSubtext: {
        fontSize: 16,
        textAlign: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    nearbyContainer: {
        maxHeight: 120,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    spotCard: {
        width: 140,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginRight: 12,
    },
    spotTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    spotRating: {
        fontSize: 12,
        marginBottom: 2,
    },
    spotDistance: {
        fontSize: 12,
    },
});