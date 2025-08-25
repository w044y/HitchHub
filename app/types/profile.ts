// app/types/profile.ts
import { TransportMode } from './transport';

export interface TravelProfile {
    userId: string;
    travelModes: TransportMode[];
    preferences: {
        primaryMode: TransportMode;
        experienceLevel: 'beginner' | 'intermediate' | 'expert';
        safetyPriority: 'high' | 'medium' | 'low';
    };
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserStats {
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
    vanLife?: {
        vehicleInfo?: string;
        currentLocation?: string;
        legalStatus: boolean;
        daysOnRoad?: number;
    };
    walking?: {
        totalDistance: number;
        citiesExplored: number;
        lastWalk?: Date;
    };
}