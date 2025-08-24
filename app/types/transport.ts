// app/types/transport.ts - Create this new file
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

export interface Review {
    id: string;
    transport_mode: TransportMode;
    safety_rating: number;
    effectiveness_rating: number;
    overall_rating: number;
    comment?: string;
    wait_time_minutes?: number;
    legal_status?: number;
    facility_rating?: number;
    accessibility_rating?: number;
    location_verified: boolean;
    distance_from_spot?: number;
    context?: any;
    created_at: string;
    user: {
        id: string;
        display_name: string;
        username: string;
        safety_rating: number;
    };
}

export interface ReviewSummary {
    total_reviews: number;
    overall_safety_rating: number;
    overall_rating: number;
    last_reviewed: string | null;
    mode_ratings: {
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
    transport_modes_available: TransportMode[];
}