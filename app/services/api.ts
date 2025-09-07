// app/services/api.ts - Complete API Client with ProfileContext support
import { TransportMode } from '@/app/types/transport';
import * as SecureStore from 'expo-secure-store';

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

    constructor(baseURL?: string) {
        if (baseURL) {
            this.baseURL = baseURL;
        } else if (__DEV__) {
            // Development URL logic
            this.baseURL = 'http://192.XXX:3000/api/v1' // Android emulator default
            // Alternative: Use your computer's IP
            // this.baseURL = 'http://192.168.1.XXX:3000/api/v1'; // Replace XXX with your IP
        } else {
            // Production URL
            this.baseURL = 'https://your-production-api.com/api/v1';
        }

        if (__DEV__) {
            console.log('🔧 ApiClient initialized with base URL:', this.baseURL);
        }

        this.initializeToken();
    }

    private async initializeToken() {
        try {
            const storedToken = await SecureStore.getItemAsync('auth_token');
            if (storedToken) {
                this.token = storedToken;
                if (__DEV__) {
                    console.log('🔑 Restored token from secure storage');
                }
            }
        } catch (error) {
            console.warn('Failed to restore token:', error);
        }
    }


    async setToken(token: string | null) {
        this.token = token;

        try {
            if (token) {
                await SecureStore.setItemAsync('auth_token', token);
                if (__DEV__) {
                    console.log('🔑 Token saved to secure storage');
                }
            } else {
                await SecureStore.deleteItemAsync('auth_token');
                if (__DEV__) {
                    console.log('🗑️ Token removed from secure storage');
                }
            }
        } catch (error) {
            console.warn('Failed to manage token storage:', error);
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

    private async request<T>(endpoint: string, config: RequestInit = {}): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        // FIX: Create headers as a proper Record type
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Add any existing headers
        if (config.headers) {
            if (config.headers instanceof Headers) {
                // Handle Headers object
                config.headers.forEach((value, key) => {
                    headers[key] = value;
                });
            } else if (Array.isArray(config.headers)) {
                // Handle array format
                config.headers.forEach(([key, value]) => {
                    headers[key] = value;
                });
            } else {
                // Handle object format
                Object.assign(headers, config.headers);
            }
        }

        // Add authorization header if token exists
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const finalConfig: RequestInit = {
            ...config,
            headers,
        };

        if (__DEV__) {
            console.log(`📡 API Request ${config.method || 'GET'} ${url}`);
            if (config.body) {
                console.log('📦 Request body:', JSON.parse(config.body as string));
            }
            if (this.token) {
                console.log('🔑 Request includes auth token');
            }
        }

        try {
            const response = await fetch(url, finalConfig);
            const data = await response.json();

            if (!response.ok) {
                // Handle token expiry
                if (response.status === 401 && this.token) {
                    console.log('🔄 Token expired, clearing stored token');
                    await this.setToken(null);
                    throw new Error('UNAUTHORIZED');
                }

                throw new Error(data.error?.message || data.message || `HTTP ${response.status}: ${response.statusText}`);
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

    loginAsDev = async (email: string = 'dev@vendro.app'): Promise<ApiResponse<AuthResponse>> => {
        if (!__DEV__) {
            throw new Error('Dev login only available in development');
        }

        try {
            console.log('🔧 Starting dev authentication for:', email);

            // Try the dedicated dev login endpoint first
            try {
                const result = await this.request<AuthResponse>('/auth/dev-login', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                });

                console.log('✅ Dev login successful via /auth/dev-login');
                return result;
            } catch (error) {
                console.log('⚠️ Dev login endpoint failed, trying magic link flow...');

                // Fallback to magic link flow
                await this.sendMagicLink(email);
                const result = await this.verifyMagicLink('dev-token-12345', email);
                console.log('✅ Dev login successful via magic link flow');
                return result;
            }
        } catch (error) {
            console.error('❌ All dev authentication methods failed:', error);
            throw error;
        }
    };

    // Auth Methods
    async sendMagicLink(email: string): Promise<ApiResponse<MagicLinkResponse>> {
        return this.request<MagicLinkResponse>('/auth/magic-link', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async verifyMagicLink(token: string, email: string): Promise<ApiResponse<AuthResponse>> {
        const result = await this.request<AuthResponse>('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ token, email }),
        });

        // Auto-save the token
        if (result.data.accessToken) {
            await this.setToken(result.data.accessToken);
        }

        return result;
    }

    async getCurrentUser(): Promise<ApiResponse<any>> {
        return this.request('/auth/me');
    }

    async refreshToken(): Promise<ApiResponse<AuthResponse>> {
        const result = await this.request<AuthResponse>('/auth/refresh', {
            method: 'POST',
        });

        if (result.data.accessToken) {
            await this.setToken(result.data.accessToken);
        }

        return result;
    }


    // Development helper


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
export const apiClient = new ApiClient();

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