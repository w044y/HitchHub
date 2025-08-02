import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;

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
                    <Text style={styles.logoEmoji}>🌍</Text>
                    <Text style={styles.logoText}>EcoRide</Text>
                    <Text style={styles.tagline}>Sustainable Travel</Text>
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
                        Travel Sustainably,{'\n'}Connect Authentically
                    </Text>
                    <Text style={styles.subtitle}>
                        Join Europe's leading platform for eco-conscious travelers.
                        Share rides, discover hidden gems, and reduce your carbon footprint.
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
                        <Text style={styles.statNumber}>250K+</Text>
                        <Text style={styles.statLabel}>Travelers</Text>
                    </View>
                    <View style={styles.statSeparator} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>2.5M kg</Text>
                        <Text style={styles.statLabel}>CO₂ Saved</Text>
                    </View>
                    <View style={styles.statSeparator} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>15K+</Text>
                        <Text style={styles.statLabel}>Routes</Text>
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
                            <Text style={styles.featureText}>Share Rides</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>📍</Text>
                            <Text style={styles.featureText}>Find Spots</Text>
                        </View>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🛡️</Text>
                            <Text style={styles.featureText}>Stay Safe</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🌱</Text>
                            <Text style={styles.featureText}>Go Green</Text>
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
                        style={styles.primaryButton}
                        onPress={() => router.push('/signup')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>✨ Start Your Journey</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/login')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.secondaryButtonText}>👋 I Already Have an Account</Text>
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
        backgroundColor: '#1B5E20', // Dark green base
    },
    backgroundLayer1: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        backgroundColor: '#2E7D32', // Medium green
        opacity: 0.9,
    },
    backgroundLayer2: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#1B5E20', // Dark green
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
        color: 'white',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
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
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 34,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
        color: '#81D4FA', // Light blue
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    statSeparator: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonContainer: {
        gap: 16,
        marginTop: 20,
    },
    primaryButton: {
        backgroundColor: '#4CAF50',
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
        color: 'white',
    },
    secondaryButton: {
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 2,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    legalContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    legalText: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        lineHeight: 16,
    },
});