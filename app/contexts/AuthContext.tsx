// app/contexts/AuthContext.tsx - Simplified version
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate auth check and auto-login
        setTimeout(() => {
            const mockUser: User = {
                id: 'mock-user-123',
                email: 'dev@vendro.app',
                username: 'devuser',
                display_name: 'Dev User',
                vendro_points: 100,
                safety_rating: 4.5,
                is_verified: true,
                created_at: new Date().toISOString(),
            };

            setUser(mockUser);
            setIsLoading(false);
            console.log('🔓 Auth disabled - auto-logged in as dev user');
        }, 500); // Short delay to simulate loading
    }, []);

    // Mock functions (no-op)
    const sendMagicLink = async (email: string) => {
        console.log('📧 Mock: Magic link sent to', email);
    };

    const verifyMagicLink = async (token: string, email: string) => {
        console.log('✅ Mock: Magic link verified');
    };

    const logout = async () => {
        console.log('👋 Mock: Logged out');
        setUser(null);
    };

    const refreshUser = async () => {
        console.log('🔄 Mock: User refreshed');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: true, // Always authenticated in dev mode
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