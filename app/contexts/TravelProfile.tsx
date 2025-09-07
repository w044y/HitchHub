// app/contexts/ProfileContext.tsx - CORRECTED VERSION
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TravelProfile, UserStats } from '../types/profile';
import { TransportMode } from '@/app/types/transport';
import { useAuth } from './AuthContext';
import { apiClient, type Badge, type BadgeCounts } from '@/app/services/api';

interface ProfileContextType {
    profile: TravelProfile | null;
    stats: UserStats | null;
    isLoading: boolean;
    error: string | null;
    updateProfile: (updates: Partial<TravelProfile>) => Promise<void>;
    refreshProfile: () => Promise<void>;
    refreshStats: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<TravelProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { isAuthenticated, user, isLoading: authLoading } = useAuth();

    useEffect(() => {
        console.log('📝 ProfileProvider: Auth state changed', {
            hasUser: !!user,
            isAuthenticated,
            userId: user?.id,
            authLoading
        });

        // Don't start profile loading until auth is completely done
        if (authLoading) {
            console.log('📝 Waiting for auth to complete...');
            return;
        }

        if (isAuthenticated && user) {
            console.log('📝 Auth complete, loading REAL profile from API...');
            loadRealProfile();
        } else {
            console.log('📝 User not authenticated, clearing profile');
            setProfile(null);
            setStats(null);
            setError(null);
            setIsLoading(false);
        }
    }, [isAuthenticated, user, authLoading]);

    const loadRealProfile = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🔄 Fetching real profile from API...');

            // Try to get the user's actual profile from the API
            const profileResult = await apiClient.getCurrentUser();

            if (profileResult.data && profileResult.data.profile) {
                console.log('✅ Real profile loaded from API');

                // Convert API response to TravelProfile format
                const apiProfile = profileResult.data.profile;
                const convertedProfile: TravelProfile = {
                    userId: user?.id || '',

                    // Travel preferences from API
                    travelModes: apiProfile.travel_modes || [TransportMode.HITCHHIKING],
                    primaryMode: apiProfile.primary_mode || TransportMode.HITCHHIKING,
                    experienceLevel: apiProfile.experience_level || 'beginner',
                    safetyPriority: apiProfile.safety_priority || 'high',
                    showAllSpots: apiProfile.show_all_spots || false,

                    // Trust & verification from API
                    trustScore: 65, // Calculate this properly later
                    emailVerified: apiProfile.email_verified || false,
                    phoneVerified: apiProfile.phone_verified || false,
                    socialConnected: apiProfile.social_connected || false,
                    communityVouches: apiProfile.community_vouches || 0,

                    // Stats from API
                    totalReviews: apiProfile.total_reviews || 0,
                    helpfulReviews: apiProfile.helpful_reviews || 0,
                    reviewerRating: apiProfile.reviewer_rating || 0,
                    spotsAdded: apiProfile.spots_added || 0,
                    verifiedSpots: apiProfile.verified_spots || 0,

                    // Extended profile from API
                    bio: apiProfile.bio || '',
                    languages: apiProfile.languages || ['en'],
                    countriesVisited: apiProfile.countries_visited || [],
                    publicProfile: apiProfile.public_profile !== false,
                    showStats: apiProfile.show_stats !== false,

                    // Badges (empty for now, add later)
                    badges: [],
                    badgeCounts: {
                        total: 0,
                        trust: 0,
                        reviewer: 0,
                        contributor: 0,
                        explorer: 0,
                        community: 0,
                        special: 0,
                        gold: 0,
                        silver: 0,
                        bronze: 0,
                    },

                    // Meta from API
                    onboardingCompleted: apiProfile.onboarding_completed || false,
                    createdAt: new Date(apiProfile.created_at || Date.now()),
                    updatedAt: new Date(apiProfile.updated_at || Date.now()),
                    memberSince: new Date(user?.created_at || Date.now()),
                    isNewMember: false,
                };

                setProfile(convertedProfile);
                console.log('✅ Profile converted and set:', {
                    onboardingCompleted: convertedProfile.onboardingCompleted,
                    travelModes: convertedProfile.travelModes
                });

                // Load mock stats for now
                setStats({
                    totalTrips: 0,
                    totalDistance: 0,
                    countriesVisited: convertedProfile.countriesVisited.length,
                    carbonSaved: 0
                });

            } else {
                console.log('⚠️ No profile found in API response, creating default');
                createDefaultProfile();
            }

        } catch (error: any) {
            console.error('❌ Failed to load real profile:', error.message);

            if (error.message === 'UNAUTHORIZED') {
                setError('Authentication required');
            } else {
                // Fallback to creating a default profile
                console.log('🔄 Creating default profile due to API error');
                createDefaultProfile();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const createDefaultProfile = () => {
        console.log('🔧 Creating default profile...');

        const defaultProfile: TravelProfile = {
            userId: user?.id || 'unknown',

            // Travel preferences
            travelModes: [TransportMode.HITCHHIKING],
            primaryMode: TransportMode.HITCHHIKING,
            experienceLevel: 'beginner',
            safetyPriority: 'high',
            showAllSpots: false,

            // Trust & verification
            trustScore: 50,
            emailVerified: user?.is_verified || false,
            phoneVerified: false,
            socialConnected: false,
            communityVouches: 0,

            // Stats
            totalReviews: 0,
            helpfulReviews: 0,
            reviewerRating: 0,
            spotsAdded: 0,
            verifiedSpots: 0,

            // Extended profile
            bio: '',
            languages: ['en'],
            countriesVisited: [],
            publicProfile: true,
            showStats: true,

            // Badges
            badges: [],
            badgeCounts: {
                total: 0,
                trust: 0,
                reviewer: 0,
                contributor: 0,
                explorer: 0,
                community: 0,
                special: 0,
                gold: 0,
                silver: 0,
                bronze: 0,
            },

            // Meta - IMPORTANT: Set onboarding as incomplete for new users
            onboardingCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            memberSince: new Date(user?.created_at || Date.now()),
            isNewMember: true,
        };

        setProfile(defaultProfile);
        setStats({
            totalTrips: 0,
            totalDistance: 0,
            countriesVisited: 0,
            carbonSaved: 0
        });

        console.log('✅ Default profile created with onboarding incomplete');
    };

    const updateProfile = async (updates: Partial<TravelProfile>) => {
        if (!profile) return;

        const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
        setProfile(updatedProfile);

        console.log('✅ Profile updated locally');
    };

    const refreshProfile = async () => {
        await loadRealProfile();
    };

    const refreshStats = async () => {
        console.log('🔄 Stats refresh requested');
    };

    return (
        <ProfileContext.Provider
            value={{
                profile,
                stats,
                isLoading,
                error,
                updateProfile,
                refreshProfile,
                refreshStats,
            }}
        >
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