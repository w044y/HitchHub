// app/contexts/ProfileContext.tsx - Complete file with development bypass
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelProfile, UserStats } from '@/app/types/profile';
import { TransportMode } from '@/app/types/transport';
import { apiClient } from '@/app/services/api';
import { useAuth } from './AuthContext';

interface ProfileContextType {
    profile: TravelProfile | null;
    stats: UserStats | null;
    isLoading: boolean;
    error: string | null;
    updateProfile: (updates: Partial<TravelProfile>) => Promise<void>;
    refreshStats: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    clearDevProfile: () => Promise<void>; // Development only
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const DEV_PROFILE_KEY = 'dev_user_profile';
const DEV_STATS_KEY = 'dev_user_stats';

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<TravelProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        console.log('🔄 ProfileProvider: Auth state changed', {
            isAuthenticated,
            hasUser: !!user,
            userId: user?.id
        });

        if (isAuthenticated && user) {
            if (__DEV__) {
                loadDevelopmentProfile();
            } else {
                loadUserProfile();
            }
        } else {
            console.log('📝 User not authenticated, clearing profile state');
            setIsLoading(false);
            setProfile(null);
            setStats(null);
            setError(null);
        }
    }, [isAuthenticated, user]);

    // Development profile loading from AsyncStorage
    const loadDevelopmentProfile = async () => {
        console.log('🔧 Loading development profile from AsyncStorage...');
        setIsLoading(true);
        setError(null);

        try {
            // Try to load profile from AsyncStorage
            const savedProfile = await AsyncStorage.getItem(DEV_PROFILE_KEY);
            const savedStats = await AsyncStorage.getItem(DEV_STATS_KEY);

            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                console.log('✅ Loaded saved development profile:', parsedProfile);

                // Convert date strings back to Date objects
                parsedProfile.createdAt = new Date(parsedProfile.createdAt);
                parsedProfile.updatedAt = new Date(parsedProfile.updatedAt);

                setProfile(parsedProfile);
                setError(null);
            } else {
                console.log('📝 No saved profile found, user needs onboarding');
                setProfile(null);
                setError('onboarding_required');
            }

            // Load or create mock stats
            if (savedStats) {
                const parsedStats = JSON.parse(savedStats);
                // Convert date strings back to Date objects
                if (parsedStats.hitchhiking?.lastRide) {
                    parsedStats.hitchhiking.lastRide = new Date(parsedStats.hitchhiking.lastRide);
                }
                if (parsedStats.cycling?.lastRide) {
                    parsedStats.cycling.lastRide = new Date(parsedStats.cycling.lastRide);
                }
                setStats(parsedStats);
            } else {
                // Create mock stats based on profile
                const mockStats: UserStats = {
                    hitchhiking: savedProfile && JSON.parse(savedProfile).selectedModes?.includes(TransportMode.HITCHHIKING) ? {
                        totalRides: 12,
                        totalDistance: 2400,
                        averageRating: 4.7,
                        lastRide: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                    } : undefined,
                    cycling: savedProfile && JSON.parse(savedProfile).selectedModes?.includes(TransportMode.CYCLING) ? {
                        totalDistance: 1200,
                        totalRoutes: 8,
                        lastRide: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
                    } : undefined,
                    vanCamping: savedProfile && JSON.parse(savedProfile).selectedModes?.includes(TransportMode.VAN_LIFE) ? {
                        totalNights: 15,
                        favoriteSpots: 5,
                        lastStay: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                    } : undefined,
                    walking: savedProfile && JSON.parse(savedProfile).selectedModes?.includes(TransportMode.WALKING) ? {
                        totalDistance: 450,
                        citiesExplored: 3,
                        lastWalk: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    } : undefined,
                };

                setStats(mockStats);
                await AsyncStorage.setItem(DEV_STATS_KEY, JSON.stringify(mockStats));
                console.log('✅ Created and saved mock stats for development');
            }

        } catch (error) {
            console.error('❌ Error loading development profile:', error);
            setProfile(null);
            setError('onboarding_required');
        } finally {
            setIsLoading(false);
        }
    };

    // Production profile loading (API calls)
    const loadUserProfile = async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log('🔍 Loading user profile from API for:', user.id);

            // Fetch user profile from API
            const profileResponse = await apiClient.getUserProfile(user.id);

            if (profileResponse.data) {
                // Convert API response to TravelProfile format
                const travelProfile: TravelProfile = {
                    userId: profileResponse.data.userId,
                    selectedModes: profileResponse.data.travelModes || [TransportMode.HITCHHIKING],
                    primaryMode: profileResponse.data.preferences?.primaryMode || TransportMode.HITCHHIKING,
                    showAllSpots: profileResponse.data.preferences?.showAllSpots || false,
                    experienceLevel: profileResponse.data.preferences?.experienceLevel || 'beginner',
                    safetyPriority: profileResponse.data.preferences?.safetyPriority || 'high',
                    onboardingCompleted: profileResponse.data.onboardingCompleted || false,
                    createdAt: new Date(profileResponse.data.createdAt),
                    updatedAt: new Date(profileResponse.data.updatedAt),
                };

                setProfile(travelProfile);

                // Also fetch user stats
                await loadUserStats(user.id);
            }

            console.log('✅ Profile loaded successfully from API');
        } catch (error: any) {
            console.error('❌ Error loading profile from API:', error);

            if (error.response?.status === 404) {
                // Profile not found - user needs onboarding
                console.log('📝 Profile not found - user needs onboarding');
                setProfile(null);
                setError('onboarding_required');
            } else {
                setError(error.message || 'Failed to load profile');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Production stats loading
    const loadUserStats = async (userId: string) => {
        try {
            console.log('📊 Loading user stats from API...');
            const statsResponse = await apiClient.getUserStats(userId);

            // Convert API response to UserStats format
            const userStats: UserStats = {
                hitchhiking: statsResponse.data.hitchhiking ? {
                    totalRides: statsResponse.data.hitchhiking.totalRides || 0,
                    totalDistance: statsResponse.data.hitchhiking.totalDistance || 0,
                    averageRating: statsResponse.data.hitchhiking.averageRating || 0,
                    lastRide: statsResponse.data.hitchhiking.lastRide
                        ? new Date(statsResponse.data.hitchhiking.lastRide)
                        : undefined,
                } : undefined,

                cycling: statsResponse.data.cycling ? {
                    totalDistance: statsResponse.data.cycling.totalDistance || 0,
                    totalRoutes: statsResponse.data.cycling.totalRoutes || 0,
                    lastRide: statsResponse.data.cycling.lastRide
                        ? new Date(statsResponse.data.cycling.lastRide)
                        : undefined,
                } : undefined,

                vanCamping: statsResponse.data.vanCamping ? {
                    totalNights: statsResponse.data.vanCamping.totalNights || 0,
                    favoriteSpots: statsResponse.data.vanCamping.favoriteSpots || 0,
                    lastStay: statsResponse.data.vanCamping.lastStay
                        ? new Date(statsResponse.data.vanCamping.lastStay)
                        : undefined,
                } : undefined,

                walking: statsResponse.data.walking ? {
                    totalDistance: statsResponse.data.walking.totalDistance || 0,
                    citiesExplored: statsResponse.data.walking.citiesExplored || 0,
                    lastWalk: statsResponse.data.walking.lastWalk
                        ? new Date(statsResponse.data.walking.lastWalk)
                        : undefined,
                } : undefined,
            };

            setStats(userStats);
            console.log('✅ Stats loaded successfully from API');
        } catch (error) {
            console.error('❌ Error loading stats from API:', error);
            // Don't throw error for stats - just log it
        }
    };

    // Update profile (development vs production)
    const updateProfile = async (updates: Partial<TravelProfile>) => {
        if (!user?.id) {
            console.error('❌ No user ID available for profile update');
            throw new Error('User not authenticated - please log in again');
        }

        try {
            console.log('💾 Updating profile...', updates);

            if (__DEV__) {
                // Development: Save to AsyncStorage instead of API
                const newProfile: TravelProfile = {
                    userId: user.id,
                    selectedModes: updates.selectedModes || profile?.selectedModes || [],
                    primaryMode: updates.primaryMode || profile?.primaryMode || updates.selectedModes?.[0] || TransportMode.HITCHHIKING,
                    showAllSpots: updates.showAllSpots !== undefined ? updates.showAllSpots : profile?.showAllSpots || false,
                    experienceLevel: updates.experienceLevel || profile?.experienceLevel || 'beginner',
                    safetyPriority: updates.safetyPriority || profile?.safetyPriority || 'high',
                    onboardingCompleted: updates.onboardingCompleted !== undefined ? updates.onboardingCompleted : true,
                    createdAt: profile?.createdAt || new Date(),
                    updatedAt: new Date(),
                };

                console.log('🔧 DEV: Saving profile to AsyncStorage:', newProfile);

                // Save to AsyncStorage
                await AsyncStorage.setItem(DEV_PROFILE_KEY, JSON.stringify(newProfile));

                // Update state
                setProfile(newProfile);
                setError(null);

                // Update stats based on new selected modes
                const updatedStats: UserStats = {
                    hitchhiking: newProfile.selectedModes.includes(TransportMode.HITCHHIKING) ? {
                        totalRides: stats?.hitchhiking?.totalRides || 12,
                        totalDistance: stats?.hitchhiking?.totalDistance || 2400,
                        averageRating: stats?.hitchhiking?.averageRating || 4.7,
                        lastRide: stats?.hitchhiking?.lastRide || new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    } : undefined,
                    cycling: newProfile.selectedModes.includes(TransportMode.CYCLING) ? {
                        totalDistance: stats?.cycling?.totalDistance || 1200,
                        totalRoutes: stats?.cycling?.totalRoutes || 8,
                        lastRide: stats?.cycling?.lastRide || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    } : undefined,
                    vanCamping: newProfile.selectedModes.includes(TransportMode.VAN_LIFE) ? {
                        totalNights: stats?.vanCamping?.totalNights || 15,
                        favoriteSpots: stats?.vanCamping?.favoriteSpots || 5,
                        lastStay: stats?.vanCamping?.lastStay || new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    } : undefined,
                    walking: newProfile.selectedModes.includes(TransportMode.WALKING) ? {
                        totalDistance: stats?.walking?.totalDistance || 450,
                        citiesExplored: stats?.walking?.citiesExplored || 3,
                        lastWalk: stats?.walking?.lastWalk || new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    } : undefined,
                };

                setStats(updatedStats);
                await AsyncStorage.setItem(DEV_STATS_KEY, JSON.stringify(updatedStats));

                console.log('✅ Development profile and stats updated successfully');
                return;
            }

            // Production: API calls
            const apiUpdates = {
                travelModes: updates.selectedModes || profile?.selectedModes || [],
                primaryMode: updates.primaryMode || profile?.primaryMode || TransportMode.HITCHHIKING,
                showAllSpots: updates.showAllSpots !== undefined ? updates.showAllSpots : profile?.showAllSpots || false,
                experienceLevel: updates.experienceLevel || profile?.experienceLevel || 'beginner',
                safetyPriority: updates.safetyPriority || profile?.safetyPriority || 'high',
                onboardingCompleted: updates.onboardingCompleted !== undefined ? updates.onboardingCompleted : true,
            };

            const response = await apiClient.updateUserProfile(user.id, apiUpdates);

            // Update local state with API response
            const updatedProfile: TravelProfile = {
                ...profile!,
                selectedModes: updates.selectedModes || profile?.selectedModes || [],
                primaryMode: updates.primaryMode || profile?.primaryMode || TransportMode.HITCHHIKING,
                showAllSpots: updates.showAllSpots !== undefined ? updates.showAllSpots : profile?.showAllSpots || false,
                experienceLevel: updates.experienceLevel || profile?.experienceLevel || 'beginner',
                safetyPriority: updates.safetyPriority || profile?.safetyPriority || 'high',
                onboardingCompleted: updates.onboardingCompleted !== undefined ? updates.onboardingCompleted : true,
                updatedAt: new Date(),
            };

            setProfile(updatedProfile);
            console.log('✅ Profile updated successfully via API');

        } catch (error: any) {
            console.error('❌ Error updating profile:', error);
            setError(error.message || 'Failed to update profile');
            throw error;
        }
    };

    const refreshProfile = async () => {
        console.log('🔄 Refreshing profile...');
        if (user?.id) {
            if (__DEV__) {
                await loadDevelopmentProfile();
            } else {
                await loadUserProfile();
            }
        }
    };

    const refreshStats = async () => {
        console.log('🔄 Refreshing stats...');
        if (__DEV__) {
            console.log('🔧 DEV: Stats refresh (already loaded from AsyncStorage)');
            return;
        }

        if (user?.id) {
            await loadUserStats(user.id);
        }
    };

    // Development only: Clear profile
    const clearDevProfile = async () => {
        if (__DEV__) {
            console.log('🗑️ Clearing development profile...');
            await AsyncStorage.removeItem(DEV_PROFILE_KEY);
            await AsyncStorage.removeItem(DEV_STATS_KEY);
            setProfile(null);
            setStats(null);
            setError('onboarding_required');
            console.log('✅ Development profile cleared');
        }
    };

    return (
        <ProfileContext.Provider value={{
            profile,
            stats,
            isLoading,
            error,
            updateProfile,
            refreshStats,
            refreshProfile,
            clearDevProfile,
        }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};