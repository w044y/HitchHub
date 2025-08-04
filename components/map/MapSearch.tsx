import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '../../components/Themed';
import { HitchhikingSpot } from './MapView';

interface SearchResult {
    id: string;
    name: string;
    address: string;
    coordinates: [number, number];
    type: 'spot' | 'place';
    spot: HitchhikingSpot;
}

interface MapSearchProps {
    spots: HitchhikingSpot[];
    onLocationSelect: (coordinates: [number, number], name: string) => void;
    onSpotSelect: (spot: HitchhikingSpot) => void;
    style?: any;
}

export function MapSearch({ spots, onLocationSelect, onSpotSelect, style }: MapSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const searchSpots = (searchQuery: string): SearchResult[] => {
        if (!searchQuery.trim()) return [];

        const filteredSpots = spots
            .filter(spot =>
                spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                spot.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (spot.description && spot.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map(spot => ({
                id: spot.id,
                name: spot.name,
                address: `${spot.type} • Safety: ${spot.safetyRating}`,
                coordinates: spot.coordinates,
                type: 'spot' as const,
                spot,
            }));

        return filteredSpots;
    };

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);

        if (!searchQuery.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        setShowResults(true);

        try {
            // Search in local spots
            const spotResults = searchSpots(searchQuery);

            // TODO: Add geocoding search for places
            // For now, we'll just show spot results
            setResults(spotResults);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleResultPress = (result: SearchResult) => {
        if (result.type === 'spot' && result.spot) {
            onSpotSelect(result.spot);
        } else {
            onLocationSelect(result.coordinates, result.name);
        }

        setQuery(result.name);
        setShowResults(false);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    const renderResult = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleResultPress(item)}
        >
            <View style={styles.resultContent}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultAddress}>{item.address}</Text>
            </View>
            <View style={styles.resultIcon}>
                <Text style={styles.resultIconText}>
                    {item.type === 'spot' ? '📍' : '🏙️'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, style]}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search spots or places..."
                    placeholderTextColor="#666"
                    value={query}
                    onChangeText={handleSearch}
                    onFocus={() => setShowResults(query.length > 0)}
                    autoCorrect={false}
                    autoCapitalize="none"
                />

                {query.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                        <Text style={styles.clearButtonText}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {showResults && (
                <View style={styles.resultsContainer}>
                    {isSearching ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Searching...</Text>
                        </View>
                    ) : results.length > 0 ? (
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.id}
                            renderItem={renderResult}
                            style={styles.resultsList}
                            keyboardShouldPersistTaps="handled"
                        />
                    ) : (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsText}>
                                No spots found for "{query}"
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        color: '#333',
    },
    clearButton: {
        padding: 4,
        marginLeft: 8,
    },
    clearButtonText: {
        fontSize: 16,
        color: '#666',
    },
    resultsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginTop: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        maxHeight: 200,
        zIndex: 1000,
    },
    resultsList: {
        maxHeight: 200,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    resultContent: {
        flex: 1,
    },
    resultName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    resultAddress: {
        fontSize: 14,
        color: '#666',
    },
    resultIcon: {
        marginLeft: 12,
    },
    resultIconText: {
        fontSize: 18,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
    },
    noResultsContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});