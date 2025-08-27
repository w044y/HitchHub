// app/types/profile.ts - Update with mode filtering
import { TransportMode } from './transport';

export interface TravelProfile {
    userId: string;

    // What modes the user is interested in
    selectedModes: TransportMode[];
    primaryMode: TransportMode; // Their main travel method

    // Settings
    showAllSpots: boolean; // Override to see everything
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
    safetyPriority: 'high' | 'medium' | 'low';

    // Meta
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
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