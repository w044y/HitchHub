// app/welcome.tsx - Updated with terracotta theme
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        // Start animations when component mounts
        Animated.sequence([
            Animated.timing(logoScale, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Background gradient effect using overlays */}
            <View style={styles.backgroundLayer1} />
            <View style={styles.backgroundLayer2} />

            <View style={styles.content}>
                {/* Animated Logo */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        { transform: [{ scale: logoScale }] }
                    ]}
                >
                    <Text style={styles.logoEmoji}>🏕️</Text>
                    <Text style={styles.logoText}>HitchHub</Text>
                    <Text style={styles.tagline}>Your Adventure Starts Here</Text>
                </Animated.View>

                {/* Animated Main Content */}
                <Animated.View
                    style={[
                        styles.textContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Text style={styles.title}>
                        Hitchhike with{'\n'}Confidence & Community
                    </Text>
                    <Text style={styles.subtitle}>
                        Join thousands of adventurous travelers sharing rides, discovering amazing spots,
                        and exploring the world one journey at a time.
                    </Text>
                </Animated.View>

                {/* Animated Stats */}
                <Animated.View
                    style={[
                        styles.statsContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>50K+</Text>
                        <Text style={styles.statLabel}>Hitchhikers</Text>
                    </View>
                    <View style={styles.statSeparator} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>15K</Text>
                        <Text style={styles.statLabel}>Spots</Text>
                    </View>
                    <View style={styles.statSeparator} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>35</Text>
                        <Text style={styles.statLabel}>Countries</Text>
                    </View>
                </Animated.View>

                {/* Features */}
                <Animated.View
                    style={[
                        styles.featuresContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.featureRow}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🚗</Text>
                            <Text style={styles.featureText}>Find Rides</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>📍</Text>
                            <Text style={styles.featureText}>Best Spots</Text>
                        </View>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🛡️</Text>
                            <Text style={styles.featureText}>Stay Safe</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🗺️</Text>
                            <Text style={styles.featureText}>Explore</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Animated Buttons */}
                <Animated.View
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.push('/signup')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>🎒 Start Your Adventure</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { borderColor: colors.primary }]}
                        onPress={() => router.push('/(tabs)')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
                            👋 I Already Have an Account
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Legal text */}
                <Animated.View style={[styles.legalContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.legalText}>
                        By continuing, you agree to our Terms & Privacy Policy
                    </Text>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B8541F', // Deep terracotta base
    },
    backgroundLayer1: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        backgroundColor: '#D4622A', // Main terracotta
        opacity: 0.9,
    },
    backgroundLayer2: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#9C4415', // Darker terracotta
        opacity: 0.95,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 30,
        justifyContent: 'space-between',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    logoEmoji: {
        fontSize: 64,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#F4F1EC', // Warm off-white
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(244, 241, 236, 0.8)', // Warm off-white with opacity
        letterSpacing: 1,
        marginTop: 4,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F4F1EC', // Warm off-white
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 34,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(244, 241, 236, 0.9)', // Warm off-white with opacity
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(244, 241, 236, 0.15)', // Warm overlay
        borderRadius: 20,
        paddingVertical: 20,
        marginVertical: 20,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E67E22', // Sunset orange for highlights
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(244, 241, 236, 0.8)',
        textAlign: 'center',
    },
    statSeparator: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(244, 241, 236, 0.2)',
    },
    featuresContainer: {
        marginVertical: 20,
    },
    featureRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    featureItem: {
        alignItems: 'center',
        backgroundColor: 'rgba(244, 241, 236, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        width: width * 0.4,
    },
    featureIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    featureText: {
        fontSize: 12,
        color: '#F4F1EC',
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonContainer: {
        gap: 16,
        marginTop: 20,
    },
    primaryButton: {
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F4F1EC', // Warm off-white
    },
    secondaryButton: {
        borderWidth: 2,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: 'rgba(244, 241, 236, 0.05)', // Very subtle warm overlay
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    legalContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    legalText: {
        fontSize: 11,
        color: 'rgba(244, 241, 236, 0.6)',
        textAlign: 'center',
        lineHeight: 16,
    },
});