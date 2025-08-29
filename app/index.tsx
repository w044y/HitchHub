// app/index.tsx - Better error handling and routing logic
import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { useProfile } from '@/app/contexts/ProfileContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { router } from 'expo-router';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Layout } from '@/constants/Layout';

export default function Index() {
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const { profile, isLoading: profileLoading, error: profileError, retryLoading } = useProfile();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        console.log('🏠 Index: Auth loading:', authLoading, 'Auth:', isAuthenticated);
        console.log('🏠 Index: Profile loading:', profileLoading, 'Profile:', !!profile, 'Error:', profileError);

        // Only proceed if both auth and profile are done loading
        if (authLoading || profileLoading) {
            console.log('🏠 Index: Still loading, waiting...');
            return;
        }

        if (!isAuthenticated) {
            console.log('🏠 Index: Not authenticated, redirecting to login');
            router.replace('/auth/login');
            return;
        }

        // User is authenticated, check profile
        if (profileError) {
            console.log('🏠 Index: Profile error, staying on index for retry');
            return; // Stay on this screen to show error
        }

        if (!profile || !profile.onboardingCompleted) {
            console.log('🏠 Index: No profile or incomplete onboarding, redirecting to onboarding');
            router.replace('/onboarding/travel-modes');
            return;
        }

        console.log('🏠 Index: Everything ready, redirecting to home');
        router.replace('/(tabs)/home');

    }, [authLoading, profileLoading, isAuthenticated, profile, profileError]);

    // Show loading screen
    if (authLoading) {
        return (
            <LoadingSpinner
                message="Authenticating..."
                color={colors.primary}
            />
        );
    }

    if (profileLoading) {
        return (
            <LoadingSpinner
                message="Loading your travel profile..."
                color={colors.primary}
            />
        );
    }

    // Show error screen if profile failed to load
    if (profileError) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorEmoji]}>😕</Text>
                    <Text style={[styles.errorTitle, { color: colors.text }]}>
                        Couldn't Load Profile
                    </Text>
                    <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
                        {profileError}
                    </Text>

                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: colors.primary }]}
                        onPress={retryLoading}
                    >
                        <Text style={styles.retryButtonText}>🔄 Try Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.skipButton]}
                        onPress={() => router.replace('/(tabs)/home')}
                    >
                        <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                            Skip and continue anyway
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Fallback loading state
    return (
        <LoadingSpinner
            message="Setting up your experience..."
            color={colors.primary}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Layout.spacing.xl,
    },
    errorEmoji: {
        fontSize: 64,
        marginBottom: Layout.spacing.lg,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: Layout.spacing.base,
    },
    errorMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: Layout.spacing.xl,
        lineHeight: 24,
    },
    retryButton: {
        paddingHorizontal: Layout.spacing.xl,
        paddingVertical: Layout.spacing.base,
        borderRadius: Layout.radius.base,
        marginBottom: Layout.spacing.base,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    skipButton: {
        paddingVertical: Layout.spacing.sm,
    },
    skipButtonText: {
        fontSize: 14,
        textAlign: 'center',
    },
});