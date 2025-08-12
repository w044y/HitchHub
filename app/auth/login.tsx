// app/auth/login.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { sendMagicLink } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleSendMagicLink = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            await sendMagicLink(email.toLowerCase().trim());

            Alert.alert(
                'Magic Link Sent! ✨',
                'Check your email for the login link. It will expire in 15 minutes.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace({
                            pathname: "/auth/verify",
                            params: { email: email.toLowerCase().trim() }
                        })
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', `Failed to send magic link: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={styles.emoji}>🏕️</Text>
                <Text style={[styles.title, { color: colors.text }]}>Welcome to Vendro</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Enter your email to get started with sustainable travel
                </Text>

                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: colors.backgroundSecondary,
                            color: colors.text,
                            borderColor: colors.border
                        }]}
                        placeholder="Enter your email address"
                        placeholderTextColor={colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={handleSendMagicLink}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>✨ Send Magic Link</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
                    We'll send you a secure login link. No passwords required! 🔐
                </Text>
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
    disclaimer: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});