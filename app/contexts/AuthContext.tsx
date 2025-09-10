// app/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/app/services/api';

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
    setDevToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        setIsLoading(true);

        try {
            if (__DEV__) {
                // Development: Use mock user, skip API calls
                await setupDevelopmentAuth();
            } else {
                // Production: Try to restore auth from storage
                await attemptTokenRestore();
            }
        } catch (error) {
            console.error('❌ Auth initialization failed:', error);
            console.log('🔄 Creating default profile due to API error');
            await createDefaultProfile();
        }

        setIsLoading(false);
    };
// app/contexts/AuthContext.tsx - Use consistent dev user ID
    const setupDevelopmentAuth = async () => {
        try {
            // Option 1: Try to get a real dev token from your backend
            console.log('🔐 Attempting real development authentication...');
            const result = await apiClient.loginAsDev();

            if (result.data.accessToken) {
                await apiClient.setToken(result.data.accessToken);
                setUser(result.data.user);
                console.log('✅ Real development authentication successful');
                return;
            }
        } catch (error) {
            console.log('⚠️ Real dev auth failed, falling back to mock user');
        }

        // Option 2: Fallback to mock user with backend-compatible ID
        const devUser: User = {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // FIXED: Match backend
            email: 'dev@vendro.app',
            username: 'devuser',
            display_name: 'Dev User',
            profile_photo_url: undefined,
            vendro_points: 100,
            safety_rating: 4.5,
            is_verified: true,
            created_at: new Date().toISOString(),
        };

        setUser(devUser);
        console.log('✅ Mock development user created');
        console.log('🎯 User ID matches backend dev user for API compatibility');
    };
    const createMockDevUser = async () => {
        console.log('🔧 Creating development user...');

        const devUser: User = {
            id: 'dev-user-123',
            email: 'dev@vendro.app',
            username: 'devuser',
            display_name: 'Dev User',
            profile_photo_url: undefined,
            vendro_points: 100,
            safety_rating: 4.5,
            is_verified: true,
            created_at: new Date().toISOString(),
        };

        setUser(devUser);
        console.log('✅ Development user created - ready for testing');
    };

    const createDefaultProfile = async () => {
        console.log('🔧 Creating default profile...');

        const defaultUser: User = {
            id: 'default-user-456',
            email: 'user@example.com',
            username: 'defaultuser',
            display_name: 'Default User',
            profile_photo_url: undefined,
            vendro_points: 0,
            safety_rating: 0,
            is_verified: false,
            created_at: new Date().toISOString(),
        };

        setUser(defaultUser);
        console.log('✅ Default profile created - onboarding incomplete');
    };

    const attemptTokenRestore = async () => {
        // Try to get user from API with stored token
        try {
            const result = await apiClient.getCurrentUser();
            setUser(result.data);
            console.log('✅ User restored from API');
        } catch (error) {
            console.log('ℹ️ No valid session found');
            throw error;
        }
    };

    const sendMagicLink = async (email: string) => {
        if (__DEV__) {
            console.log('🔧 [DEV] Mock magic link sent to:', email);
            return;
        }
        await apiClient.sendMagicLink(email);
    };

    const verifyMagicLink = async (token: string, email: string) => {
        if (__DEV__) {
            console.log('🔧 [DEV] Mock magic link verification');
            await createMockDevUser();
            return;
        }

        const result = await apiClient.verifyMagicLink(token, email);
        apiClient.setToken(result.data.accessToken);
        setUser(result.data.user);
    };

    const logout = async () => {
        if (__DEV__) {
            console.log('🔧 [DEV] Mock logout');
            setUser(null);
            return;
        }

        try {
            await apiClient.logout();
        } catch (error) {
            console.warn('Logout API call failed:', error);
        }

        apiClient.setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        if (__DEV__) {
            console.log('🔧 [DEV] Mock user refresh - no API call needed');
            return;
        }

        try {
            const result = await apiClient.getCurrentUser();
            setUser(result.data);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            throw error;
        }
    };

    const setDevToken = (token: string) => {
        if (__DEV__) {
            apiClient.setToken(token);
            console.log('🔧 Development token set:', token);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                sendMagicLink,
                verifyMagicLink,
                logout,
                refreshUser,
                setDevToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};