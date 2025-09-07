// app/(auth)/login.tsx - CLEAN LOGIN SCREEN
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useAuth } from '@/app/contexts/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
    const { sendMagicLink, verifyMagicLink, isLoading, loginAsDev } = useAuth();
    const [email, setEmail] = useState(__DEV__ ? 'dev@vendro.app' : '');
    const [token, setToken] = useState('');
    const [step, setStep] = useState<'email' | 'token'>('email');

    const handleSendMagicLink = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        try {
            await sendMagicLink(email.trim());
            setStep('token');
        } catch (error) {
            // Error already handled in context
        }
    };

    const handleVerifyToken = async () => {
        if (!token.trim()) {
            Alert.alert('Error', 'Please enter the token from your email');
            return;
        }

        try {
            await verifyMagicLink(token.trim(), email.trim());
            router.replace('../(tabs)');
        } catch (error) {
            // Error already handled in context
        }
    };

    const handleDevLogin = async () => {
        if (!__DEV__ || !loginAsDev) return;

        try {
            await loginAsDev();
            router.replace('../(tabs)');
        } catch (error) {
            // Error already handled in context
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to HitchHub</Text>
                <Text style={styles.subtitle}>
                    {step === 'email'
                        ? 'Enter your email to get started'
                        : 'Enter the token from your email'
                    }
                </Text>

                {step === 'email' ? (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Email address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleSendMagicLink}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? 'Sending...' : 'Send Magic Link'}
                            </Text>
                        </TouchableOpacity>

                        {__DEV__ && (
                            <TouchableOpacity
                                style={[styles.button, styles.devButton]}
                                onPress={handleDevLogin}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>
                                    🔧 Dev Login
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter token from email"
                            value={token}
                            onChangeText={setToken}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleVerifyToken}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? 'Verifying...' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setStep('email')}
                        >
                            <Text style={styles.backButtonText}>
                                ← Back to email
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 32,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    devButton: {
        backgroundColor: '#FF6B35',
        marginTop: 8,
    },
    backButton: {
        padding: 16,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});