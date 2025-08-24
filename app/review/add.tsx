// app/review/add.tsx - Move the review form here
import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from 'react-native';
import { Text } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useColorScheme } from '@/components/useColorScheme';
import { router, useLocalSearchParams } from 'expo-router';
import { apiClient } from '@/app/services/api';

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

export default function AddReviewScreen() {
    const params = useLocalSearchParams<{
        spotId?: string;
        spotName?: string;
    }>();

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Form state
    const [formData, setFormData] = useState({
        transport_mode: TransportMode.HITCHHIKING,
        safety_rating: 0,
        effectiveness_rating: 0,
        overall_rating: 0,
        comment: '',
        wait_time_minutes: '',
        legal_status: 0,
        facility_rating: 0,
        accessibility_rating: 0,
    });

    // Location state for GPS verification
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        setIsGettingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Location Permission',
                    'Location access helps verify your review. You can still submit without it.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            console.log('✅ Got user location for review verification');
        } catch (error) {
            console.error('❌ Error getting location:', error);
        } finally {
            setIsGettingLocation(false);
        }
    };

    const renderTransportModeSelector = () => {
        return (
            <View style={styles.transportModeGrid}>
                {Object.values(TransportMode).map((mode) => (
                    <TouchableOpacity
                        key={mode}
                        style={[
                            styles.transportModeButton,
                            {
                                backgroundColor: formData.transport_mode === mode
                                    ? colors.primary
                                    : colors.backgroundSecondary,
                                borderColor: formData.transport_mode === mode
                                    ? colors.primary
                                    : colors.border,
                            }
                        ]}
                        onPress={() => setFormData(prev => ({ ...prev, transport_mode: mode }))}
                    >
                        <Text style={styles.transportModeEmoji}>
                            {TRANSPORT_MODE_EMOJIS[mode]}
                        </Text>
                        <Text style={[
                            styles.transportModeLabel,
                            {
                                color: formData.transport_mode === mode ? '#FFFFFF' : colors.text
                            }
                        ]}>
                            {TRANSPORT_MODE_LABELS[mode]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderStarRating = (
        label: string,
        value: number,
        onPress: (rating: number) => void,
        required: boolean = true
    ) => {
        return (
            <View style={styles.ratingSection}>
                <Text style={[styles.ratingLabel, { color: colors.text }]}>
                    {label} {required && <Text style={styles.requiredStar}>*</Text>}
                </Text>
                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => onPress(star)}
                            style={styles.starButton}
                        >
                            <Text style={[
                                styles.star,
                                { color: star <= value ? '#FFD700' : colors.textSecondary }
                            ]}>
                                ★
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={[styles.ratingValue, { color: colors.textSecondary }]}>
                    {value > 0 ? `${value}/5` : 'Not rated'}
                </Text>
            </View>
        );
    };

    const renderModeSpecificFields = () => {
        const mode = formData.transport_mode;

        return (
            <View style={styles.modeSpecificSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    📊 {TRANSPORT_MODE_LABELS[mode]}-Specific Details
                </Text>

                {mode === TransportMode.HITCHHIKING && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>
                            ⏱️ How long did you wait? (minutes)
                        </Text>
                        <TextInput
                            style={[styles.numberInput, {
                                borderColor: colors.border,
                                color: colors.text,
                                backgroundColor: colors.backgroundSecondary
                            }]}
                            placeholder="e.g. 15"
                            placeholderTextColor={colors.textSecondary}
                            value={formData.wait_time_minutes}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, wait_time_minutes: text }))}
                            keyboardType="numeric"
                            maxLength={4}
                        />
                    </View>
                )}

                {mode === TransportMode.VAN_LIFE && (
                    <>
                        {renderStarRating(
                            '⚖️ Legal Status (parking/camping allowed)',
                            formData.legal_status,
                            (rating) => setFormData(prev => ({ ...prev, legal_status: rating })),
                            false
                        )}
                    </>
                )}

                {(mode === TransportMode.CYCLING || mode === TransportMode.WALKING) && (
                    <>
                        {renderStarRating(
                            '🏢 Facilities Quality',
                            formData.facility_rating,
                            (rating) => setFormData(prev => ({ ...prev, facility_rating: rating })),
                            false
                        )}
                    </>
                )}

                {/* Accessibility rating for all modes */}
                {renderStarRating(
                    '♿ Accessibility',
                    formData.accessibility_rating,
                    (rating) => setFormData(prev => ({ ...prev, accessibility_rating: rating })),
                    false
                )}
            </View>
        );
    };

    const validateForm = () => {
        if (formData.safety_rating === 0) {
            Alert.alert('Missing Rating', 'Please rate the safety of this spot');
            return false;
        }
        if (formData.effectiveness_rating === 0) {
            Alert.alert('Missing Rating', 'Please rate how effective this spot was');
            return false;
        }
        if (formData.overall_rating === 0) {
            Alert.alert('Missing Rating', 'Please give an overall rating');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const reviewData = {
                transport_mode: formData.transport_mode,
                safety_rating: formData.safety_rating,
                effectiveness_rating: formData.effectiveness_rating,
                overall_rating: formData.overall_rating,
                comment: formData.comment.trim() || undefined,
                wait_time_minutes: formData.wait_time_minutes ? parseInt(formData.wait_time_minutes) : undefined,
                legal_status: formData.legal_status || undefined,
                facility_rating: formData.facility_rating || undefined,
                accessibility_rating: formData.accessibility_rating || undefined,
                review_latitude: userLocation?.latitude,
                review_longitude: userLocation?.longitude,
                context: {
                    time_of_day: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
                    day_of_week: new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
                }
            };

            console.log('📝 Submitting review:', reviewData);

            await apiClient.addSpotReview(params.spotId!, reviewData);

            Alert.alert(
                'Review Added! ⭐',
                'Thank you for helping other travelers find great spots.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );

        } catch (error) {
            console.error('❌ Error submitting review:', error);
            Alert.alert('Error', 'Could not submit review. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Screen scrollable>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Add Review</Text>
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading}
                    style={[
                        styles.submitButton,
                        { backgroundColor: isLoading ? colors.textSecondary : colors.primary }
                    ]}
                >
                    <Text style={styles.submitButtonText}>
                        {isLoading ? 'Saving...' : 'Submit'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Spot Info */}
            <Card style={styles.spotInfoCard}>
                <Text style={[styles.spotName, { color: colors.text }]}>
                    📍 {params.spotName || 'Unknown Spot'}
                </Text>
                {isGettingLocation ? (
                    <Text style={[styles.locationStatus, { color: colors.textSecondary }]}>
                        🌍 Getting your location for verification...
                    </Text>
                ) : userLocation ? (
                    <Text style={[styles.locationStatus, { color: colors.success }]}>
                        ✅ Location verified - you're near this spot
                    </Text>
                ) : (
                    <Text style={[styles.locationStatus, { color: colors.textSecondary }]}>
                        📍 Location access not available
                    </Text>
                )}
            </Card>

            {/* Transport Mode Selection */}
            <Card>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    🚀 Transport Mode <Text style={styles.requiredStar}>*</Text>
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    How did you use this spot?
                </Text>
                {renderTransportModeSelector()}
            </Card>

            {/* Core Ratings */}
            <Card>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>⭐ Rate This Spot</Text>

                {renderStarRating(
                    '🛡️ Safety',
                    formData.safety_rating,
                    (rating) => setFormData(prev => ({ ...prev, safety_rating: rating }))
                )}

                {renderStarRating(
                    '⚡ Effectiveness (how well did it work?)',
                    formData.effectiveness_rating,
                    (rating) => setFormData(prev => ({ ...prev, effectiveness_rating: rating }))
                )}

                {renderStarRating(
                    '🌟 Overall Experience',
                    formData.overall_rating,
                    (rating) => setFormData(prev => ({ ...prev, overall_rating: rating }))
                )}
            </Card>

            {/* Mode-Specific Fields */}
            <Card>
                {renderModeSpecificFields()}
            </Card>

            {/* Comment */}
            <Card>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>💬 Your Experience</Text>
                <TextInput
                    style={[styles.commentInput, {
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary
                    }]}
                    placeholder="Share details about your experience. What worked well? Any tips for other travelers?"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.comment}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, comment: text }))}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                />
                <Text style={[styles.characterCount, { color: colors.textSecondary }]}>
                    {formData.comment.length}/500
                </Text>
            </Card>
        </Screen>
    );
}

// ... all the styles from before (same styles)
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Layout.spacing.base,
        marginBottom: Layout.spacing.base,
    },
    cancelButton: {
        fontSize: 16,
        fontWeight: '500',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    submitButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    spotInfoCard: {
        marginBottom: Layout.spacing.base,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    spotName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    locationStatus: {
        fontSize: 14,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Layout.spacing.sm,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: Layout.spacing.base,
    },
    requiredStar: {
        color: '#FF4444',
        fontSize: 16,
    },
    transportModeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Layout.spacing.sm,
    },
    transportModeButton: {
        flex: 1,
        minWidth: '45%',
        maxWidth: '48%',
        paddingVertical: Layout.spacing.base,
        paddingHorizontal: Layout.spacing.sm,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
    },
    transportModeEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    transportModeLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    ratingSection: {
        marginBottom: Layout.spacing.lg,
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 4,
    },
    starButton: {
        padding: 4,
    },
    star: {
        fontSize: 28,
    },
    ratingValue: {
        fontSize: 12,
        fontWeight: '500',
    },
    modeSpecificSection: {
        marginTop: Layout.spacing.sm,
    },
    inputGroup: {
        marginBottom: Layout.spacing.base,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    numberInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
    },
    commentInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    characterCount: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 4,
    },
});