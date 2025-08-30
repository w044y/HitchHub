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
            console.log('🔐 Setting up development authentication...');

            // In development, bypass all API auth and just set user state
            const devUser: User = {
                id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                email: 'dev@vendro.app',
                username: 'devuser',
                display_name: 'Dev User',
                profile_photo_url: undefined,
                vendro_points: 100,
                safety_rating: 4.5,
                is_verified: true,
                created_at: new Date().toISOString(),
            };

            // Set a mock token that your backend will accept
            setUser(devUser);
            setIsLoading(false);

            console.log('✅ Development user authenticated (mock):', devUser);

        } catch (error) {
            console.error('❌ Development auth failed:', error);
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