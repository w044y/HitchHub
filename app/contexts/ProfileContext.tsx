// app/contexts/ProfileContext.tsx - Aligned with ApiClient
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelProfile, UserStats } from '../types/profile';
import { TransportMode } from '@/app/types/transport';
import {
    apiClient, type CompleteUserProfileResponse,
    type UserStatsResponse,
    type Badge,
    type BadgeCounts, TrustVerificationResponse
} from '@/app/services/api';
import { useAuth } from './AuthContext';

interface ProfileContextType {
    profile: TravelProfile | null;
    stats: UserStats | null;
    isLoading: boolean;
    error: string | null;

    // Phase 1 Methods
    updateProfile: (updates: Partial<TravelProfile>) => Promise<void>;
    refreshStats: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    calculateTrustScore: () => Promise<number>;
    requestEmailVerification: () => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
    requestPhoneVerification: (phoneNumber: string) => Promise<void>;
    verifyPhone: (phoneNumber: string, code: string) => Promise<void>;
    verifySocialAccount: (platform: 'facebook' | 'google', accessToken: string) => Promise<void>;
    getVerifications: () => Promise<TrustVerificationResponse[]>;
    refreshVerifications: () => Promise<void>;
    // Phase 2 Methods
    updateExtendedProfile: (updates: {
        bio?: string;
        languages?: string[];
        countriesVisited?: string[];
        publicProfile?: boolean;
        showStats?: boolean;
    }) => Promise<void>;

    // Badge Methods
    refreshBadges: () => Promise<void>;
    awardBadge: (badgeKey: string) => Promise<void>;

    // Development Methods
    clearDevProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const DEV_PROFILE_KEY = 'dev_user_profile';
const DEV_STATS_KEY = 'dev_user_stats';
const DEV_BADGES_KEY = 'dev_user_badges';

const MOCK_BADGES: Badge[] = [
    {
        id: '1',
        key: 'email_verified',
        name: 'Email Verified',
        description: 'Verified email address',
        emoji: '✅',
        category: 'trust',
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '2',
        key: 'first_reviewer',
        name: 'First Reviewer',
        description: 'Left first helpful review',
        emoji: '📝',
        category: 'reviewer',
        earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '3',
        key: 'helpful_reviewer_bronze',
        name: 'Helpful Reviewer',
        description: 'Left 5+ helpful reviews',
        emoji: '⭐',
        category: 'reviewer',
        level: 'bronze',
        earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
];

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
            const [savedProfile, savedStats, savedBadges] = await Promise.all([
                AsyncStorage.getItem(DEV_PROFILE_KEY),
                AsyncStorage.getItem(DEV_STATS_KEY),
                AsyncStorage.getItem(DEV_BADGES_KEY)
            ]);

            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                console.log('✅ Loaded saved development profile:', parsedProfile);

                // Convert date strings back to Date objects
                parsedProfile.createdAt = new Date(parsedProfile.createdAt);
                parsedProfile.updatedAt = new Date(parsedProfile.updatedAt);
                parsedProfile.memberSince = new Date(parsedProfile.memberSince);

                // Process badges
                const badges = savedBadges ? JSON.parse(savedBadges) : MOCK_BADGES;
                badges.forEach((badge: any) => {
                    badge.earnedAt = new Date(badge.earnedAt);
                });
                const badgeCounts = calculateBadgeCounts(badges);

                parsedProfile.badges = badges;
                parsedProfile.badgeCounts = badgeCounts;
                parsedProfile.isNewMember = isNewMember(parsedProfile.memberSince);

                setProfile(parsedProfile);
                setError(null);
            } else {
                console.log('📝 No saved profile found, user needs onboarding');
                setProfile(null);
                setError('onboarding_required');
            }

            // Load stats
            if (savedStats) {
                const parsedStats = JSON.parse(savedStats);
                convertStatsDates(parsedStats);
                setStats(parsedStats);
            } else if (savedProfile) {
                const mockStats = createMockStats(JSON.parse(savedProfile));
                setStats(mockStats);
                await AsyncStorage.setItem(DEV_STATS_KEY, JSON.stringify(mockStats));
            }

        } catch (error) {
            console.error('❌ Error loading development profile:', error);
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

            const profileResponse = await apiClient.getUserCompleteProfile(user.id);

            if (profileResponse.data) {
                const apiProfile = profileResponse.data;

                // FIXED: Map API response to TravelProfile interface
                const travelProfile: TravelProfile = {
                    userId: apiProfile.profile.userId,
                    travelModes: apiProfile.profile.travelModes || [TransportMode.HITCHHIKING],
                    primaryMode: apiProfile.profile.primaryMode || TransportMode.HITCHHIKING,
                    experienceLevel: apiProfile.profile.experienceLevel || 'beginner',
                    safetyPriority: apiProfile.profile.safetyPriority || 'high',
                    showAllSpots: apiProfile.profile.showAllSpots || false,

                    // Phase 1: Trust & Credibility
                    trustScore: apiProfile.trustScore || 0,
                    emailVerified: apiProfile.profile.emailVerified || false,
                    phoneVerified: apiProfile.profile.phoneVerified || false,
                    socialConnected: apiProfile.profile.socialConnected || false,
                    communityVouches: apiProfile.profile.communityVouches || 0,

                    // Community Stats
                    totalReviews: apiProfile.profile.totalReviews || 0,
                    helpfulReviews: apiProfile.profile.helpfulReviews || 0,
                    reviewerRating: apiProfile.profile.reviewerRating || 0,
                    spotsAdded: apiProfile.profile.spotsAdded || 0,
                    verifiedSpots: apiProfile.profile.verifiedSpots || 0,

                    // Phase 2: Personality & Gamification
                    bio: apiProfile.profile.bio,
                    languages: apiProfile.profile.languages || ['en'],
                    countriesVisited: apiProfile.profile.countriesVisited || [],
                    publicProfile: apiProfile.profile.publicProfile !== false,
                    showStats: apiProfile.profile.showStats !== false,

                    // Badges - convert string dates to Date objects
                    badges: (apiProfile.badges || []).map(badge => ({
                        ...badge,
                        earnedAt: new Date(badge.earnedAt)
                    })),
                    badgeCounts: apiProfile.badgeCounts || calculateBadgeCounts([]),

                    onboardingCompleted: apiProfile.profile.onboardingCompleted || false,
                    createdAt: new Date(apiProfile.profile.createdAt),
                    updatedAt: new Date(apiProfile.profile.updatedAt),
                    memberSince: new Date(apiProfile.memberSince),
                    isNewMember: apiProfile.isNewMember
                };

                setProfile(travelProfile);
                await loadUserStats(user.id);
            }

            console.log('✅ Profile loaded successfully from API');
        } catch (error: any) {
            console.error('❌ Error loading profile from API:', error);

            if (error.response?.status === 404) {
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
        }
    };

    // Update profile - FIXED: Map selectedModes to travelModes for API
    const updateProfile = async (updates: Partial<TravelProfile>) => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            console.log('💾 Updating profile...', updates);

            if (__DEV__) {
                const updatedProfile: TravelProfile = {
                    ...profile!,
                    ...updates,
                    updatedAt: new Date()
                };

                await AsyncStorage.setItem(DEV_PROFILE_KEY, JSON.stringify(updatedProfile));
                setProfile(updatedProfile);

                if (updates.travelModes) {  // Changed from selectedModes
                    const updatedStats = createMockStats(updatedProfile);
                    setStats(updatedStats);
                    await AsyncStorage.setItem(DEV_STATS_KEY, JSON.stringify(updatedStats));
                }
            } else {
                // No transformation needed anymore
                await apiClient.updateUserProfile(user.id, updates);
                await loadUserProfile();
            }
        } catch (error: any) {
            console.error('❌ Error updating profile:', error);
            throw error;
        }
    };
    // Phase 2: Update extended profile - NOW IMPLEMENTED
    const updateExtendedProfile = async (updates: {
        bio?: string;
        languages?: string[];
        countriesVisited?: string[];
        publicProfile?: boolean;
        showStats?: boolean;
    }) => {
        if (!user?.id || !profile) {
            throw new Error('User not authenticated or profile not loaded');
        }

        try {
            if (__DEV__) {
                const updatedProfile = {
                    ...profile,
                    ...updates,
                    updatedAt: new Date()
                };

                await AsyncStorage.setItem(DEV_PROFILE_KEY, JSON.stringify(updatedProfile));
                setProfile(updatedProfile);

                await checkAndAwardBadges(updatedProfile);
            } else {
                await apiClient.updateExtendedProfile(user.id, updates);
                await loadUserProfile();
            }
        } catch (error) {
            console.error('❌ Error updating extended profile:', error);
            throw error;
        }
    };

    const requestEmailVerification = async () => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            if (__DEV__) {
                // Mock email verification request
                console.log('📧 DEV: Email verification requested');
                // In dev, simulate immediate verification
                setTimeout(async () => {
                    await updateVerificationStatus('email', true);
                }, 2000);
            } else {
                await apiClient.requestEmailVerification();
            }
        } catch (error) {
            console.error('❌ Error requesting email verification:', error);
            throw error;
        }
    };

    const verifyEmail = async (token: string) => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            if (__DEV__) {
                console.log('✅ DEV: Email verified with token:', token);
                await updateVerificationStatus('email', true);
            } else {
                await apiClient.verifyEmail(token);
                await refreshProfile();
            }
        } catch (error) {
            console.error('❌ Error verifying email:', error);
            throw error;
        }
    };

    const requestPhoneVerification = async (phoneNumber: string) => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            if (__DEV__) {
                console.log('📱 DEV: Phone verification requested for:', phoneNumber);
            } else {
                await apiClient.requestPhoneVerification(phoneNumber);
            }
        } catch (error) {
            console.error('❌ Error requesting phone verification:', error);
            throw error;
        }
    };

    const verifyPhone = async (phoneNumber: string, code: string) => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            if (__DEV__) {
                console.log('✅ DEV: Phone verified:', phoneNumber, 'with code:', code);
                await updateVerificationStatus('phone', true);
            } else {
                await apiClient.verifyPhone(phoneNumber, code);
                await refreshProfile();
            }
        } catch (error) {
            console.error('❌ Error verifying phone:', error);
            throw error;
        }
    };

    const verifySocialAccount = async (platform: 'facebook' | 'google', accessToken: string) => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            if (__DEV__) {
                console.log(`✅ DEV: ${platform} account verified`);
                await updateVerificationStatus('social', true);
            } else {
                await apiClient.verifySocialAccount(platform, accessToken);
                await refreshProfile();
            }
        } catch (error) {
            console.error(`❌ Error verifying ${platform} account:`, error);
            throw error;
        }
    };

    const getVerifications = async (): Promise<TrustVerificationResponse[]> => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            if (__DEV__) {
                // Return mock verifications based on current profile state
                const mockVerifications: TrustVerificationResponse[] = [];

                if (profile?.emailVerified) {
                    mockVerifications.push({
                        id: '1',
                        type: 'email',
                        verified: true,
                        metadata: { verified_date: new Date().toISOString() },
                        created_at: new Date().toISOString()
                    });
                }

                if (profile?.phoneVerified) {
                    mockVerifications.push({
                        id: '2',
                        type: 'phone',
                        verified: true,
                        metadata: { verified_date: new Date().toISOString() },
                        created_at: new Date().toISOString()
                    });
                }

                if (profile?.socialConnected) {
                    mockVerifications.push({
                        id: '3',
                        type: 'social_google',
                        verified: true,
                        metadata: { platform: 'google', verified_date: new Date().toISOString() },
                        created_at: new Date().toISOString()
                    });
                }

                return mockVerifications;
            } else {
                const response = await apiClient.getMyVerifications();
                return response.data;
            }
        } catch (error) {
            console.error('❌ Error getting verifications:', error);
            return [];
        }
    };

    const refreshVerifications = async () => {
        try {
            const verifications = await getVerifications();

            if (profile) {
                const updatedProfile = {
                    ...profile,
                    emailVerified: verifications.some(v => v.type === 'email' && v.verified),
                    phoneVerified: verifications.some(v => v.type === 'phone' && v.verified),
                    socialConnected: verifications.some(v => v.type.startsWith('social_') && v.verified),
                    communityVouches: verifications.filter(v => v.type === 'community_vouch' && v.verified).length
                };

                setProfile(updatedProfile);

                if (__DEV__) {
                    await AsyncStorage.setItem(DEV_PROFILE_KEY, JSON.stringify(updatedProfile));
                }
            }
        } catch (error) {
            console.error('❌ Error refreshing verifications:', error);
        }
    };

    // Helper function for dev mode verification updates
    const updateVerificationStatus = async (type: 'email' | 'phone' | 'social', verified: boolean) => {
        if (!profile) return;

        const updatedProfile = {
            ...profile,
            emailVerified: type === 'email' ? verified : profile.emailVerified,
            phoneVerified: type === 'phone' ? verified : profile.phoneVerified,
            socialConnected: type === 'social' ? verified : profile.socialConnected,
            updatedAt: new Date()
        };

        // Recalculate trust score
        const newTrustScore = await calculateTrustScore();
        updatedProfile.trustScore = newTrustScore;

        setProfile(updatedProfile);

        if (__DEV__) {
            await AsyncStorage.setItem(DEV_PROFILE_KEY, JSON.stringify(updatedProfile));
        }

        // Check for new trust badges
        await checkTrustBadges(updatedProfile);
    };

    // Add trust badge checking
    const checkTrustBadges = async (updatedProfile: TravelProfile) => {
        if (updatedProfile.emailVerified) {
            await awardBadge('email_verified');
        }
        if (updatedProfile.phoneVerified) {
            await awardBadge('phone_verified');
        }
        if (updatedProfile.socialConnected) {
            await awardBadge('social_connected');
        }
        if (updatedProfile.communityVouches >= 5) {
            await awardBadge('trusted_by_community');
        }
    };



    // Calculate trust score - NOW IMPLEMENTED
    const calculateTrustScore = async (): Promise<number> => {
        if (!profile) return 0;

        let score = 0;

        // Verification points (40 total)
        if (profile.emailVerified) score += 15;
        if (profile.phoneVerified) score += 15;
        if (profile.socialConnected) score += 10;

        // Community engagement (40 total)
        score += Math.min(profile.helpfulReviews * 2, 20);
        score += Math.min(profile.spotsAdded * 3, 15);
        score += Math.min(profile.reviewerRating * 2, 10);

        // Time-based trust (20 total)
        const membershipDays = Math.floor(
            (Date.now() - profile.memberSince.getTime()) / (1000 * 60 * 60 * 24)
        );
        score += Math.min(membershipDays / 30, 10);
        score += Math.min(profile.communityVouches * 2, 10);

        return Math.min(Math.round(score), 100);
    };

    // Badge management - NOW IMPLEMENTED
    const refreshBadges = async () => {
        if (__DEV__) {
            const badges = await AsyncStorage.getItem(DEV_BADGES_KEY);
            if (badges && profile) {
                const parsedBadges = JSON.parse(badges).map((badge: any) => ({
                    ...badge,
                    earnedAt: new Date(badge.earnedAt)
                }));
                const updatedProfile = {
                    ...profile,
                    badges: parsedBadges,
                    badgeCounts: calculateBadgeCounts(parsedBadges)
                };
                setProfile(updatedProfile);
            }
        } else if (user?.id) {
            await loadUserProfile();
        }
    };

    const awardBadge = async (badgeKey: string) => {
        if (!profile) return;

        const existingBadge = profile.badges.find(b => b.key === badgeKey);
        if (existingBadge) return;

        const newBadge: Badge = {
            id: Date.now().toString(),
            key: badgeKey,
            name: getBadgeName(badgeKey),
            description: getBadgeDescription(badgeKey),
            emoji: getBadgeEmoji(badgeKey),
            category: getBadgeCategory(badgeKey),
            level: getBadgeLevel(badgeKey),
            earnedAt: new Date().toISOString()
        };

        const updatedBadges = [...profile.badges, { ...newBadge, earnedAt: new Date(newBadge.earnedAt) }];
        const updatedProfile = {
            ...profile,
            badges: updatedBadges,
            badgeCounts: calculateBadgeCounts(updatedBadges)
        };

        setProfile(updatedProfile);

        if (__DEV__) {
            await AsyncStorage.setItem(DEV_BADGES_KEY, JSON.stringify(updatedBadges.map(b => ({
                ...b,
                earnedAt: b.earnedAt.toISOString()
            }))));
            await AsyncStorage.setItem(DEV_PROFILE_KEY, JSON.stringify({
                ...updatedProfile,
                badges: updatedProfile.badges.map(b => ({
                    ...b,
                    earnedAt: b.earnedAt.toISOString()
                }))
            }));
        }
    };

    // Check and award badges based on profile updates
    const checkAndAwardBadges = async (updatedProfile: TravelProfile) => {
        const newBadges: string[] = [];

        if (updatedProfile.countriesVisited.length >= 3) {
            newBadges.push('country_explorer_bronze');
        }
        if (updatedProfile.countriesVisited.length >= 10) {
            newBadges.push('country_explorer_silver');
        }
        if (updatedProfile.countriesVisited.length >= 25) {
            newBadges.push('country_explorer_gold');
        }

        if (updatedProfile.travelModes.length >= 3) {  // Changed from selectedModes
            newBadges.push('multimodal_master');
        }

        if (updatedProfile.selectedModes.length >= 3) {
            newBadges.push('multimodal_master');
        }

        for (const badgeKey of newBadges) {
            await awardBadge(badgeKey);
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

    const clearDevProfile = async () => {
        if (__DEV__) {
            console.log('🗑️ Clearing development profile...');
            await AsyncStorage.multiRemove([DEV_PROFILE_KEY, DEV_STATS_KEY, DEV_BADGES_KEY]);
            setProfile(null);
            setStats(null);
            setError('onboarding_required');
            console.log('✅ Development profile cleared');
        }
    };

    // Helper functions
    const calculateBadgeCounts = (badges: Badge[]): BadgeCounts => {
        return {
            total: badges.length,
            trust: badges.filter(b => b.category === 'trust').length,
            reviewer: badges.filter(b => b.category === 'reviewer').length,
            contributor: badges.filter(b => b.category === 'contributor').length,
            explorer: badges.filter(b => b.category === 'explorer').length,
            community: badges.filter(b => b.category === 'community').length,
            special: badges.filter(b => b.category === 'special').length,
            gold: badges.filter(b => b.level === 'gold').length,
            silver: badges.filter(b => b.level === 'silver').length,
            bronze: badges.filter(b => b.level === 'bronze').length,
        };
    };

    const createMockStats = (profile: TravelProfile): UserStats => {
        const stats: UserStats = {};

        if (profile.travelModes.includes(TransportMode.HITCHHIKING)) {  // Changed from selectedModes
            stats.hitchhiking = {
                totalRides: 12,
                totalDistance: 2400,
                averageRating: 4.7,
                lastRide: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            };
        }

        if (profile.travelModes.includes(TransportMode.CYCLING)) {  // Changed from selectedModes
            stats.cycling = {
                totalDistance: 1200,
                totalRoutes: 8,
                lastRide: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            };
        }

        return stats;
    };

    const convertStatsDates = (stats: UserStats) => {
        if (stats.hitchhiking?.lastRide) {
            stats.hitchhiking.lastRide = new Date(stats.hitchhiking.lastRide);
        }
        if (stats.cycling?.lastRide) {
            stats.cycling.lastRide = new Date(stats.cycling.lastRide);
        }
    };

    const isNewMember = (memberSince: Date): boolean => {
        const daysSince = Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24));
        return daysSince < 30;
    };

    // Badge helper functions
    const getBadgeName = (key: string): string => {
        const names: Record<string, string> = {
            email_verified: 'Email Verified',
            first_reviewer: 'First Reviewer',
            helpful_reviewer_bronze: 'Helpful Reviewer',
            country_explorer_bronze: 'Country Explorer',
            polyglot: 'Polyglot',
            multimodal_master: 'Multi-Modal Master',
        };
        return names[key] || key;
    };

    const getBadgeDescription = (key: string): string => {
        const descriptions: Record<string, string> = {
            email_verified: 'Verified email address',
            first_reviewer: 'Left first helpful review',
            helpful_reviewer_bronze: 'Left 5+ helpful reviews',
            country_explorer_bronze: 'Visited 3+ countries',
            polyglot: 'Speaks 3+ languages',
            multimodal_master: 'Uses 3+ transport modes',
        };
        return descriptions[key] || 'Achievement unlocked!';
    };

    const getBadgeEmoji = (key: string): string => {
        const emojis: Record<string, string> = {
            email_verified: '✅',
            first_reviewer: '📝',
            helpful_reviewer_bronze: '⭐',
            country_explorer_bronze: '🌍',
            polyglot: '🗣️',
            multimodal_master: '🚀',
        };
        return emojis[key] || '🏆';
    };

    const getBadgeCategory = (key: string): Badge['category'] => {
        if (key.includes('verified') || key.includes('trust')) return 'trust';
        if (key.includes('reviewer')) return 'reviewer';
        if (key.includes('contributor') || key.includes('spot')) return 'contributor';
        if (key.includes('explorer') || key.includes('country') || key.includes('polyglot') || key.includes('multimodal')) return 'explorer';
        if (key.includes('community')) return 'community';
        return 'special';
    };

    const getBadgeLevel = (key: string): Badge['level'] => {
        if (key.includes('gold')) return 'gold';
        if (key.includes('silver')) return 'silver';
        if (key.includes('bronze')) return 'bronze';
        return null;
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
            calculateTrustScore,
            updateExtendedProfile,
            refreshBadges,
            awardBadge,
            clearDevProfile,
            requestEmailVerification,
            verifyEmail,
            requestPhoneVerification,
            verifyPhone,
            verifySocialAccount,
            getVerifications,
            refreshVerifications,
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