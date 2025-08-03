// app/auth/signup.tsx - Create this new file
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function SignUpScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /\d/.test(password);
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(password)) {
            newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Sign up attempt:', {
                firstName,
                lastName,
                email,
                password,
            });
            
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } catch (error) {
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.backButtonText}>←</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Join HitchHub today</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.nameRow}>
                                <View style={[styles.inputContainer, styles.halfWidth]}>
                                    <Text style={styles.inputLabel}>First Name</Text>
                                    <TextInput
                                        style={[styles.input, errors.firstName && styles.inputError]}
                                        placeholder="First name"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        autoComplete="given-name"
                                        editable={!loading}
                                    />
                                    {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                                </View>

                                <View style={[styles.inputContainer, styles.halfWidth]}>
                                    <Text style={styles.inputLabel}>Last Name</Text>
                                    <TextInput
                                        style={[styles.input, errors.lastName && styles.inputError]}
                                        placeholder="Last name"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        autoComplete="family-name"
                                        editable={!loading}
                                    />
                                    {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput
                                    style={[styles.input, errors.email && styles.inputError]}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    editable={!loading}
                                />
                                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    style={[styles.input, errors.password && styles.inputError]}
                                    placeholder="Create a password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoComplete="new-password"
                                    editable={!loading}
                                />
                                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Confirm Password</Text>
                                <TextInput
                                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    autoComplete="new-password"
                                    editable={!loading}
                                />
                                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                            </View>

                            <TouchableOpacity 
                                style={[styles.signUpButton, loading && styles.signUpButtonDisabled]} 
                                onPress={handleSignUp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.signUpButtonText}>Create Account</Text>
                                )}
                            </TouchableOpacity>

                            <View style={styles.termsContainer}>
                                <Text style={styles.termsText}>
                                    By creating an account, you agree to our{' '}
                                    <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                                    <Text style={styles.termsLink}>Privacy Policy</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('./login')}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: 20,
        marginBottom: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 24,
        color: '#333333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
    },
    form: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        marginBottom: 20,
    },
    halfWidth: {
        width: '48%',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: '#F9F9F9',
    },
    inputError: {
        borderColor: '#FF6B6B',
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    signUpButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#4A90E2',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    signUpButtonDisabled: {
        backgroundColor: '#CCCCCC',
        shadowOpacity: 0,
        elevation: 0,
    },
    signUpButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    termsContainer: {
        marginBottom: 20,
    },
    termsText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
    },
    termsLink: {
        color: '#4A90E2',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
    },
    footerText: {
        fontSize: 16,
        color: '#666666',
    },
    loginLink: {
        fontSize: 16,
        color: '#4A90E2',
        fontWeight: '500',
    },
});