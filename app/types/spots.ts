// app/types/spots.ts
import { TransportMode } from './transport';

export interface ModeData {
    suitable: boolean;
    suitabilityScore: 1 | 2 | 3 | 4 | 5; // How good is this spot for this mode
    lastUpdated?: Date;
}

export interface HitchhikingModeData extends ModeData {
    visibility: 'excellent' | 'good' | 'fair' | 'poor';
    avgWaitTime?: number; // minutes
    safetyNotes?: string;
    trafficFlow: 'high' | 'medium' | 'low';
}

export interface CyclingModeData extends ModeData {
    bikeParking: boolean;
    elevation?: number; // meters above sea level
    bikeFacilities: string[]; // ['repair_station', 'water', 'shelter']
    roadSafety: 'high' | 'medium' | 'low';
}

export interface VanCampingModeData extends ModeData {
    overnightLegal: boolean;
    vehicleAccess: 'excellent' | 'good' | 'difficult' | 'impossible';
    maxVehicleSize?: string; // '7m', '10m', 'any'
    facilities: string[]; // ['dump_station', 'water', 'power']
    noiseLevel: 'quiet' | 'moderate' | 'loud';
}

export interface WalkingModeData extends ModeData {
    trailAccess: boolean;
    accessibility: 'full' | 'partial' | 'limited';
    urbanConnection: boolean;
    lighting: 'good' | 'fair' | 'poor';
}

export interface MultiModalSpot {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;

    // Core classification
    primaryType: 'hitchhiking' | 'cycling' | 'van_camping' | 'walking' | 'universal';

    // Multi-mode support
    modes: {
        hitchhiking?: HitchhikingModeData;
        cycling?: CyclingModeData;
        van_camping?: VanCampingModeData;
        walking?: WalkingModeData;
    };

    // General info
    facilities: string[];
    photos: string[];
    verified: boolean;
    overallRating: number;
    totalReviews: number;

    // Meta
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}