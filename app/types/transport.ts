// app/types/transport.ts - Create this file (move enums here)
export enum TransportMode {
    HITCHHIKING = 'hitchhiking',
    CYCLING = 'cycling',
    VAN_LIFE = 'van_life',
    WALKING = 'walking',
    ALL = 'all',
}

export const TRANSPORT_MODE_LABELS = {
    [TransportMode.HITCHHIKING]: 'Hitchhiking',
    [TransportMode.CYCLING]: 'Cycling',
    [TransportMode.VAN_LIFE]: 'Van Life',
    [TransportMode.WALKING]: 'Walking',
    [TransportMode.ALL]: 'all',
};

export const TRANSPORT_MODE_EMOJIS = {
    [TransportMode.HITCHHIKING]: '👍',
    [TransportMode.CYCLING]: '🚲',
    [TransportMode.VAN_LIFE]: '🚐',
    [TransportMode.WALKING]: '🚶',
    [TransportMode.ALL]: "🚶🚶"
};

// app/types/transport.ts - Fixed HitchhikingSpot interface
export interface HitchhikingSpot {
    id: string;
    name: string;
    description: string;
    latitude: number;        // FIXED: Direct properties, not nested
    longitude: number;       // FIXED: Direct properties, not nested
    spot_type: string;       // FIXED: Match API property name
    safety_rating: number;   // FIXED: Match API property name
    overall_rating: number;  // FIXED: Match API property name
    is_verified: boolean;    // FIXED: Match API property name
    created_by: string;      // FIXED: This will be mapped from created_by.display_name
    created_at?: string;     // FIXED: Optional, from API

    // Optional properties for map display
    transportModes?: TransportMode[];
    modeRatings?: {
        [key: string]: {
            safety: number;
            effectiveness: number;
            review_count: number;
            avg_wait_time?: number;
            legal_status?: number;
            facilities?: number;
            accessibility?: number;
        };
    };
    totalReviews?: number;
    facilities?: string[];
    tips?: string;
    accessibility_info?: string;

    // Legacy support (will be computed from lat/lng if needed)
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    type?: 'rest_stop' | 'gas_station' | 'bridge' | 'highway_entrance' | 'town_center' | 'other';
    rating?: number;
    safetyRating?: 'high' | 'medium' | 'low';
    addedBy?: string;
    lastUpdated?: string;
    verified?: boolean;
}