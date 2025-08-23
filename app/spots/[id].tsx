// app/spots/[id].tsx - Complete spot details screen
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
    created_by: {
        id: string;
        display_name: string;
        username: string;
        safety_rating: number;
    };
    reviews: Array<{
        id: string;
        safety_rating: number;
        overall_rating: number;
        comment: string;
        created_at: string;
        user: {
            display_name: string;
        };
    }>;
    created_at: string;
}

export default function SpotDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [spot, setSpot] = useState<SpotDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);

    useEffect(() => {
        if (id) {
            fetchSpotDetails();
        }
    }, [id]);

    const fetchSpotDetails = async () => {
        try {
            // For now, use mock data since your API might not be fully set up
            // TODO: Replace with real API call when backend is ready
            // const response = await apiClient.getSpotById(id!);
            // setSpot(response.data);

            // Mock data for development
            const mockSpotDetail: SpotDetail = {
                id: id!,
                name: 'Highway A1 Rest Stop',
                description: 'Great visibility, friendly drivers, well-lit parking area with facilities. This is one of the best spots for hitchhiking in the Berlin area.',
                spot_type: 'rest_stop',
                latitude: 52.5250,
                longitude: 13.4100,
                safety_rating: 4.5,
                overall_rating: 4.3,
                is_verified: true,
                photo_urls: [
                    'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Rest+Stop+1',
                    'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Rest+Stop+2',
                ],
                facilities: ['restroom', 'food', 'parking', 'wifi'],
                tips: 'Best time is early morning (6-9 AM) when commuters are heading to work. Stand near the blue information sign for maximum visibility.',
                accessibility_info: 'Wheelchair accessible, paved walkways',
                created_by: {
                    id: 'user1',
                    display_name: 'Travel Mike',
                    username: 'travelmike',
                    safety_rating: 4.8,
                },
                reviews: [
                    {
                        id: 'review1',
                        safety_rating: 5,
                        overall_rating: 4,
                        comment: 'Excellent spot! Got a ride in 20 minutes. Very safe and well-lit.',
                        created_at: '2025-08-20T10:30:00Z',
                        user: { display_name: 'Sarah Explorer' }
                    },
                    {
                        id: 'review2',
                        safety_rating: 4,
                        overall_rating: 5,
                        comment: 'Perfect location with great facilities. Drivers are friendly here.',
                        created_at: '2025-08-19T15:45:00Z',
                        user: { display_name: 'Road Wanderer' }
                    }
                ],
                created_at: '2025-08-15T08:00:00Z'
            };

            setSpot(mockSpotDetail);
        } catch (error) {
            Alert.alert('Error', 'Could not load spot details');
            console.error('Spot fetch error:', error);
        } finally {
            setIsLoading(false);
        }
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
                message: `Check out this hitchhiking spot: ${spot.name}\n\n${spot.description}\n\nRating: ${spot.overall_rating}⭐ | Safety: ${spot.safety_rating}🛡️\n\nShared via Vendro`,
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
        // TODO: Implement report functionality
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
                        style={[ { backgroundColor: colors.primary }]}
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
            {spot.photo_urls.length > 0 && (
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
                </View>

                <View style={styles.ratingsRow}>
                    <View style={styles.rating}>
                        <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Overall</Text>
                        <Text style={[styles.ratingValue, { color: colors.primary }]}>
                            ⭐ {spot.overall_rating.toFixed(1)}
                        </Text>
                    </View>
                    <View style={styles.rating}>
                        <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Safety</Text>
                        <Text style={[styles.ratingValue, { color: colors.success }]}>
                            🛡️ {spot.safety_rating.toFixed(1)}
                        </Text>
                    </View>
                    <View style={styles.rating}>
                        <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Reviews</Text>
                        <Text style={[styles.ratingValue, { color: colors.textSecondary }]}>
                            💬 {spot.reviews.length}
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
            {spot.facilities.length > 0 && (
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
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>💡 Hitchhiking Tips</Text>
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
                        {spot.created_by.display_name} (⭐ {spot.created_by.safety_rating.toFixed(1)})
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
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>💬 Reviews ({spot.reviews.length})</Text>
                    <TouchableOpacity
                        style={[styles.addReviewButton, { backgroundColor: colors.primary }]}
                        onPress={() => Alert.alert('Add Review', 'Review feature coming soon!')}
                    >
                        <Text style={styles.addReviewText}>+ Add Review</Text>
                    </TouchableOpacity>
                </View>

                {spot.reviews.length > 0 ? (
                    <>
                        {spot.reviews.slice(0, 3).map((review, index) => (
                            <View key={review.id} style={[
                                styles.reviewItem,
                                { borderBottomColor: colors.border },
                                index === spot.reviews.length - 1 && { borderBottomWidth: 0 }
                            ]}>
                                <View style={styles.reviewHeader}>
                                    <Text style={[styles.reviewUser, { color: colors.text }]}>
                                        {review.user.display_name}
                                    </Text>
                                    <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
                                        {formatDate(review.created_at)}
                                    </Text>
                                </View>

                                <View style={styles.reviewRatings}>
                                    <Text style={[styles.reviewRating, { color: colors.primary }]}>
                                        Overall: ⭐ {review.overall_rating}
                                    </Text>
                                    <Text style={[styles.reviewRating, { color: colors.success }]}>
                                        Safety: 🛡️ {review.safety_rating}
                                    </Text>
                                </View>

                                {review.comment && (
                                    <Text style={[styles.reviewComment, { color: colors.text }]}>
                                        "{review.comment}"
                                    </Text>
                                )}
                            </View>
                        ))}

                        {spot.reviews.length > 3 && (
                            <TouchableOpacity
                                style={[styles.showMoreButton, { backgroundColor: colors.backgroundSecondary }]}
                                onPress={() => Alert.alert('More Reviews', 'Full reviews screen coming soon!')}
                            >
                                <Text style={[styles.showMoreText, { color: colors.primary }]}>
                                    Show all {spot.reviews.length} reviews
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <Text style={[styles.noReviews, { color: colors.textSecondary }]}>
                        No reviews yet. Be the first to review this spot!
                    </Text>
                )}
            </Card>
        </Screen>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: "600"
    }
});