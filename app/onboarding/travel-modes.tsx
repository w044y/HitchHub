// app/onboarding/travel-modes.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';
import { useProfile } from '@/app/contexts/ProfileContext';
import { TransportMode, TRANSPORT_MODE_LABELS, TRANSPORT_MODE_EMOJIS } from '@/app/types/transport';

const TRAVEL_MODE_OPTIONS = [
    {
        mode: TransportMode.HITCHHIKING,
        title: 'Hitchhiking',
        emoji: TRANSPORT_MODE_EMOJIS[TransportMode.HITCHHIKING],
        description: 'Get rides from friendly drivers',
        benefits: ['Find safe pickup spots', 'Connect with drivers', 'Track your journey']
    },
    {
        mode: TransportMode.CYCLING,
        title: 'Cycling',
        emoji: TRANSPORT_MODE_EMOJIS[TransportMode.CYCLING],
        description: 'Explore on two wheels',
        benefits: ['Bike-friendly routes', 'Safe parking spots', 'Repair stations']
    },
    {
        mode: TransportMode.VAN_LIFE,
        title: 'Van Life',
        emoji: TRANSPORT_MODE_EMOJIS[TransportMode.VAN_LIFE],
        description: 'Travel & live in your van',
        benefits: ['Legal parking spots', 'Dump stations', 'Van-friendly routes']
    },
    {
        mode: TransportMode.WALKING,
        title: 'Walking',
        emoji: TRANSPORT_MODE_EMOJIS[TransportMode.WALKING],
        description: 'Discover places on foot',
        benefits: ['Walking trails', 'Rest areas', 'City connections']
    }
];

export default function TravelModesOnboarding() {
    const [selectedModes, setSelectedModes] = useState<Set<TransportMode>>(new Set());
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { updateProfile } = useProfile();

    const toggleMode = (mode: TransportMode) => {
        setSelectedModes(prev => {
            const newModes = new Set(prev);
            if (newModes.has(mode)) {
                newModes.delete(mode);
            } else {
                newModes.add(mode);
            }
            return newModes;
        });
    };

    const handleContinue = async () => {
        if (selectedModes.size === 0) {
            Alert.alert('Select Travel Style', 'Please select at least one way you like to travel.');
            return;
        }

        try {
            // Update user profile with selected modes
            await updateProfile({
                travelModes: Array.from(selectedModes),
                preferences: {
                    primaryMode: Array.from(selectedModes)[0], // First selected becomes primary
                    showAllSpots: false, // Start with filtered view
                    experienceLevel: 'beginner',
                    safetyPriority: 'high'
                },
                onboardingCompleted: true
            });

            // Navigate to main app
            router.replace('/(tabs)/home');
        } catch (error) {
            Alert.alert('Error', 'Could not save preferences. Please try again.');
        }
    };

    return (
        <Screen scrollable>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🎒</Text>
                <Text style={[styles.title, { color: colors.text }]}>
                    How do you like to travel?
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Select your preferred ways to explore the world. You can change this later.
                </Text>
            </View>

            {/* Mode Selection */}
            <View style={styles.modesContainer}>
                {TRAVEL_MODE_OPTIONS.map((option) => {
                    const isSelected = selectedModes.has(option.mode);

                    return (
                        <TouchableOpacity
                            key={option.mode}
                            style={[
                                styles.modeCard,
                                {
                                    backgroundColor: colors.backgroundSecondary,
                                    borderColor: isSelected ? colors.primary : colors.border
                                },
                                isSelected && [styles.selectedModeCard, {
                                    backgroundColor: `${colors.primary}10`,
                                    borderWidth: 2
                                }]
                            ]}
                            onPress={() => toggleMode(option.mode)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.modeHeader}>
                                <Text style={styles.modeEmoji}>{option.emoji}</Text>
                                <View style={styles.modeInfo}>
                                    <Text style={[styles.modeTitle, { color: colors.text }]}>
                                        {option.title}
                                    </Text>
                                    <Text style={[styles.modeDescription, { color: colors.textSecondary }]}>
                                        {option.description}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.checkbox,
                                    { borderColor: colors.border },
                                    isSelected && {
                                        backgroundColor: colors.primary,
                                        borderColor: colors.primary
                                    }
                                ]}>
                                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                            </View>

                            <View style={styles.benefits}>
                                {option.benefits.map((benefit, index) => (
                                    <Text key={index} style={[styles.benefit, { color: colors.textSecondary }]}>
                                        • {benefit}
                                    </Text>
                                ))}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
                style={[
                    styles.continueButton,
                    {
                        backgroundColor: selectedModes.size > 0 ? colors.primary : colors.textSecondary,
                        opacity: selectedModes.size > 0 ? 1 : 0.5
                    }
                ]}
                onPress={handleContinue}
                disabled={selectedModes.size === 0}
            >
                <Text style={styles.continueButtonText}>
                    Continue with {selectedModes.size} travel {selectedModes.size === 1 ? 'style' : 'styles'}
                </Text>
            </TouchableOpacity>

            {/* Skip Option */}
            <TouchableOpacity
                style={styles.skipButton}
                onPress={() => router.replace('/(tabs)/home')}
            >
                <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                    Skip for now
                </Text>
            </TouchableOpacity>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        paddingVertical: Layout.spacing['2xl'],
        marginBottom: Layout.spacing.lg,
    },
    headerEmoji: {
        fontSize: 64,
        marginBottom: Layout.spacing.base,
    },
    title: {
        fontSize: Typography.sizes['2xl'],
        fontFamily: Typography.fonts.bold,
        textAlign: 'center',
        marginBottom: Layout.spacing.sm,
    },
    subtitle: {
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.regular,
        textAlign: 'center',
        lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
        paddingHorizontal: Layout.spacing.lg,
    },
    modesContainer: {
        gap: Layout.spacing.base,
        marginBottom: Layout.spacing.xl,
    },
    modeCard: {
        borderRadius: Layout.radius.lg,
        padding: Layout.spacing.lg,
        borderWidth: 1,
    },
    selectedModeCard: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    modeHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Layout.spacing.base,
    },
    modeEmoji: {
        fontSize: 32,
        marginRight: Layout.spacing.base,
    },
    modeInfo: {
        flex: 1,
    },
    modeTitle: {
        fontSize: Typography.sizes.lg,
        fontFamily: Typography.fonts.semiBold,
        marginBottom: 4,
    },
    modeDescription: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.regular,
        lineHeight: Typography.lineHeights.normal * Typography.sizes.sm,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    benefits: {
        paddingLeft: Layout.spacing['2xl'] + Layout.spacing.base,
        gap: 4,
    },
    benefit: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.regular,
        lineHeight: Typography.lineHeights.normal * Typography.sizes.xs,
    },
    continueButton: {
        paddingVertical: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        alignItems: 'center',
        marginBottom: Layout.spacing.base,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.semiBold,
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: Layout.spacing.sm,
    },
    skipButtonText: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.medium,
    },
});