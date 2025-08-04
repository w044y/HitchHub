import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/ui';
import { Card } from '@/components/ui';

interface Spot {
    id: string;
    name: string;
    type: string;
    distance: string;
    rating: number;
    safetyRating: 'High' | 'Medium' | 'Low';
    lastUpdated: string;
}

interface SpotCardProps {
    spot: Spot;
    onPress?: () => void;
}

export function SpotCard({ spot, onPress }: SpotCardProps) {
    const getSafetyColor = (rating: string) => {
        switch (rating) {
            case 'High': return '#4CAF50';
            case 'Medium': return '#FF9800';
            case 'Low': return '#F44336';
            default: return '#666';
        }
    };

    return (
        <Card onPress={onPress}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.mainInfo}>
                    <Text style={styles.name}>{spot.name}</Text>
                    <Text style={styles.type}>{spot.type}</Text>
                </View>
                <View style={styles.rating}>
                    <Text style={styles.ratingText}>⭐ {spot.rating}</Text>
                </View>
            </View>

            {/* Details */}
            <View style={styles.details}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Distance</Text>
                    <Text style={styles.detailValue}>{spot.distance}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Safety</Text>
                    <Text style={[
                        styles.detailValue,
                        { color: getSafetyColor(spot.safetyRating) }
                    ]}>
                        {spot.safetyRating}
                    </Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Updated</Text>
                    <Text style={styles.detailValue}>{spot.lastUpdated}</Text>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>📍 Navigate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                        ℹ️ Details
                    </Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    mainInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    type: {
        fontSize: 14,
        color: '#666',
    },
    rating: {
        alignItems: 'flex-end',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#2E7D32',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: '#f0f0f0',
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
    secondaryButtonText: {
        color: '#333',
    },
});