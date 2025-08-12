import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkStoredAuth();
    }, []);

    const checkStoredAuth = async () => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            const userData = await AsyncStorage.getItem(USER_KEY);

            if (token && userData) {
                apiClient.setToken(token);
                setUser(JSON.parse(userData));

                // Verify token is still valid
                try {
                    const response = await apiClient.getCurrentUser();
                    setUser(response.data);
                } catch (error) {
                    console.log('Token expired, clearing auth');
                    await clearAuth();
                }
            }
        } catch (error) {
            console.error('Error checking stored auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMagicLink = async (email: string) => {
        try {
            await apiClient.sendMagicLink(email);
        } catch (error) {
            throw error;
        }
    };

    const verifyMagicLink = async (token: string, email: string) => {
        try {
            const response = await apiClient.verifyMagicLink(token, email);

            console.log('🔍 Auth response:', response);

            // Now response.data contains { user, accessToken, message }
            await AsyncStorage.setItem(TOKEN_KEY, response.data.accessToken);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));

            apiClient.setToken(response.data.accessToken);
            setUser(response.data.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiClient.logout();
        } catch (error) {
            console.log('Logout API error (continuing anyway):', error);
        } finally {
            await clearAuth();
        }
    };

    const clearAuth = async () => {
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        apiClient.setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const response = await apiClient.getCurrentUser();
            setUser(response.data);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
        } catch (error) {
            console.error('Error refreshing user:', error);
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