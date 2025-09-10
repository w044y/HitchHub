// app/trip/create-enhanced.tsx - Updated with required fields
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { apiClient } from '@/app/services/api';
import { TripPrivacyLevel } from '@/app/types/trip';

export default function CreateEnhancedTripScreen() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_address: '',
        end_address: '',
        intention_notes: '',
        privacy_level: TripPrivacyLevel.PRIVATE_DRAFT,
        travel_modes: ['hitchhiking'],
    });
    const [isLoading, setIsLoading] = useState(false);

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { user } = useAuth();

    const handleCreate = async () => {
        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to create a trip.');
            return;
        }

        // Validate required fields
        if (!formData.title.trim()) {
            Alert.alert('Error', 'Trip title is required');
            return;
        }

        if (!formData.start_address.trim()) {
            Alert.alert('Error', 'Start location is required');
            return;
        }

        if (!formData.end_address.trim()) {
            Alert.alert('Error', 'End location is required');
            return;
        }

        setIsLoading(true);
        try {
            // For now, use hardcoded coordinates
            // In production, you'd geocode the addresses
            const tripData = {
                ...formData,
                start_latitude: 52.5200, // Berlin coordinates
                start_longitude: 13.4050,
                end_latitude: 50.0755,   // Prague coordinates
                end_longitude: 14.4378,
                user_id: user.id,
            };

            console.log('🚀 Creating trip with data:', tripData);

            const result = await apiClient.createEnhancedTrip(tripData);

            Alert.alert(
                'Trip Created!',
                'Your enhanced trip has been created. Start planning your adventure!',
                [
                    {
                        text: 'Start Planning',
                        onPress: () => router.replace(`/trip/plan/${result.data.id}`)
                    }
                ]
            );
        } catch (error: any) {
            console.error('❌ Trip creation error:', error);
            Alert.alert('Error', `Failed to create trip: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Screen>
            <ScrollView style={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Create Your Travel Story
                </Text>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Trip Title *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text }]}
                        placeholder="e.g., Epic Journey Across Europe"
                        value={formData.title}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                    />
                </View>

                {/* ADD START ADDRESS INPUT */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Starting From *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text }]}
                        placeholder="e.g., Berlin, Germany"
                        value={formData.start_address}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, start_address: text }))}
                    />
                </View>

                {/* ADD END ADDRESS INPUT */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Going To *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text }]}
                        placeholder="e.g., Prague, Czech Republic"
                        value={formData.end_address}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, end_address: text }))}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Trip Description</Text>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text }]}
                        placeholder="Tell us about your journey..."
                        value={formData.description}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>What's Your Intention?</Text>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text }]}
                        placeholder="Why are you taking this trip? What do you hope to discover?"
                        value={formData.intention_notes}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, intention_notes: text }))}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Privacy Level</Text>
                    {Object.values(TripPrivacyLevel).map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[
                                styles.privacyOption,
                                {
                                    backgroundColor: formData.privacy_level === level ? colors.tint : colors.backgroundSecondary,
                                    borderColor: colors.border,
                                }
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, privacy_level: level }))}
                        >
                            <Text style={[
                                styles.privacyText,
                                {
                                    color: formData.privacy_level === level ? colors.background : colors.text
                                }
                            ]}>
                                {getPrivacyLevelLabel(level)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[
                        styles.createButton,
                        {
                            backgroundColor: (formData.title && formData.start_address && formData.end_address)
                                ? colors.tint
                                : colors.textSecondary,
                            opacity: (formData.title && formData.start_address && formData.end_address) ? 1 : 0.6
                        }
                    ]}
                    onPress={handleCreate}
                    disabled={isLoading || !formData.title || !formData.start_address || !formData.end_address}
                >
                    <Text style={[styles.createButtonText, { color: colors.background }]}>
                        {isLoading ? 'Creating...' : 'Create Trip'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </Screen>
    );
}

// Helper function for privacy level labels
function getPrivacyLevelLabel(level: TripPrivacyLevel): string {
    switch (level) {
        case TripPrivacyLevel.PRIVATE_DRAFT:
            return 'Private Draft - Just for me';
        case TripPrivacyLevel.SHARED_WITH_FRIENDS:
            return 'Friends Only - Share with selected people';
        case TripPrivacyLevel.COMMUNITY_PREVIEW:
            return 'Community Preview - Visible to followers';
        case TripPrivacyLevel.PUBLIC_BLUEPRINT:
            return 'Public Guide - Anyone can discover and fork';
        default:
            return "TEST";
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Layout.spacing.lg,
    },
    title: {
        ...Typography.heading.h1,
        marginBottom: Layout.spacing.xl,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: Layout.spacing.lg,
    },
    label: {
        ...Typography.body.medium,
        marginBottom: Layout.spacing.sm,
        fontWeight: '600',
    },
    input: {
        borderRadius: Layout.radius.base,
        padding: Layout.spacing.base,
        fontSize: Typography.sizes.base,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    textArea: {
        borderRadius: Layout.radius.base,
        padding: Layout.spacing.base,
        fontSize: Typography.sizes.base,
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    privacyOption: {
        padding: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        borderWidth: 1,
        marginBottom: Layout.spacing.sm,
    },
    privacyText: {
        ...Typography.body.medium,
        textAlign: 'center',
    },
    createButton: {
        padding: Layout.spacing.lg,
        borderRadius: Layout.radius.base,
        alignItems: 'center',
        marginTop: Layout.spacing.xl,
    },
    createButtonText: {
        ...Typography.button.primary,
        fontWeight: '600',
    },
});