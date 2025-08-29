// app/contexts/ProfileContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
}
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<TravelProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            loadUserProfile();
        } else {
            setIsLoading(false);
            setProfile(null);
            setStats(null);
        }
    }, [isAuthenticated, user]);

    const loadUserProfile = async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log('🔍 Loading user profile for:', user.id);

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

            console.log('✅ Profile loaded successfully');
        } catch (error: any) {
            console.error('❌ Error loading profile:', error);

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

    const loadUserStats = async (userId: string) => {
        try {
            console.log('📊 Loading user stats...');
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

                // Add other modes as needed
            };

            setStats(userStats);
            console.log('✅ Stats loaded successfully');
        } catch (error) {
            console.error('❌ Error loading stats:', error);
            // Don't throw error for stats - just log it
        }
    };

    const updateProfile = async (updates: Partial<TravelProfile>) => {
        if (!user?.id || !profile) return;

        try {
            console.log('💾 Updating profile...', updates);

            // Convert TravelProfile updates to API format
            const apiUpdates = {
                travelModes: updates.selectedModes || profile.selectedModes,
                primaryMode: updates.primaryMode || profile.primaryMode,
                showAllSpots: updates.showAllSpots !== undefined ? updates.showAllSpots : profile.showAllSpots,
                experienceLevel: updates.experienceLevel || profile.experienceLevel,
                safetyPriority: updates.safetyPriority || profile.safetyPriority,
                onboardingCompleted: updates.onboardingCompleted !== undefined ? updates.onboardingCompleted : profile.onboardingCompleted,
            };

            const response = await apiClient.updateUserProfile(user.id, apiUpdates);

            // Update local state with the response
            const updatedProfile: TravelProfile = {
                ...profile,
                selectedModes: updates.selectedModes || profile.selectedModes,
                primaryMode: updates.primaryMode || profile.primaryMode,
                showAllSpots: updates.showAllSpots !== undefined ? updates.showAllSpots : profile.showAllSpots,
                experienceLevel: updates.experienceLevel || profile.experienceLevel,
                safetyPriority: updates.safetyPriority || profile.safetyPriority,
                onboardingCompleted: updates.onboardingCompleted !== undefined ? updates.onboardingCompleted : profile.onboardingCompleted,
                updatedAt: new Date(),
            };

            setProfile(updatedProfile);
            console.log('✅ Profile updated successfully');
        } catch (error: any) {
            console.error('❌ Error updating profile:', error);
            setError(error.message || 'Failed to update profile');
            throw error;
        }
    };

    const refreshProfile = async () => {
        if (user?.id) {
            await loadUserProfile();
        }
    };

    const refreshStats = async () => {
        if (user?.id) {
            await loadUserStats(user.id);
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