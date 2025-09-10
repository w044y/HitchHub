// app/types/trip.ts - Complete with all missing types

export enum TripPrivacyLevel {
    PRIVATE_DRAFT = 'private_draft',
    SHARED_WITH_FRIENDS = 'shared_with_friends',
    COMMUNITY_PREVIEW = 'community_preview',
    PUBLIC_BLUEPRINT = 'public_blueprint'
}

export enum TripPhase {
    PLANNING = 'planning',
    LIVE = 'live',
    COMPLETED = 'completed'
}

// ADD MISSING ENUMS
export enum TripStatus {
    PLANNED = 'planned',
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum TripSpotStatus {
    PLANNED = 'planned',
    CURRENT = 'current',
    VISITED = 'visited',
    SKIPPED = 'skipped',
    FAILED = 'failed'
}

// EXISTING INTERFACES
export interface RealityEntry {
    id: string;
    planned_spot_id?: string;
    actual_location: {
        latitude: number;
        longitude: number;
        name: string;
        address?: string;
    };
    planned_vs_reality: 'matched' | 'different' | 'spontaneous';
    experience_rating: 1 | 2 | 3 | 4 | 5;
    worth_it_rating: 'skip' | 'ok' | 'worth_it' | 'must_see';
    photos: TripPhoto[];
    notes: string;
    wish_i_knew: string;
    timestamp: string;
    added_by: string;
}

export interface TripPhoto {
    id: string;
    url: string;
    caption?: string;
    gps_location: {
        latitude: number;
        longitude: number;
    };
    timestamp: string;
    is_cover_photo: boolean;
    added_by: string;
}

export interface DailyUpdate {
    id: string;
    date: string;
    mood_rating: 1 | 2 | 3 | 4 | 5;
    highlight: string;
    challenge: string;
    discovery: string;
    photos: string[];
    created_at: string;
    is_public: boolean;
}

// ADD MISSING INTERFACES
export interface Trip {
    id: string;
    title: string;
    description?: string;
    start_location: {
        latitude: number;
        longitude: number;
    };
    end_location: {
        latitude: number;
        longitude: number;
    };
    start_address: string;
    end_address: string;
    status: TripStatus;
    is_public: boolean;
    estimated_distance?: number;
    actual_distance?: number;
    carbon_saved?: number;
    travel_modes: string[];
    total_rides?: number;
    average_wait_time?: number;
    countries_visited: string[];
    cities_visited: string[];
    notes?: string;
    tags: string[];
    user_id: string;
    created_at: string;
    updated_at: string;
    trip_spots:TripSpot[]
    planned_start_date?: string;
    actual_start_date?: string;
    planned_end_date?: string;
    actual_end_date?: string;
    user?: {
        id: string;
        display_name: string;
        username: string;
    };
}

export interface TripSpot {
    id: string;
    order_index: number;
    status: TripSpotStatus;
    arrived_at?: string;
    departed_at?: string;
    wait_time_hours?: number;
    got_ride: boolean;
    ride_details?: string;
    notes?: string;
    photos_taken: string[];
    safety_experience?: number;
    effectiveness_rating?: number;
    created_at: string;
    trip_id: string;
    spot_id: string;
    spot?: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
        spot_type: string;
    };
}

export interface CreateTripRequest {
    title: string;
    description?: string;
    start_address: string;
    end_address: string;
    start_latitude: number;
    start_longitude: number;
    end_latitude: number;
    end_longitude: number;
    planned_start_date?: string;
    estimated_distance?: number;
    travel_modes?: string[];
    tags?: string[];
    is_public?: boolean;
    notes?: string;
}

export interface EnhancedTrip {
    id: string;
    title: string;
    description?: string;
    privacy_level: TripPrivacyLevel;
    phase: TripPhase;
    status: TripStatus;

    // Location data
    start_location: {
        latitude: number;
        longitude: number;
    };
    end_location: {
        latitude: number;
        longitude: number;
    };
    start_address: string;
    end_address: string;

    // Planning phase
    intention_notes?: string;
    research_notes: string[];
    dream_spots: string[];
    confirmed_spots: string[];

    // Live phase
    reality_tracking: RealityEntry[];
    daily_updates: DailyUpdate[];

    // Social features
    forked_from?: string;
    fork_count: number;
    view_count: number;
    helpful_votes: number;

    // Metadata
    travel_modes: string[];
    tags: string[];
    user_id: string;
    user: {
        id: string;
        display_name: string;
        username: string;
    };
    created_at: string;
    updated_at: string;

    // Additional fields from Trip
    is_public: boolean;
    estimated_distance?: number;
    actual_distance?: number;
    planned_start_date?: string;
    actual_start_date?: string;
    planned_end_date?: string;
    actual_end_date?: string;
}

