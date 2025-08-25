// app/contexts/ProfileContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TravelProfile, UserStats } from '@/app/types/profile';
import { TransportMode } from '@/app/types/transport';

interface ProfileContextType {
    profile: TravelProfile | null;
    stats: UserStats | null;
    isLoading: boolean;
    updateProfile: (updates: Partial<TravelProfile>) => Promise<void>;
    refreshStats: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<TravelProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        setIsLoading(true);
        try {
            // For now, load mock data - replace with API call later
            const mockProfile: TravelProfile = {
                userId: 'dev-user-123',
                travelModes: [TransportMode.HITCHHIKING, TransportMode.CYCLING],
                preferences: {
                    primaryMode: TransportMode.HITCHHIKING,
                    experienceLevel: 'intermediate',
                    safetyPriority: 'high',
                },
                onboardingCompleted: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockStats: UserStats = {
                hitchhiking: {
                    totalRides: 47,
                    totalDistance: 1250,
                    averageRating: 4.2,
                    lastRide: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
                },
                cycling: {
                    totalDistance: 234,
                    totalRoutes: 12,
                    lastRide: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                },
            };

            setProfile(mockProfile);
            setStats(mockStats);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<TravelProfile>) => {
        if (!profile) return;

        const updatedProfile = {
            ...profile,
            ...updates,
            updatedAt: new Date(),
        };

        setProfile(updatedProfile);
        // TODO: Save to API
    };

    const refreshStats = async () => {
        // TODO: Refresh from API
        console.log('Refreshing stats...');
    };

    return (
        <ProfileContext.Provider value={{
            profile,
            stats,
            isLoading,
            updateProfile,
            refreshStats,
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