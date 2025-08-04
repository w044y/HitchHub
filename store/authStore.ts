// Update your src/store/authStore.ts to work with Expo Router

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router'; // Add this import

// ... (keep all your existing types - User, TravelPreferences, etc.)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  preferences: TravelPreferences;
  verificationStatus: VerificationStatus;
  safetyRating: number;
  carbonFootprintSaved: number;
  tripCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TravelPreferences {
  maxDetour: number;
  smokingAllowed: boolean;
  petsAllowed: boolean;
  musicPreference: 'none' | 'quiet' | 'moderate' | 'loud';
  conversationLevel: 'minimal' | 'moderate' | 'chatty';
  languages: string[];
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface VerificationStatus {
  email: boolean;
  phone: boolean;
  identity: boolean;
  driversLicense?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

interface AuthState {
  // Auth status
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  tokens: AuthTokens | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  initializeAuth: () => Promise<void>;

  // Social auth
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;

  // Password management
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Verification
  verifyEmail: (token: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
  requestPhoneVerification: (phone: string) => Promise<void>;
}

// ... (keep your existing TokenStorage and mockApiCall)

const TokenStorage = {
  async setTokens(tokens: AuthTokens) {
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
    await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
    await SecureStore.setItemAsync('tokenExpiry', tokens.expiresAt.toString());
  },

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const expiresAt = await SecureStore.getItemAsync('tokenExpiry');

      if (!accessToken || !refreshToken || !expiresAt) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
        expiresAt: parseInt(expiresAt, 10),
      };
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  },

  async removeTokens() {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('tokenExpiry');
  },
};

const mockApiCall = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: false,
      user: null,
      tokens: null,

      // Initialize authentication from stored data
      initializeAuth: async () => {
        set({ isLoading: true });

        try {
          const tokens = await TokenStorage.getTokens();

          if (tokens && tokens.expiresAt > Date.now()) {
            // Token is valid, fetch user data
            const user = await mockApiCall<User>({
              id: '1',
              email: 'user@example.com',
              firstName: 'John',
              lastName: 'Doe',
              preferences: {
                maxDetour: 20,
                smokingAllowed: false,
                petsAllowed: true,
                musicPreference: 'moderate',
                conversationLevel: 'moderate',
                languages: ['en', 'pl'],
                emergencyContacts: [],
              },
              verificationStatus: {
                email: true,
                phone: false,
                identity: false,
              },
              safetyRating: 4.8,
              carbonFootprintSaved: 245.5,
              tripCount: 12,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            set({
              isAuthenticated: true,
              user,
              tokens,
              isLoading: false,
            });
          } else {
            // Token is expired or invalid
            await TokenStorage.removeTokens();
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }
      },

      // Login with email and password - Updated for Expo Router
      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          // Mock API call
          const response = await mockApiCall({
            user: {
              id: '1',
              email,
              firstName: 'John',
              lastName: 'Doe',
              preferences: {
                maxDetour: 20,
                smokingAllowed: false,
                petsAllowed: true,
                musicPreference: 'moderate' as const,
                conversationLevel: 'moderate' as const,
                languages: ['en', 'pl'],
                emergencyContacts: [],
              },
              verificationStatus: {
                email: true,
                phone: false,
                identity: false,
              },
              safetyRating: 4.8,
              carbonFootprintSaved: 245.5,
              tripCount: 12,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            tokens: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token',
              expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            },
          });

          await TokenStorage.setTokens(response.tokens);

          set({
            isAuthenticated: true,
            user: response.user,
            tokens: response.tokens,
            isLoading: false,
          });

          // Navigate to main app using Expo Router
          router.replace('/(tabs)');
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Login failed');
        }
      },

      // Register new user - Updated for Expo Router
      register: async (userData: RegisterData) => {
        set({ isLoading: true });

        try {
          const response = await mockApiCall({
            user: {
              id: '1',
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone,
              dateOfBirth: userData.dateOfBirth,
              preferences: {
                maxDetour: 20,
                smokingAllowed: false,
                petsAllowed: true,
                musicPreference: 'moderate' as const,
                conversationLevel: 'moderate' as const,
                languages: ['en'],
                emergencyContacts: [],
              },
              verificationStatus: {
                email: false,
                phone: false,
                identity: false,
              },
              safetyRating: 0,
              carbonFootprintSaved: 0,
              tripCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            tokens: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token',
              expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            },
          });

          await TokenStorage.setTokens(response.tokens);

          set({
            isAuthenticated: true,
            user: response.user,
            tokens: response.tokens,
            isLoading: false,
          });

          // Navigate to main app using Expo Router
          router.replace('/(tabs)');
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Registration failed');
        }
      },

      // Logout - Updated for Expo Router
      logout: async () => {
        set({ isLoading: true });

        try {
          await TokenStorage.removeTokens();
          set({
            isAuthenticated: false,
            user: null,
            tokens: null,
            isLoading: false,
          });

          // Navigate to welcome screen using Expo Router
          router.replace('/auth/WelcomeScreen');
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
        }
      },

      // ... (keep all your other existing methods)
      refreshToken: async () => {
        const { tokens } = get();

        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const newTokens = await mockApiCall({
            accessToken: 'new-mock-access-token',
            refreshToken: tokens.refreshToken,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          });

          await TokenStorage.setTokens(newTokens);
          set({ tokens: newTokens });
        } catch (error) {
          // Refresh failed, logout user
          await get().logout();
          throw new Error('Token refresh failed');
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { user } = get();

        if (!user) {
          throw new Error('No user logged in');
        }

        set({ isLoading: true });

        try {
          const updatedUser = await mockApiCall({
            ...user,
            ...updates,
            updatedAt: new Date().toISOString(),
          });

          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Profile update failed');
        }
      },

      // Social authentication methods
      loginWithGoogle: async () => {
        set({ isLoading: true });
        await mockApiCall(null);
        set({ isLoading: false });
      },

      loginWithFacebook: async () => {
        set({ isLoading: true });
        await mockApiCall(null);
        set({ isLoading: false });
      },

      // Password management
      forgotPassword: async (email: string) => {
        await mockApiCall({ success: true });
      },

      resetPassword: async (token: string, newPassword: string) => {
        await mockApiCall({ success: true });
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        await mockApiCall({ success: true });
      },

      // Verification methods
      verifyEmail: async (token: string) => {
        const { user } = get();
        if (user) {
          await get().updateProfile({
            verificationStatus: {
              ...user.verificationStatus,
              email: true,
            },
          });
        }
      },

      verifyPhone: async (code: string) => {
        const { user } = get();
        if (user) {
          await get().updateProfile({
            verificationStatus: {
              ...user.verificationStatus,
              phone: true,
            },
          });
        }
      },

      requestPhoneVerification: async (phone: string) => {
        await mockApiCall({ success: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        // Don't persist tokens in AsyncStorage - they're stored securely
      }),
    }
  )
);