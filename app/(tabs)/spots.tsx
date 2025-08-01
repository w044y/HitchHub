import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const mockSpots = [
    {
        id: 1,
        name: 'Highway 101 Rest Stop',
        rating: 4.5,
        distance: '0.8 km',
        type: 'Rest Stop',
        lastUpdated: '2 hours ago',
        safetyRating: 'High',
    },
    {
        id: 2,
        name: 'Main Street Bridge',
        rating: 4.2,
        distance: '1.2 km',
        type: 'Bridge',
        lastUpdated: '5 hours ago',
        safetyRating: 'Medium',
    },
    {
        id: 3,
        name: 'Gas Station Junction',
        rating: 4.8,
        distance: '2.1 km',
        type: 'Gas Station',
        lastUpdated: '1 day ago',
        safetyRating: 'High',
    },
];

export default function SpotsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [searchQuery, setSearchQuery] = useState('');

    const getSafetyColor = (rating: string) => {
        switch (rating) {
            case 'High': return '#4CAF50';
            case 'Medium': return '#FF9800';
            case 'Low': return '#F44336';
            default: return colors.textSecondary;
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Search & Filter */}
            <View style={styles.searchSection}>
                <TextInput
                    style={[styles.searchInput, {
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.border,
                        color: colors.text
                    }]}
                    placeholder="Search spots..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.filterButtonText}>🔽 Filter</Text>
                </TouchableOpacity>
            </View>

            {/* Sort Options */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortContainer}>
                {['Nearest', 'Highest Rated', 'Most Recent', 'Safest'].map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.sortChip, {
                            backgroundColor: option === 'Nearest' ? colors.primary : colors.secondary,
                            borderColor: colors.border
                        }]}
                    >
                        <Text style={[styles.sortChipText, {
                            color: option === 'Nearest' ? '#ffffff' : colors.text
                        }]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Spots List */}
            <View style={styles.spotsContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {mockSpots.length} spots found nearby
                </Text>

                {mockSpots.map((spot) => (
                    <TouchableOpacity
                        key={spot.id}
                        style={[styles.spotCard, {
                            backgroundColor: colors.background,
                            borderColor: colors.border
                        }]}
                    >
                        {/* Spot Header */}
                        <View style={styles.spotHeader}>
                            <View style={styles.spotMainInfo}>
                                <Text style={[styles.spotName, { color: colors.text }]}>{spot.name}</Text>
                                <Text style={[styles.spotType, { color: colors.textSecondary }]}>{spot.type}</Text>
                            </View>
                            <View style={styles.spotRating}>
                                <Text style={[styles.ratingText, { color: colors.primary }]}>
                                    ⭐ {spot.rating}
                                </Text>
                            </View>
                        </View>

                        {/* Spot Details */}
                        <View style={styles.spotDetails}>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Distance</Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>{spot.distance}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Safety</Text>
                                <Text style={[styles.detailValue, { color: getSafetyColor(spot.safetyRating) }]}>
                                    {spot.safetyRating}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Updated</Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>{spot.lastUpdated}</Text>
                            </View>
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.spotActions}>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                                <Text style={styles.actionBtnText}>📍 Navigate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]}>
                                <Text style={[styles.actionBtnText, { color: colors.text }]}>ℹ️ Details</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchSection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    filterButtonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    sortContainer: {
        marginBottom: 16,
    },
    sortChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    sortChipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    spotsContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    spotCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    spotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    spotMainInfo: {
        flex: 1,
    },
    spotName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    spotType: {
        fontSize: 14,
    },
    spotRating: {
        alignItems: 'flex-end',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
    },
    spotDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    spotActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
});