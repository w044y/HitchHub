import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import {
    Text,
    ActivityIndicator,
    useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing, sustainableColors } from '@/theme/theme';

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
    const theme = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous rotation for the earth emoji
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[sustainableColors.primary, sustainableColors.primaryDark]}
                style={styles.gradient}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Animated Logo */}
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                transform: [{ rotate: spin }],
                            },
                        ]}
                    >
                        <Text style={styles.logoEmoji}>🌍</Text>
                    </Animated.View>

                    {/* App Name */}
                    <Text style={styles.appName}>EcoRide</Text>
                    <Text style={styles.tagline}>Sustainable Travel</Text>

                    {/* Loading Indicator */}
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color="white"
                            style={styles.spinner}
                        />
                        <Text style={styles.loadingText}>
                            Connecting travelers...
                        </Text>
                    </View>

                    {/* Environmental Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>2.5M kg</Text>
                            <Text style={styles.statLabel}>CO₂ Saved</Text>
                        </View>
                        <View style={styles.statSeparator} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>250K+</Text>
                            <Text style={styles.statLabel}>Travelers</Text>
                        </View>
                        <View style={styles.statSeparator} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>15K+</Text>
                            <Text style={styles.statLabel}>Routes</Text>
                        </View>
                    </View>
                </Animated.View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: width * 0.8,
    },
    logoContainer: {
        marginBottom: spacing.xl,
    },
    logoEmoji: {
        fontSize: 80,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: spacing.sm,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: spacing.xxxl,
        letterSpacing: 0.5,
    },
    loadingContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxxl,
    },
    spinner: {
        marginBottom: spacing.md,
    },
    loadingText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        width: '100%',
        justifyContent: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: sustainableColors.accentLight,
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
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: spacing.md,
    },
});