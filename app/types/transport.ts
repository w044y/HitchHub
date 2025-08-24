// app/types/transport.ts - Create this file (move enums here)
export enum TransportMode {
    HITCHHIKING = 'hitchhiking',
    CYCLING = 'cycling',
    VAN_LIFE = 'van_life',
    WALKING = 'walking'
}

export const TRANSPORT_MODE_LABELS = {
    [TransportMode.HITCHHIKING]: 'Hitchhiking',
    [TransportMode.CYCLING]: 'Cycling',
    [TransportMode.VAN_LIFE]: 'Van Life',
    [TransportMode.WALKING]: 'Walking'
};

export const TRANSPORT_MODE_EMOJIS = {
    [TransportMode.HITCHHIKING]: '👍',
    [TransportMode.CYCLING]: '🚲',
    [TransportMode.VAN_LIFE]: '🚐',
    [TransportMode.WALKING]: '🚶'
};

export interface HitchhikingSpot {
    id: string;
    name: string;
    type: 'rest_stop' | 'gas_station' | 'bridge' | 'highway_entrance' | 'town_center' | 'other';
    coordinates: {
        latitude: number;
        longitude: number;
    };
    rating: number;
    safetyRating: 'high' | 'medium' | 'low';
    description: string;
    addedBy: string;
    lastUpdated: string;
    verified: boolean;
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
}