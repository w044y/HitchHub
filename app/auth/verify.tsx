// app/auth/verify.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../contexts/AuthContext'; // Fixed path
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

export default function VerifyScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { verifyMagicLink, sendMagicLink } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleVerifyToken = async () => {
        if (!token.trim()) {
            Alert.alert('Error', 'Please enter the verification token from your email');
            return;
        }

        if (!email) {
            Alert.alert('Error', 'Email not found. Please go back and try again.');
            return;
        }

        setIsLoading(true);
        try {
            await verifyMagicLink(token.trim(), email);

            Alert.alert(
                'Welcome! 🎉',
                'You have been successfully logged in.',
                [
                    {
                        text: 'Get Started',
                        onPress: () => router.replace("/(tabs)/home") // Fixed path
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', `Verification failed: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendLink = async () => {
        if (!email) return;

        try {
            await sendMagicLink(email);
            Alert.alert('Sent!', 'A new magic link has been sent to your email.');
        } catch (error) {
            Alert.alert('Error', `Failed to resend: ${error}`);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={styles.emoji}>📧</Text>
                <Text style={[styles.title, { color: colors.text }]}>Check Your Email</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    We sent a magic link to{'\n'}
                    <Text style={{ fontWeight: '600' }}>{email}</Text>
                </Text>

                <View style={styles.form}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Enter the token from your email:
                    </Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: colors.backgroundSecondary,
                            color: colors.text,
                            borderColor: colors.border
                        }]}
                        placeholder="e.g. abc123def456..."
                        placeholderTextColor={colors.textSecondary}
                        value={token}
                        onChangeText={setToken}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                        multiline={false}
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={handleVerifyToken}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>🚀 Login to HitchHub</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleResendLink} style={styles.resendButton}>
                    <Text style={[styles.resendText, { color: colors.primary }]}>
                        Didn't receive the email? Resend link
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={[styles.backText, { color: colors.textSecondary }]}>
                        ← Back to login
                    </Text>
                </TouchableOpacity>

                {/* Debug info */}
                {__DEV__ && (
                    <View style={styles.debugContainer}>
                        <Text style={[styles.debugText, { color: colors.textSecondary }]}>
                            Debug: Email = {email}
                        </Text>
                        <Text style={[styles.debugText, { color: colors.textSecondary }]}>
                            Check console for magic link token
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emoji: {
        fontSize: 64,
        textAlign: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 24,
    },
    form: {
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    resendButton: {
        padding: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    resendText: {
        fontSize: 16,
        fontWeight: '500',
    },
    backButton: {
        padding: 12,
        alignItems: 'center',
    },
    backText: {
        fontSize: 14,
    },
    debugContainer: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    debugText: {
        fontSize: 12,
        textAlign: 'center',
    },
});