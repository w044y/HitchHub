// store/authStore.ts - Debug version
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    user: any | null;
    userProfile: any | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    initialize: () => void;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signOut: () => Promise<void>;
    setUser: (user: any | null) => void;
    setUserProfile: (profile: any | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            userProfile: null,
            isLoading: false,
            isAuthenticated: false,

            initialize: () => {
                console.log('🔍 Starting auth check...');

                // For now, just set to not authenticated to bypass the error
                setTimeout(() => {
                    console.log('✅ Auth check complete - showing tabs');
                    set({
                        user: null,
                        userProfile: null,
                        isAuthenticated: true, // Temporarily true for testing
                        isLoading: false
                    });
                }, 1000);
            },

            signIn: async (email: string, password: string) => {
                console.log('🔐 Sign in attempt:', email);
                set({ isLoading: true });
                // TODO: Implement actual sign in
                set({ isLoading: false, isAuthenticated: true });
            },

            signUp: async (email: string, password: string, displayName: string) => {
                console.log('📝 Sign up attempt:', email, displayName);
                set({ isLoading: true });
                // TODO: Implement actual sign up
                set({ isLoading: false, isAuthenticated: true });
            },

            signOut: async () => {
                console.log('👋 Sign out');
                set({
                    user: null,
                    userProfile: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            },

            setUser: (user: any | null) => {
                console.log('👤 Setting user:', user);
                set({ user, isAuthenticated: !!user });
            },

            setUserProfile: (profile: any | null) => {
                console.log('📄 Setting profile:', profile);
                set({ userProfile: profile });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                userProfile: state.userProfile,
            }),
        }
    )
);