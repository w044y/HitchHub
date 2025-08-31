// components/profile/TrustVerificationCard.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { useProfile } from '@/app/contexts/ProfileContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export const TrustVerificationCard: React.FC = () => {
    const {
        profile,
        requestEmailVerification,
        requestPhoneVerification,
        verifySocialAccount
    } = useProfile();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleEmailVerification = async () => {
        if (profile?.emailVerified) return;

        setIsLoading('email');
        try {
            await requestEmailVerification();
            Alert.alert('Email Sent', 'Check your email for verification instructions');
        } catch (error) {
            Alert.alert('Error', 'Failed to send verification email');
        } finally {
            setIsLoading(null);
        }
    };

    const handlePhoneVerification = async () => {
        if (profile?.phoneVerified) return;

        Alert.prompt(
            'Phone Verification',
            'Enter your phone number:',
            async (phoneNumber) => {
                if (!phoneNumber) return;

                setIsLoading('phone');
                try {
                    await requestPhoneVerification(phoneNumber);
                    Alert.alert('Code Sent', 'Check your phone for verification code');
                } catch (error) {
                    Alert.alert('Error', 'Failed to send verification code');
                } finally {
                    setIsLoading(null);
                }
            }
        );
    };

    const handleSocialVerification = async (platform: 'facebook' | 'google') => {
        if (profile?.socialConnected) return;

        setIsLoading(platform);
        try {
            // In a real app, you'd integrate with the social platform's SDK
            const mockAccessToken = 'mock_access_token';
            await verifySocialAccount(platform, mockAccessToken);
            Alert.alert('Success', `${platform} account verified!`);
        } catch (error) {
            Alert.alert('Error', `Failed to verify ${platform} account`);
        } finally {
            setIsLoading(null);
        }
    };

    if (!profile) return null;

    return (
        <Card>
            <Text style={[styles.title, { color: colors.text }]}>
                Trust Verification
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Increase your trust score: {profile.trustScore}/100
            </Text>

            <View style={styles.verificationList}>
                {/* Email Verification */}
                <TouchableOpacity
                    style={[
                        styles.verificationItem,
                        { backgroundColor: colors.backgroundSecondary }
                    ]}
                    onPress={handleEmailVerification}
                    disabled={profile.emailVerified || isLoading === 'email'}
                >
                    <Text style={styles.verificationEmoji}>
                        {profile.emailVerified ? '✅' : '📧'}
                    </Text>
                    <View style={styles.verificationInfo}>
                        <Text style={[styles.verificationTitle, { color: colors.text }]}>
                            Email Verification
                        </Text>
                        <Text style={[styles.verificationStatus, { color: colors.textSecondary }]}>
                            {profile.emailVerified
                                ? 'Verified'
                                : isLoading === 'email'
                                    ? 'Sending...'
                                    : '+15 trust points'
                            }
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Phone Verification */}
                <TouchableOpacity
                    style={[
                        styles.verificationItem,
                        { backgroundColor: colors.backgroundSecondary }
                    ]}
                    onPress={handlePhoneVerification}
                    disabled={profile.phoneVerified || isLoading === 'phone'}
                >
                    <Text style={styles.verificationEmoji}>
                        {profile.phoneVerified ? '✅' : '📱'}
                    </Text>
                    <View style={styles.verificationInfo}>
                        <Text style={[styles.verificationTitle, { color: colors.text }]}>
                            Phone Verification
                        </Text>
                        <Text style={[styles.verificationStatus, { color: colors.textSecondary }]}>
                            {profile.phoneVerified
                                ? 'Verified'
                                : isLoading === 'phone'
                                    ? 'Sending...'
                                    : '+15 trust points'
                            }
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Social Verification */}
                <TouchableOpacity
                    style={[
                        styles.verificationItem,
                        { backgroundColor: colors.backgroundSecondary }
                    ]}
                    onPress={() => handleSocialVerification('google')}
                    disabled={profile.socialConnected || isLoading === 'google'}
                >
                    <Text style={styles.verificationEmoji}>
                        {profile.socialConnected ? '✅' : '🔗'}
                    </Text>
                    <View style={styles.verificationInfo}>
                        <Text style={[styles.verificationTitle, { color: colors.text }]}>
                            Social Account
                        </Text>
                        <Text style={[styles.verificationStatus, { color: colors.textSecondary }]}>
                            {profile.socialConnected
                                ? 'Connected'
                                : isLoading === 'google'
                                    ? 'Connecting...'
                                    : '+10 trust points'
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    verificationList: {
        gap: 12,
    },
    verificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
    },
    verificationEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    verificationInfo: {
        flex: 1,
    },
    verificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    verificationStatus: {
        fontSize: 14,
    },
});