// app/contexts/AuthContext.tsx - FIXED VERSION
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/app/services/api';
import { Alert } from 'react-native';

interface User {
    id: string;
    email: string;
    username?: string;
    display_name?: string;
    profile_photo_url?: string;
    vendro_points: number;
    safety_rating: number;
    is_verified: boolean;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    sendMagicLink: (email: string) => Promise<void>;
    verifyMagicLink: (token: string, email: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    loginAsDev: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        setIsLoading(true);

        try {
            // ALWAYS try to restore from token first, even in development
            const result = await apiClient.getCurrentUser();
            setUser(result.data);
            console.log('✅ User restored from stored token:', result.data.email);
        } catch (error: any) {
            console.log('🔄 No valid token found, user needs to authenticate');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMagicLink = async (email: string) => {
        try {
            setIsLoading(true);
            await apiClient.sendMagicLink(email);
            Alert.alert('Magic Link Sent', 'Check your email');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send magic link');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyMagicLink = async (token: string, email: string) => {
        try {
            setIsLoading(true);
            const result = await apiClient.verifyMagicLink(token, email);
            setUser(result.data.user);
            console.log('✅ User authenticated successfully:', result.data.user.email);
        } catch (error: any) {
            Alert.alert('Authentication Failed', error.message || 'Invalid magic link');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await apiClient.logout();
            await apiClient.setToken(null); // Clear the token
            setUser(null);
        } catch (error) {
            console.warn('Logout failed:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            const result = await apiClient.getCurrentUser();
            setUser(result.data);
        } catch (error: any) {
            if (error.message === 'UNAUTHORIZED') {
                setUser(null);
            }
        }
    };

    const loginAsDev = async () => {
        if (!__DEV__) {
            console.log('Dev login not available in production');
            return;
        }

        try {
            setIsLoading(true);
            console.log('🔧 Starting REAL dev authentication...');

            // Use the REAL authentication flow
            const result = await apiClient.loginAsDev();

            // Verify the token was actually set
            console.log('🔑 Auth result:', {
                hasToken: !!result.data.accessToken,
                userEmail: result.data.user.email,
                userId: result.data.user.id
            });

            // Set user state with the REAL authenticated user
            setUser(result.data.user);
            console.log('✅ Dev user authenticated with real token');

        } catch (error) {
            console.error('❌ Dev login failed:', error);
            Alert.alert('Dev Login Failed', 'Check console for details');
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        sendMagicLink,
        verifyMagicLink,
        logout,
        refreshUser,
        loginAsDev,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};