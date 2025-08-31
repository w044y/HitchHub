// app/services/api.ts - Complete API Client with ProfileContext support
import { TransportMode } from '@/app/types/transport';

// API Response Types
interface ApiResponse<T = any> {
    data: T;
    message?: string;
    error?: string;
    statusCode?: number;
}

interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
    pagination?: {
        limit: number;
        offset: number;
        total: number;
    };
}
interface TrustVerificationRequest {
    type: 'email' | 'phone' | 'social_facebook' | 'social_google' | 'community_vouch';
    metadata?: {
        platform?: string;
        verified_by?: string;
        verification_date?: string;
        [key: string]: any;
    };
}

export interface TrustVerificationResponse {
    id: string;
    type: string;
    verified: boolean;
    metadata: any;
    created_at: string;
}
// Profile-related Types
interface UserProfileResponse {
    userId: string;
    travelModes: TransportMode[];
    primaryMode: TransportMode;
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
    safetyPriority: 'high' | 'medium' | 'low';
    showAllSpots: boolean;

    // Phase 1: Trust & Credibility
    emailVerified: boolean;
    phoneVerified: boolean;
    socialConnected: boolean;
    communityVouches: number;
    totalReviews: number;
    helpfulReviews: number;
    reviewerRating: number;
    spotsAdded: number;
    verifiedSpots: number;

    // Phase 2: Personality & Gamification
    bio?: string;
    languages: string[];
    countriesVisited: string[];
    publicProfile: boolean;
    showStats: boolean;

    onboardingCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CompleteUserProfileResponse {
    profile: UserProfileResponse;
    trustScore: number;
    badges: Badge[];
    badgeCounts: BadgeCounts;
    memberSince: string;
    isNewMember: boolean;
}

interface Badge {
    id: string;
    key: string;
    name: string;
    description: string;
    emoji: string;
    category: string;
    level?: string;
    earnedAt: string;
}

interface BadgeCounts {
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

interface UserStatsResponse {
    hitchhiking?: {
        totalRides: number;
        totalDistance: number;
        averageRating: number;
        lastRide?: string;
    };
    cycling?: {
        totalDistance: number;
        totalRoutes: number;
        lastRide?: string;
    };
    vanCamping?: {
        totalNights: number;
        favoriteSpots: number;
        lastStay?: string;
    };
    walking?: {
        totalDistance: number;
        citiesExplored: number;
        lastWalk?: string;
    };
}

// Auth Types
interface AuthResponse {
    user: any;
    accessToken: string;
    message: string;
}

interface MagicLinkResponse {
    message: string;
    email: string;
}

// Spot Types
interface SpotResponse {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    spot_type: string;
    transport_modes: TransportMode[];
    safety_rating: number;
    overall_rating: number;
    mode_ratings: any;
    total_reviews: number;
    last_reviewed?: string;
    is_verified: boolean;
    photo_urls: string[];
    facilities: string[];
    tips?: string;
    accessibility_info?: string;
    created_by: {
        id: string;
        display_name: string;
        username: string;
        safety_rating: number;
    };
    created_at: string;
}

interface CreateSpotRequest {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    spot_type: string;
    tips?: string;
    accessibility_info?: string;
    facilities?: string[];
    created_by_id?: string;
}

interface SpotReviewRequest {
    user_id: string;
    transport_mode: TransportMode;
    safety_rating: number;
    effectiveness_rating: number;
    overall_rating: number;
    comment?: string;
    wait_time_minutes?: number;
    legal_status?: number;
    facility_rating?: number;
    accessibility_rating?: number;
    review_latitude?: number;
    review_longitude?: number;
    photos?: string[];
    context?: any;
}

interface SpotReviewResponse {
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
    created_at: string;
    user: {
        display_name: string;
        username: string;
        safety_rating: number;
    };
}

class ApiClient {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string = 'http://localhost:3000/api/v1') {
        this.baseURL = baseURL;

        if (__DEV__) {
            console.log('🔧 ApiClient initialized with base URL:', this.baseURL);
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (__DEV__) {
            console.log('🔑 API token set:', token ? 'Token available' : 'No token');
        }
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async request<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        if (__DEV__) {
            console.log(`🌐 API ${config.method || 'GET'} ${url}`,
                config.body ? JSON.parse(config.body as string) : '');
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            if (__DEV__) {
                console.log(`✅ API Response ${response.status}:`, data);
            }

            return data;
        } catch (error) {
            console.error(`❌ API Error ${config.method || 'GET'} ${url}:`, error);
            throw error;
        }
    }

    // Auth Methods
    async sendMagicLink(email: string): Promise<ApiResponse<MagicLinkResponse>> {
        return this.request<MagicLinkResponse>('/auth/magic-link', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async verifyMagicLink(token: string, email: string): Promise<ApiResponse<AuthResponse>> {
        return this.request<AuthResponse>('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ token, email }),
        });
    }

    async getCurrentUser(): Promise<ApiResponse<any>> {
        return this.request('/auth/me');
    }

    async logout(): Promise<ApiResponse<{ message: string }>> {
        return this.request('/auth/logout', {
            method: 'POST',
        });
    }

    // User Profile Methods - Phase 1 & 2
    async getUserProfile(userId: string): Promise<ApiResponse<UserProfileResponse>> {
        return this.request<UserProfileResponse>(`/users/${userId}/profile`);
    }

    async getMyProfile(): Promise<ApiResponse<UserProfileResponse>> {
        return this.request<UserProfileResponse>('/users/me/profile');
    }

    async getUserCompleteProfile(userId: string): Promise<ApiResponse<CompleteUserProfileResponse>> {
        return this.request<CompleteUserProfileResponse>(`/users/${userId}/complete-profile`);
    }

    async updateUserProfile(userId: string, updates: Partial<UserProfileResponse>): Promise<ApiResponse<UserProfileResponse>> {
        return this.request<UserProfileResponse>('/users/me/profile', {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async createUserProfile(profileData: Partial<UserProfileResponse>): Promise<ApiResponse<UserProfileResponse>> {
        return this.request<UserProfileResponse>('/users/me/profile', {
            method: 'POST',
            body: JSON.stringify(profileData),
        });
    }

    async deleteUserProfile(): Promise<ApiResponse<{ message: string }>> {
        return this.request('/users/me/profile', {
            method: 'DELETE',
        });
    }

    // Phase 2: Extended Profile Methods
    async updateExtendedProfile(userId: string, updates: {
        bio?: string;
        languages?: string[];
        countriesVisited?: string[];
        publicProfile?: boolean;
        showStats?: boolean;
    }): Promise<ApiResponse<UserProfileResponse>> {
        return this.request<UserProfileResponse>('/users/me/profile/extended', {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    // Trust & Verification Methods
    async addVerification(type: string, metadata?: any): Promise<ApiResponse<{ message: string }>> {
        return this.request('/users/me/verify', {
            method: 'POST',
            body: JSON.stringify({ type, metadata }),
        });
    }

    async refreshProfileStats(): Promise<ApiResponse<{ message: string }>> {
        return this.request('/users/me/stats/refresh', {
            method: 'POST',
        });
    }

    // Badge Methods
    async getUserBadges(userId: string): Promise<ApiResponse<Badge[]>> {
        return this.request<Badge[]>(`/users/${userId}/badges`);
    }

    // User Stats Methods
    async getUserStats(userId: string): Promise<ApiResponse<UserStatsResponse>> {
        return this.request<UserStatsResponse>(`/users/${userId}/stats`);
    }

    // Smart Filtering Methods
    async getSpotsFiltered(filters: {
        transportModes?: TransportMode[];
        userId?: string;
        latitude?: number;
        longitude?: number;
        radius?: number;
        limit?: number;
        offset?: number;
        spot_type?: string;
        minRating?: number;
        safetyPriority?: 'high' | 'medium' | 'low';
        personalized?: boolean;
    }): Promise<ApiResponse<SpotResponse[]>> {
        const searchParams = new URLSearchParams();

        if (filters.transportModes?.length) {
            searchParams.append('transport_modes', filters.transportModes.join(','));
        }
        if (filters.latitude) searchParams.append('latitude', filters.latitude.toString());
        if (filters.longitude) searchParams.append('longitude', filters.longitude.toString());
        if (filters.radius) searchParams.append('radius', filters.radius.toString());
        if (filters.limit) searchParams.append('limit', filters.limit.toString());
        if (filters.offset) searchParams.append('offset', filters.offset.toString());
        if (filters.spot_type) searchParams.append('spot_type', filters.spot_type.toString());
        if (filters.minRating) searchParams.append('min_rating', filters.minRating.toString());
        if (filters.safetyPriority) searchParams.append('safety_priority', filters.safetyPriority);

        const queryString = searchParams.toString();
        return this.request<SpotResponse[]>(`/spots/filtered${queryString ? `?${queryString}` : ''}`);
    }

    async getSpotsByTransportModeQuality(
        mode: TransportMode,
        filters?: {
            latitude?: number;
            longitude?: number;
            radius?: number;
            minEffectiveness?: number;
            limit?: number;
            offset?: number;
        }
    ): Promise<ApiResponse<SpotResponse[]>> {
        const searchParams = new URLSearchParams();

        if (filters?.latitude) searchParams.append('latitude', filters.latitude.toString());
        if (filters?.longitude) searchParams.append('longitude', filters.longitude.toString());
        if (filters?.radius) searchParams.append('radius', filters.radius.toString());
        if (filters?.minEffectiveness) searchParams.append('min_effectiveness', filters.minEffectiveness.toString());
        if (filters?.limit) searchParams.append('limit', filters.limit.toString());
        if (filters?.offset) searchParams.append('offset', filters.offset.toString());

        const queryString = searchParams.toString();
        return this.request<SpotResponse[]>(`/spots/for-mode/${mode}${queryString ? `?${queryString}` : ''}`);
    }

    // Standard Spot Methods
    async getSpots(filters?: {
        limit?: number;
        offset?: number;
        spot_type?: string;
        is_verified?: boolean;
        min_rating?: number;
    }): Promise<PaginatedResponse<SpotResponse>> {
        const searchParams = new URLSearchParams();

        if (filters?.limit) searchParams.append('limit', filters.limit.toString());
        if (filters?.offset) searchParams.append('offset', filters.offset.toString());
        if (filters?.spot_type) searchParams.append('spot_type', filters.spot_type);
        if (filters?.is_verified !== undefined) searchParams.append('is_verified', filters.is_verified.toString());
        if (filters?.min_rating) searchParams.append('min_rating', filters.min_rating.toString());

        const queryString = searchParams.toString();
        return this.request<SpotResponse[]>(`/spots${queryString ? `?${queryString}` : ''}`);
    }

    async getSpotById(id: string): Promise<ApiResponse<SpotResponse>> {
        return this.request<SpotResponse>(`/spots/${id}`);
    }

    async getNearbySpots(
        latitude: number,
        longitude: number,
        radius: number = 10,
        limit: number = 20
    ): Promise<ApiResponse<SpotResponse[]>> {
        const searchParams = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            radius: radius.toString(),
            limit: limit.toString(),
        });

        return this.request<SpotResponse[]>(`/spots/nearby?${searchParams}`);
    }

    async createSpot(spotData: CreateSpotRequest): Promise<ApiResponse<SpotResponse>> {
        return this.request<SpotResponse>('/spots', {
            method: 'POST',
            body: JSON.stringify(spotData),
        });
    }

    async updateSpot(id: string, updates: Partial<CreateSpotRequest>): Promise<ApiResponse<SpotResponse>> {
        return this.request<SpotResponse>(`/spots/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteSpot(id: string): Promise<ApiResponse<{ message: string }>> {
        return this.request(`/spots/${id}`, {
            method: 'DELETE',
        });
    }

    // Spot Review Methods
    async addSpotReview(spotId: string, reviewData: SpotReviewRequest): Promise<ApiResponse<SpotReviewResponse>> {
        return this.request<SpotReviewResponse>(`/spots/${spotId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    }

    async getSpotReviews(spotId: string, filters?: {
        transport_mode?: TransportMode;
        limit?: number;
        offset?: number;
        sort_by?: 'newest' | 'oldest' | 'most_helpful';
    }): Promise<ApiResponse<SpotReviewResponse[]>> {
        const searchParams = new URLSearchParams();

        if (filters?.transport_mode) searchParams.append('transport_mode', filters.transport_mode);
        if (filters?.limit) searchParams.append('limit', filters.limit.toString());
        if (filters?.offset) searchParams.append('offset', filters.offset.toString());
        if (filters?.sort_by) searchParams.append('sort_by', filters.sort_by);

        const queryString = searchParams.toString();
        return this.request<SpotReviewResponse[]>(`/spots/${spotId}/reviews${queryString ? `?${queryString}` : ''}`);
    }

    async getSpotReviewSummary(spotId: string): Promise<ApiResponse<{
        total_reviews: number;
        overall_safety_rating: number;
        overall_rating: number;
        last_reviewed?: string;
        mode_ratings: any;
        transport_modes_available: TransportMode[];
    }>> {
        return this.request(`/spots/${spotId}/reviews/summary`);
    }

    // User Filter Preferences (for smart filtering)
    async getUserFilterPreferences(userId: string): Promise<{
        travelModes: TransportMode[];
        showAllSpots: boolean;
        safetyPriority: 'high' | 'medium' | 'low';
        experienceLevel: 'beginner' | 'intermediate' | 'expert';
    }> {
        try {
            const response = await this.getUserProfile(userId);
            return {
                travelModes: response.data.travelModes,
                showAllSpots: response.data.showAllSpots,
                safetyPriority: response.data.safetyPriority,
                experienceLevel: response.data.experienceLevel,
            };
        } catch (error) {
            // Return defaults if profile not found
            return {
                travelModes: [TransportMode.HITCHHIKING],
                showAllSpots: false,
                safetyPriority: 'high',
                experienceLevel: 'beginner',
            };
        }
    }

    async addTrustVerification(type: string, metadata?: any): Promise<ApiResponse<{ message: string }>> {
        return this.request('/users/me/verify', {
            method: 'POST',
            body: JSON.stringify({ type, metadata }),
        });
    }

    async getUserVerifications(userId: string): Promise<ApiResponse<TrustVerificationResponse[]>> {
        return this.request<TrustVerificationResponse[]>(`/users/${userId}/verifications`);
    }

    async getMyVerifications(): Promise<ApiResponse<TrustVerificationResponse[]>> {
        return this.request<TrustVerificationResponse[]>('/users/me/verifications');
    }

    async removeVerification(verificationId: string): Promise<ApiResponse<{ message: string }>> {
        return this.request(`/users/me/verifications/${verificationId}`, {
            method: 'DELETE',
        });
    }

    // Email verification flow
    async requestEmailVerification(): Promise<ApiResponse<{ message: string }>> {
        return this.request('/users/me/verify/email/request', {
            method: 'POST',
        });
    }

    async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
        return this.request('/users/me/verify/email/confirm', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    }

    // Phone verification flow
    async requestPhoneVerification(phoneNumber: string): Promise<ApiResponse<{ message: string }>> {
        return this.request('/users/me/verify/phone/request', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber }),
        });
    }

    async verifyPhone(phoneNumber: string, code: string): Promise<ApiResponse<{ message: string }>> {
        return this.request('/users/me/verify/phone/confirm', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, code }),
        });
    }

    // Social verification
    async verifySocialAccount(platform: 'facebook' | 'google', accessToken: string): Promise<ApiResponse<{ message: string }>> {
        return this.request('/users/me/verify/social', {
            method: 'POST',
            body: JSON.stringify({ platform, accessToken }),
        });
    }

    // Community vouch
    async vouchForUser(userId: string, message?: string): Promise<ApiResponse<{ message: string }>> {
        return this.request(`/users/${userId}/vouch`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    }

    // Health Check
    async healthCheck(): Promise<ApiResponse<any>> {
        return this.request('/health');
    }




}

// Export singleton instance
export const apiClient = new ApiClient(
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
);

// For development debugging
if (__DEV__) {
    // @ts-ignore
    global.apiClient = apiClient;
    console.log('🔧 ApiClient available globally as window.apiClient for debugging');
}

export type {
    ApiResponse,
    PaginatedResponse,
    UserProfileResponse,
    CompleteUserProfileResponse,
    Badge,
    BadgeCounts,
    UserStatsResponse,
    SpotResponse,
    SpotReviewResponse,
    CreateSpotRequest,
    SpotReviewRequest,
};