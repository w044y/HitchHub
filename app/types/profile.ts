// app/types/profile.ts - Update with mode filtering
import { TransportMode } from './transport';
import {Badge, BadgeCounts} from "@/app/services/api";

interface TravelProfile {
    userId: string;
    travelModes: TransportMode[];  // Use this consistently
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
    bio?: string;
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
    // Keep existing stats structure
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