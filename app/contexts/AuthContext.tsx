// app/contexts/AuthContext.tsx - Fix authentication
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
    // Add method to set dev token
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
                // For development, create a dev user with a real JWT token
                await loginAsDevelopmentUser();
            } else {
                // Production auth logic here
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Auth initialization failed:', error);
            setIsLoading(false);
        }
    };

    const loginAsDevelopmentUser = async () => {
        try {
            // First, try to send a magic link to dev user
            console.log('🔐 Setting up development authentication...');

            const devEmail = 'dev@vendro.app';

            // Send magic link
            await apiClient.sendMagicLink(devEmail);
            console.log('📧 Magic link sent to dev user');

            // In development, we'll use a predictable token
            // This is just for development - never do this in production!
            const devToken = 'dev-magic-token-12345';

            // Verify magic link with dev token
            const authResult = await apiClient.verifyMagicLink(devToken, devEmail);

            // Set the token in API client
            apiClient.setToken(authResult.data.accessToken);

            setUser(authResult.data.user);
            setIsLoading(false);

            console.log('✅ Development user authenticated:', authResult.data.user.email);
        } catch (error) {
            console.error('❌ Development auth failed:', error);

            // Fallback: create a mock token for development
            const mockToken = 'mock-dev-token-' + Date.now();
            apiClient.setToken(mockToken);

            // Try to get user info with mock token
            try {
                const userResult = await apiClient.getCurrentUser();
                setUser(userResult.data);
                console.log('✅ Development user loaded with mock token');
            } catch (userError) {
                console.warn('⚠️ Could not load user, continuing without auth');
            }

            setIsLoading(false);
        }
    };

    const sendMagicLink = async (email: string) => {
        await apiClient.sendMagicLink(email);
    };

    const verifyMagicLink = async (token: string, email: string) => {
        const result = await apiClient.verifyMagicLink(token, email);
        apiClient.setToken(result.data.accessToken);
        setUser(result.data.user);
    };

    const logout = async () => {
        try {
            await apiClient.logout();
        } catch (error) {
            console.warn('Logout API call failed:', error);
        }

        apiClient.setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const result = await apiClient.getCurrentUser();
            setUser(result.data);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const setDevToken = (token: string) => {
        apiClient.setToken(token);
        console.log('🔧 Development token set:', token);
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