// app/spots/[id].tsx - Updated with multi-modal reviews
import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
    Linking,
    Share,
    Platform,
} from 'react-native';
import { Text } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useColorScheme } from '@/components/useColorScheme';
import { apiClient } from '@/app/services/api';

// Add transport mode types
enum TransportMode {
    HITCHHIKING = 'hitchhiking',
    CYCLING = 'cycling',
    VAN_LIFE = 'van_life',
    WALKING = 'walking'
}

const TRANSPORT_MODE_LABELS = {
    [TransportMode.HITCHHIKING]: 'Hitchhiking',
    [TransportMode.CYCLING]: 'Cycling',
    [TransportMode.VAN_LIFE]: 'Van Life',
    [TransportMode.WALKING]: 'Walking'
};

const TRANSPORT_MODE_EMOJIS = {
    [TransportMode.HITCHHIKING]: '👍',
    [TransportMode.CYCLING]: '🚲',
    [TransportMode.VAN_LIFE]: '🚐',
    [TransportMode.WALKING]: '🚶'
};

interface SpotDetail {
    id: string;
    name: string;
    description: string;
    spot_type: string;
    latitude: number;
    longitude: number;
    safety_rating: number;
    overall_rating: number;
    is_verified: boolean;
    photo_urls: string[];
    facilities: string[];
    tips: string;
    accessibility_info: string;
    transport_modes: TransportMode[];
    mode_ratings: any;
    total_reviews: number;
    last_reviewed: string;
    created_by: {
        id: string;
        display_name: string;
        username: string;
        safety_rating: number;
    };
    created_at: string;
}

interface Review {
    id: string;
    transport_mode: TransportMode;
    safety_rating: number;
    effectiveness_rating: number;
    overall_rating: number;
    comment?: string;
    wait_time_minutes?: number;
    legal_status?: number;
    facility_rating?: number;
    accessibility_rating?: number;
    location_verified: boolean;
    distance_from_spot?: number;
    created_at: string;
    user: {
        display_name: string;
        username: string;
        safety_rating: number;
    };
}

export default function SpotDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [spot, setSpot] = useState<SpotDetail | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [selectedTransportMode, setSelectedTransportMode] = useState<TransportMode | 'all'>('all');

    useEffect(() => {
        if (id) {
            fetchSpotData();
        }
    }, [id]);

    useEffect(() => {
        if (id && spot) {
            fetchReviews();
        }
    }, [id, selectedTransportMode, spot]);

    // app/spots/[id].tsx - Fix all rating displays
    const fetchSpotData = async () => {
        try {
            console.log('🔍 Fetching spot details for ID:', id);

            const spotResponse = await apiClient.getSpotById(id!);

            // Fix ALL the numeric fields when setting the spot
            const spotData = {
                ...spotResponse.data,
                overall_rating: parseFloat(spotResponse.data.overall_rating || 0),
                safety_rating: parseFloat(spotResponse.data.safety_rating || 0),
                latitude: parseFloat(spotResponse.data.latitude || 0),
                longitude: parseFloat(spotResponse.data.longitude || 0),
                // Fix the created_by safety_rating too
                created_by: spotResponse.data.created_by ? {
                    ...spotResponse.data.created_by,
                    safety_rating: parseFloat(spotResponse.data.created_by.safety_rating || 0)
                } : null,
            };

            setSpot(spotData);
            console.log('✅ Loaded and converted spot data:', spotData);
        } catch (error) {
            console.error('❌ Error fetching spot data:', error);
            Alert.alert('Error', 'Could not load spot details');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReviews = async () => {
        if (!spot) return;

        try {
            setIsLoadingReviews(true);
            console.log('🔍 Fetching reviews for transport mode:', selectedTransportMode);

            const filters: any = { limit: 20, sort_by: 'newest' };
            if (selectedTransportMode !== 'all') {
                filters.transport_mode = selectedTransportMode;
            }

            const response = await apiClient.getSpotReviews(id!, filters);
            setReviews(response.data || []);

            console.log('✅ Loaded reviews:', response.data);
        } catch (error) {
            console.error('❌ Error fetching reviews:', error);
            // Don't show error alert for reviews - just log it
        } finally {
            setIsLoadingReviews(false);
        }
    };

    const renderTransportModeSelector = () => {
        if (!spot?.transport_modes?.length && !spot?.mode_ratings) return null;

        // Get available modes from spot data
        const availableModes = spot.transport_modes || Object.keys(spot.mode_ratings || {});
        if (availableModes.length === 0) return null;

        const modes = ['all', ...availableModes];

        return (
            <View style={styles.transportModeSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {modes.map((mode) => (
                        <TouchableOpacity
                            key={mode}
                            style={[
                                styles.modeButton,
                                {
                                    backgroundColor: selectedTransportMode === mode
                                        ? colors.primary
                                        : colors.backgroundSecondary,
                                    borderColor: colors.border
                                }
                            ]}
                            onPress={() => setSelectedTransportMode(mode as TransportMode | 'all')}
                        >
                            <Text style={styles.modeButtonEmoji}>
                                {mode === 'all' ? '🌍' : TRANSPORT_MODE_EMOJIS[mode as TransportMode]}
                            </Text>
                            <Text style={[
                                styles.modeButtonText,
                                {
                                    color: selectedTransportMode === mode ? '#FFFFFF' : colors.text
                                }
                            ]}>
                                {mode === 'all' ? 'All' : TRANSPORT_MODE_LABELS[mode as TransportMode]}
                            </Text>
                            {mode !== 'all' && spot.mode_ratings?.[mode] && (
                                <Text style={[
                                    styles.modeReviewCount,
                                    {
                                        color: selectedTransportMode === mode ? '#FFFFFF' : colors.textSecondary
                                    }
                                ]}>
                                    ({spot.mode_ratings[mode].review_count})
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    const renderModeSpecificRating = (review: Review) => {
        const mode = review.transport_mode;

        return (
            <View style={styles.modeSpecificRatings}>
                {mode === TransportMode.HITCHHIKING && review.wait_time_minutes && (
                    <Text style={[styles.modeSpecificText, { color: colors.textSecondary }]}>
                        ⏱️ Wait: {review.wait_time_minutes}min
                    </Text>
                )}
                {mode === TransportMode.VAN_LIFE && review.legal_status && (
                    <Text style={[styles.modeSpecificText, { color: colors.textSecondary }]}>
                        ⚖️ Legal: {review.legal_status}/5
                    </Text>
                )}
                {(mode === TransportMode.CYCLING || mode === TransportMode.WALKING) && review.facility_rating && (
                    <Text style={[styles.modeSpecificText, { color: colors.textSecondary }]}>
                        🏢 Facilities: {review.facility_rating}/5
                    </Text>
                )}
                {review.accessibility_rating && (
                    <Text style={[styles.modeSpecificText, { color: colors.textSecondary }]}>
                        ♿ Access: {review.accessibility_rating}/5
                    </Text>
                )}
            </View>
        );
    };

    const handleNavigate = () => {
        if (!spot) return;

        const url = Platform.select({
            ios: `maps:${spot.latitude},${spot.longitude}`,
            android: `geo:${spot.latitude},${spot.longitude}?q=${spot.latitude},${spot.longitude}(${encodeURIComponent(spot.name)})`,
        });

        Linking.openURL(url!).catch(() => {
            Alert.alert('Error', 'Could not open maps application');
        });
    };

    const handleShare = async () => {
        if (!spot) return;

        try {
            await Share.share({
                message: `Check out this spot: ${spot.name}\n\n${spot.description}\n\nRating: ${spot.overall_rating}⭐ | Safety: ${spot.safety_rating}🛡️\n\nShared via Vendro`,
                title: spot.name,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handleReport = () => {
        Alert.alert(
            'Report Spot',
            'Why are you reporting this spot?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Inappropriate content', onPress: () => submitReport('inappropriate') },
                { text: 'Inaccurate information', onPress: () => submitReport('inaccurate') },
                { text: 'Safety concern', onPress: () => submitReport('safety') },
            ]
        );
    };

    const submitReport = async (reason: string) => {
        Alert.alert('Reported', 'Thank you for your report. We will review it shortly.');
    };

    const handleSave = () => {
        Alert.alert('Saved!', 'Spot saved to your favorites');
    };

    const getFacilityEmoji = (facility: string) => {
        const facilityMap: { [key: string]: string } = {
            restroom: '🚻',
            food: '🍔',
            parking: '🅿️',
            wifi: '📶',
            atm: '💳',
            shelter: '🏠',
        };
        return facilityMap[facility] || '📍';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getSpotTypeDisplay = (type: string) => {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    if (isLoading) {
        return (
            <Screen>
                <LoadingSpinner message="Loading spot details..." color={colors.primary} />
            </Screen>
        );
    }

    if (!spot) {
        return (
            <Screen>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>Spot not found</Text>
                    <TouchableOpacity
                        style={[styles.backButtonContainer, { backgroundColor: colors.primary }]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>← Go Back</Text>
                    </TouchableOpacity>
                </View>
            </Screen>
        );
    }

    return (
        <Screen scrollable>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleShare} style={styles.headerAction}>
                        <Text style={styles.headerActionText}>📤</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReport} style={styles.headerAction}>
                        <Text style={styles.headerActionText}>🚩</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Photos */}
            {spot.photo_urls && spot.photo_urls.length > 0 && (
                <Card style={styles.photosCard}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(event.nativeEvent.contentOffset.x / 300);
                            setActivePhotoIndex(index);
                        }}
                    >
                        {spot.photo_urls.map((photo, index) => (
                            <Image key={index} source={{ uri: photo }} style={styles.photo} />
                        ))}
                    </ScrollView>

                    {/* Photo indicators */}
                    {spot.photo_urls.length > 1 && (
                        <View style={styles.photoIndicators}>
                            {spot.photo_urls.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.photoIndicator,
                                        { backgroundColor: index === activePhotoIndex ? colors.primary : colors.textSecondary }
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </Card>
            )}

            {/* Main Info */}
            <Card>
                <View style={styles.titleSection}>
                    <Text style={[styles.spotName, { color: colors.text }]}>
                        {spot.name}
                        {spot.is_verified && <Text style={[styles.verifiedBadge, { color: colors.success }]}> ✓</Text>}
                    </Text>
                    <Text style={[styles.spotType, { color: colors.textSecondary }]}>
                        {getSpotTypeDisplay(spot.spot_type)}
                    </Text>

                    {/* Transport Modes */}
                    {spot.transport_modes && spot.transport_modes.length > 0 && (
                        <View style={styles.transportModes}>
                            {spot.transport_modes.map((mode) => (
                                <View key={mode} style={[styles.transportModeTag, { backgroundColor: colors.backgroundSecondary }]}>
                                    <Text style={styles.transportModeEmoji}>{TRANSPORT_MODE_EMOJIS[mode]}</Text>
                                    <Text style={[styles.transportModeText, { color: colors.text }]}>
                                        {TRANSPORT_MODE_LABELS[mode]}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.ratingsRow}>
                    <View style={styles.rating}>
                        <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Overall</Text>
                        <Text style={[styles.ratingValue, { color: colors.primary }]}>
                            ⭐ {spot.overall_rating ? spot.overall_rating.toFixed(1) : '0.0'}
                        </Text>
                    </View>
                    <View style={styles.rating}>
                        <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Safety</Text>
                        <Text style={[styles.ratingValue, { color: colors.success }]}>
                            🛡️ {spot.safety_rating ? spot.safety_rating.toFixed(1) : '0.0'}
                        </Text>
                    </View>
                    <View style={styles.rating}>
                        <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Reviews</Text>
                        <Text style={[styles.ratingValue, { color: colors.textSecondary }]}>
                            💬 {spot.total_reviews || 0}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.description, { color: colors.text }]}>
                    {spot.description}
                </Text>
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={handleNavigate}
                >
                    <Text style={styles.actionButtonText}>🧭 Navigate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.success }]}
                    onPress={handleSave}
                >
                    <Text style={styles.actionButtonText}>❤️ Save</Text>
                </TouchableOpacity>
            </View>

            {/* Facilities */}
            {spot.facilities && spot.facilities.length > 0 && (
                <Card>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>🏢 Facilities</Text>
                    <View style={styles.facilitiesContainer}>
                        {spot.facilities.map((facility, index) => (
                            <View key={index} style={[styles.facilityTag, { backgroundColor: colors.backgroundSecondary }]}>
                                <Text style={styles.facilityEmoji}>{getFacilityEmoji(facility)}</Text>
                                <Text style={[styles.facilityText, { color: colors.text }]}>
                                    {facility.charAt(0).toUpperCase() + facility.slice(1)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Card>
            )}

            {/* Tips */}
            {spot.tips && (
                <Card>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>💡 Tips</Text>
                    <Text style={[styles.tipsText, { color: colors.text }]}>{spot.tips}</Text>
                </Card>
            )}

            {/* Accessibility */}
            {spot.accessibility_info && (
                <Card>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>♿ Accessibility</Text>
                    <Text style={[styles.accessibilityText, { color: colors.text }]}>{spot.accessibility_info}</Text>
                </Card>
            )}

            {/* Location Info */}
            <Card>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>📍 Location Details</Text>
                <View style={styles.locationDetails}>
                    <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>Coordinates:</Text>
                    <Text style={[styles.locationValue, { color: colors.text }]}>
                        {spot.latitude.toFixed(6)}, {spot.longitude.toFixed(6)}
                    </Text>
                </View>
                <View style={styles.locationDetails}>
                    <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>Added by:</Text>
                    <Text style={[styles.locationValue, { color: colors.text }]}>
                        {spot.created_by?.display_name || 'Unknown'}
                        {spot.created_by?.safety_rating ? ` (⭐ ${parseFloat(spot.created_by.safety_rating.toString()).toFixed(1)})` : ''}
                    </Text>
                </View>
                <View style={styles.locationDetails}>
                    <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>Added on:</Text>
                    <Text style={[styles.locationValue, { color: colors.text }]}>
                        {formatDate(spot.created_at)}
                    </Text>
                </View>
            </Card>

            {/* Reviews Section */}
            <Card>
                <View style={styles.reviewsHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        💬 Reviews ({spot.total_reviews || 0})
                    </Text>
                    <TouchableOpacity
                        style={[styles.addReviewButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.push({
                            pathname: '/review/add',
                            params: {
                                spotId: spot.id,
                                spotName: spot.name
                            }
                        })}
                    >
                        <Text style={styles.addReviewText}>+ Add Review</Text>
                    </TouchableOpacity>
                </View>

                {/* Transport Mode Selector */}
                {renderTransportModeSelector()}

                {/* Reviews List */}
                {isLoadingReviews ? (
                    <LoadingSpinner message="Loading reviews..." size="small" />
                ) : reviews.length > 0 ? (
                    <>
                        {reviews.slice(0, 5).map((review, index) => (
                            <View key={review.id} style={[
                                styles.reviewItem,
                                { borderBottomColor: colors.border },
                                index === reviews.length - 1 && { borderBottomWidth: 0 }
                            ]}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.reviewUserInfo}>
                                        <Text style={[styles.reviewUser, { color: colors.text }]}>
                                            {TRANSPORT_MODE_EMOJIS[review.transport_mode]} {review.user.display_name}
                                        </Text>
                                        {review.location_verified && (
                                            <Text style={[styles.verifiedLocation, { color: colors.success }]}>✓</Text>
                                        )}
                                    </View>
                                    <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
                                        {formatDate(review.created_at)}
                                    </Text>
                                </View>

                                <View style={styles.reviewRatings}>
                                    <Text style={[styles.reviewRating, { color: colors.success }]}>
                                        Safety: 🛡️ {review.safety_rating}
                                    </Text>
                                    <Text style={[styles.reviewRating, { color: colors.primary }]}>
                                        Effectiveness: ⚡ {review.effectiveness_rating}
                                    </Text>
                                </View>

                                {renderModeSpecificRating(review)}

                                {review.comment && (
                                    <Text style={[styles.reviewComment, { color: colors.text }]}>
                                        "{review.comment}"
                                    </Text>
                                )}
                            </View>
                        ))}

                        {reviews.length > 5 && (
                            <TouchableOpacity
                                style={[styles.showMoreButton, { backgroundColor: colors.backgroundSecondary }]}
                                onPress={() => Alert.alert('More Reviews', 'Full reviews screen coming soon!')}
                            >
                                <Text style={[styles.showMoreText, { color: colors.primary }]}>
                                    Show all {reviews.length} reviews
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <Text style={[styles.noReviews, { color: colors.textSecondary }]}>
                        {selectedTransportMode === 'all'
                            ? 'No reviews yet. Be the first to review this spot!'
                            : `No ${TRANSPORT_MODE_LABELS[selectedTransportMode as TransportMode]} reviews yet.`
                        }
                    </Text>
                )}
            </Card>
        </Screen>
    );
}

const styles = StyleSheet.create({
    // ... keep all your existing styles and add these new ones:

    transportModes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
    },
    transportModeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    transportModeEmoji: {
        fontSize: 12,
        marginRight: 4,
    },
    transportModeText: {
        fontSize: 11,
        fontWeight: '500',
    },
    transportModeSelector: {
        marginBottom: 16,
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    modeButtonEmoji: {
        fontSize: 14,
        marginRight: 4,
    },
    modeButtonText: {
        fontSize: 12,
        fontWeight: '500',
        marginRight: 4,
    },
    modeReviewCount: {
        fontSize: 10,
    },
    modeSpecificRatings: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginVertical: 4,
    },
    modeSpecificText: {
        fontSize: 11,
        fontWeight: '500',
    },
    reviewUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    verifiedLocation: {
        fontSize: 12,
        fontWeight: '600',
    },
    backButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },

    // ... keep all your other existing styles from the original file
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Layout.spacing.base,
        marginBottom: Layout.spacing.base,
    },
    backButton: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerActions: {
        flexDirection: 'row',
        gap: Layout.spacing.sm,
    },
    headerAction: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
    },
    headerActionText: {
        fontSize: 18,
    },
    photosCard: {
        padding: 0,
        marginBottom: Layout.spacing.base,
        overflow: 'hidden',
    },
    photo: {
        width: 300,
        height: 200,
        marginRight: 8,
    },
    photoIndicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: Layout.spacing.sm,
        gap: 6,
    },
    photoIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    titleSection: {
        marginBottom: Layout.spacing.base,
    },
    spotName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    verifiedBadge: {
        fontSize: 20,
    },
    spotType: {
        fontSize: 16,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    ratingsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Layout.spacing.base,
        paddingVertical: Layout.spacing.sm,
    },
    rating: {
        alignItems: 'center',
    },
    ratingLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    ratingValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: Layout.spacing.base,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: Layout.spacing.sm,
        marginBottom: Layout.spacing.base,
    },
    actionButton: {
        flex: 1,
        paddingVertical: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        alignItems: 'center',
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
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Layout.spacing.base,
    },
    facilitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Layout.spacing.xs,
    },
    facilityTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 4,
    },
    facilityEmoji: {
        fontSize: 14,
        marginRight: 6,
    },
    facilityText: {
        fontSize: 14,
        fontWeight: '500',
    },
    tipsText: {
        fontSize: 16,
        lineHeight: 24,
        fontStyle: 'italic',
    },
    accessibilityText: {
        fontSize: 16,
        lineHeight: 24,
    },
    locationDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    locationLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    locationValue: {
        fontSize: 14,
        fontWeight: '400',
        flex: 1,
        textAlign: 'right',
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.base,
    },
    addReviewButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    addReviewText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    reviewItem: {
        paddingVertical: Layout.spacing.base,
        borderBottomWidth: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    reviewUser: {
        fontSize: 14,
        fontWeight: '600',
    },
    reviewDate: {
        fontSize: 12,
    },
    reviewRatings: {
        flexDirection: 'row',
        gap: Layout.spacing.base,
        marginBottom: 8,
    },
    reviewRating: {
        fontSize: 12,
        fontWeight: '500',
    },
    reviewComment: {
        fontSize: 14,
        lineHeight: 20,
        fontStyle: 'italic',
    },
    showMoreButton: {
        alignItems: 'center',
        paddingVertical: Layout.spacing.sm,
        borderRadius: 6,
        marginTop: Layout.spacing.sm,
    },
    showMoreText: {
        fontSize: 14,
        fontWeight: '500',
    },
    noReviews: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        paddingVertical: Layout.spacing.lg,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        marginBottom: Layout.spacing.lg,
    },
    backButtonText: {
        fontWeight: "600",
        color: '#FFFFFF',
    }
});