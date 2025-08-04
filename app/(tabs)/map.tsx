import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Text } from '../../components/Themed';
import { Screen } from '../../components/layout/Screen';
import { MapView} from '../../components/map/MapView';
import {HitchhikingSpot} from "../../components/map/MapView";
// Mock data - replace with real data from your API later
const mockSpots: HitchhikingSpot[] = [
    {
        id: '1',
        name: 'Highway A1 Rest Stop',
        type: 'rest_stop',
        coordinates: [13.4100, 52.5250],
        rating: 4.5,
        safetyRating: 'high',
        description: 'Great visibility, friendly drivers, well-lit parking area',
        addedBy: 'TravelMike',
        lastUpdated: '2 hours ago',
    },
    {
        id: '2',
        name: 'Berlin Bridge Exit',
        type: 'bridge',
        coordinates: [13.3950, 52.5150],
        rating: 4.2,
        safetyRating: 'high',
        description: 'Good spot for rides heading south, safe pedestrian area',
        addedBy: 'RoadWanderer',
        lastUpdated: '1 day ago',
    },
    {
        id: '3',
        name: 'Gas Station Junction',
        type: 'gas_station',
        coordinates: [13.4200, 52.5300],
        rating: 3.8,
        safetyRating: 'medium',
        description: 'Busy gas station, ask drivers inside, moderate safety',
        addedBy: 'HitchPro',
        lastUpdated: '3 days ago',
    },
    {
        id: '4',
        name: 'Highway Entrance Ramp',
        type: 'highway_entrance',
        coordinates: [13.3800, 52.5100],
        rating: 4.7,
        safetyRating: 'high',
        description: 'Perfect for long-distance rides, excellent visibility',
        addedBy: 'EuroTraveler',
        lastUpdated: '5 hours ago',
    },
];

export default function MapScreen() {
    const [selectedSpot, setSelectedSpot] = useState<HitchhikingSpot | null>(null);
    const [showSpotDetails, setShowSpotDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef<any>(null);

    const handleSpotPress = (spot: HitchhikingSpot) => {
        setSelectedSpot(spot);
        setShowSpotDetails(true);
    };

    const handleMyLocation = () => {
        if (mapRef.current?.flyToUserLocation) {
            mapRef.current.flyToUserLocation();
        } else {
            Alert.alert('Info', 'Getting your location...');
        }
    };

    const handleAddSpot = (coordinates: [number, number]) => {
        Alert.alert(
            'Add New Spot',
            `Add a hitchhiking spot at this location?\n\nLat: ${coordinates[1].toFixed(4)}\nLng: ${coordinates[0].toFixed(4)}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Add Spot',
                    onPress: () => {
                        Alert.alert('Coming Soon', 'Add spot functionality will be implemented next!');
                    }
                }
            ]
        );
    };

    const getSafetyColor = (rating: string) => {
        switch (rating) {
            case 'high': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'low': return '#F44336';
            default: return '#666';
        }
    };

    const filteredSpots = mockSpots.filter(spot =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Screen padding={false}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search spots or places..."
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
            </View>

            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                spots={filteredSpots}
                onSpotPress={handleSpotPress}
                onMapPress={handleAddSpot}
                showUserLocation={true}
                zoomLevel={12}
            />

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleMyLocation}
                >
                    <Text style={styles.actionButtonText}>📍</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => Alert.alert('Coming Soon', 'Filter by safety, type, rating!')}
                >
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>🔍</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => Alert.alert('Coming Soon', 'Download offline maps!')}
                >
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>⬇️</Text>
                </TouchableOpacity>
            </View>

            {/* Spot Info Panel */}
            {showSpotDetails && selectedSpot && (
                <View style={styles.spotInfoPanel}>
                    <View style={styles.spotInfoHeader}>
                        <View style={styles.spotInfoTitle}>
                            <Text style={styles.spotName}>{selectedSpot.name}</Text>
                            <Text style={styles.spotType}>
                                {selectedSpot.type.replace('_', ' ').toUpperCase()}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowSpotDetails(false)}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.spotInfoContent}>
                        <View style={styles.spotStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>⭐ {selectedSpot.rating}</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={[
                                    styles.statValue,
                                    { color: getSafetyColor(selectedSpot.safetyRating) }
                                ]}>
                                    🛡️ {selectedSpot.safetyRating.toUpperCase()}
                                </Text>
                                <Text style={styles.statLabel}>Safety</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>👤 {selectedSpot.addedBy}</Text>
                                <Text style={styles.statLabel}>Added by</Text>
                            </View>
                        </View>

                        {selectedSpot.description && (
                            <Text style={styles.spotDescription}>{selectedSpot.description}</Text>
                        )}

                        <View style={styles.spotActions}>
                            <TouchableOpacity
                                style={styles.primaryAction}
                                onPress={() => Alert.alert('Navigate', `Navigate to ${selectedSpot.name}?`)}
                            >
                                <Text style={styles.primaryActionText}>📍 Navigate</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryAction}
                                onPress={() => Alert.alert('Details', 'Full spot details coming soon!')}
                            >
                                <Text style={styles.secondaryActionText}>ℹ️ Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Stats Bar */}
            <View style={styles.statsBar}>
                <Text style={styles.statsText}>
                    📍 {filteredSpots.length} spots {searchQuery ? `for "${searchQuery}"` : 'nearby'} •
                    🛡️ {filteredSpots.filter(s => s.safetyRating === 'high').length} safe spots
                </Text>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        top: 20,
        left: 16,
        right: 16,
        zIndex: 1000,
    },
    searchInput: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        color: '#333',
    },
    quickActions: {
        position: 'absolute',
        bottom: 120,
        right: 16,
        gap: 8,
        zIndex: 1000,
    },
    actionButton: {
        width: 50,
        height: 50,
        backgroundColor: '#2E7D32',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    secondaryButton: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#2E7D32',
    },
    actionButtonText: {
        fontSize: 20,
        color: '#ffffff',
    },
    secondaryButtonText: {
        color: '#2E7D32',
    },
    spotInfoPanel: {
        position: 'absolute',
        bottom: 60,
        left: 16,
        right: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
    },
    spotInfoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    spotInfoTitle: {
        flex: 1,
    },
    spotName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    spotType: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#666',
    },
    spotInfoContent: {
        padding: 16,
    },
    spotStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    spotDescription: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 16,
    },
    spotActions: {
        flexDirection: 'row',
        gap: 8,
    },
    primaryAction: {
        flex: 1,
        backgroundColor: '#2E7D32',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryActionText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 14,
    },
    secondaryAction: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    secondaryActionText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 14,
    },
    statsBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(46, 125, 50, 0.9)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        zIndex: 1000,
    },
    statsText: {
        color: '#ffffff',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
});