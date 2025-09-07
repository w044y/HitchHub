// app/index.tsx - ADD MORE DETAILED LOGGING
import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { useProfile } from '@/app/contexts/ProfileContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { router } from 'expo-router';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function Index() {
    const { isLoading: authLoading, isAuthenticated, user } = useAuth();
    const { profile, isLoading: profileLoading, error: profileError } = useProfile();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        // Add a small delay to prevent rapid redirects
        const timer = setTimeout(() => {
            console.log('🏠 Index: Navigation check...');
            console.log('🏠 Auth state:', { authLoading, isAuthenticated, userEmail: user?.email });
            console.log('🏠 Profile state:', { profileLoading, hasProfile: !!profile, onboardingCompleted: profile?.onboardingCompleted });
            console.log('🏠 Error state:', profileError);

            if (authLoading || profileLoading) {
                console.log('🏠 Still loading, waiting...');
                return;
            }

            if (!isAuthenticated || !user) {
                console.log('🏠 Not authenticated, going to login');
                router.replace('/auth/login');
                return;
            }

            if (profileError && profileError !== 'Profile load timeout') {
                console.log('🏠 Profile error, staying on index:', profileError);
                return;
            }

            if (!profile) {
                console.log('🏠 No profile found, going to onboarding');
                router.replace('/onboarding/travel-modes');
                return;
            }

            if (!profile.onboardingCompleted) {
                console.log('🏠 Onboarding not completed, going to onboarding');
                router.replace('/onboarding/travel-modes');
                return;
            }

            console.log('🏠 All conditions met, navigating to home');
            router.replace('/(tabs)/home');
        }, 200); // Small delay to ensure state is stable

        return () => clearTimeout(timer);
    }, [authLoading, profileLoading, isAuthenticated, user, profile, profileError]);

    // Debug button for manual navigation
    const forceNavigateToHome = () => {
        console.log('🔧 Force navigating to home');
        router.replace('/(tabs)/home');
    };

    // Show loading while auth or profile is loading
    if (authLoading || profileLoading) {
        return (
            <View style={styles.container}>
                <LoadingSpinner
                    message={authLoading ? "Authenticating..." : "Loading profile..."}
                    color={colors.primary}
                />
                {__DEV__ && (
                    <TouchableOpacity
                        style={styles.debugButton}
                        onPress={forceNavigateToHome}
                    >
                        <Text style={styles.debugText}>🔧 Force Navigate to Home</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    // Show error screen
    if (profileError && profileError !== 'Profile load timeout') {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorEmoji}>😕</Text>
                    <Text style={[styles.errorTitle, { color: colors.text }]}>
                        Something went wrong
                    </Text>
                    <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
                        {profileError}
                    </Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: colors.primary }]}
                        onPress={forceNavigateToHome}
                    >
                        <Text style={styles.retryButtonText}>Continue Anyway</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Default loading state with debug info
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LoadingSpinner
                message="Setting up your experience..."
                color={colors.primary}
            />

            {__DEV__ && (
                <View style={styles.debugContainer}>
                    <Text style={styles.debugInfo}>
                        Auth: {isAuthenticated ? 'YES' : 'NO'} | Profile: {profile ? 'YES' : 'NO'}
                    </Text>
                    <Text style={styles.debugInfo}>
                        Onboarding: {profile?.onboardingCompleted ? 'DONE' : 'PENDING'}
                    </Text>
                    <TouchableOpacity
                        style={styles.debugButton}
                        onPress={forceNavigateToHome}
                    >
                        <Text style={styles.debugText}>🔧 Force Navigate</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    errorEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    debugContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 8,
    },
    debugInfo: {
        color: '#fff',
        fontSize: 12,
        marginBottom: 4,
    },
    debugButton: {
        backgroundColor: '#FF6B35',
        padding: 12,
        borderRadius: 6,
        marginTop: 8,
        alignItems: 'center',
    },
    debugText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});