// app/types/profile.ts - ADD MISSING BADGE TYPES
import { TransportMode } from './transport';

// Add the Badge interface
export interface Badge {
    id: string;
    key: string;
    name: string;
    description: string;
    emoji: string;
    category: string;
    level?: string;
    earnedAt: string;
}

// Add the BadgeCounts interface
export interface BadgeCounts {
    total: number;
    trust: number;
    reviewer: number;
    contributor: number;
    explorer: number;
    community: number;
    special: number;
    gold: number;
    silver: number;
    bronze: number;
}

export interface TravelProfile {
    userId: string;
    travelModes: TransportMode[];
    primaryMode: TransportMode;
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
    safetyPriority: 'high' | 'medium' | 'low';
    showAllSpots: boolean;

    // Phase 1: Trust & Credibility
    trustScore: number;
    emailVerified: boolean;
    phoneVerified: boolean;
    socialConnected: boolean;
    communityVouches: number;
    totalReviews: number;
    helpfulReviews: number;
    reviewerRating: number;
    spotsAdded: number;
    verifiedSpots: number;

    // Phase 2: Extended Profile
    bio: string;
    languages: string[];
    countriesVisited: string[];
    publicProfile: boolean;
    showStats: boolean;

    // Badges
    badges: Badge[];
    badgeCounts: BadgeCounts;

    // Metadata
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    memberSince: Date;
    isNewMember: boolean;
}

export interface UserStats {
    totalTrips: number;
    totalDistance: number;
    countriesVisited: number;
    carbonSaved: number;

    hitchhiking?: {
        totalRides: number;
        totalDistance: number;
        averageRating: number;
        lastRide?: Date;
    };
    cycling?: {
        totalDistance: number;
        totalRoutes: number;
        lastRide?: Date;
    };
    vanCamping?: {
        totalNights: number;
        favoriteSpots: number;
        lastStay?: Date;
    };
    walking?: {
        totalDistance: number;
        citiesExplored: number;
        lastWalk?: Date;
    };
}