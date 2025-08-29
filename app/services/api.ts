import { Platform } from 'react-native';
import {TransportMode} from "@/app/types/transport";
import {TravelProfile} from "@/app/types/profile";
import {apiCache} from "@/app/services/api-cache";

const getApiBaseUrl = () => {
    if (__DEV__) {
        // Replace with YOUR computer's IP address
        const YOUR_COMPUTER_IP = ''; // Your current IP
        return `http://${YOUR_COMPUTER_IP}:3000/api/v1`;
    }
    return 'https://your-production-url.com/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

interface ApiResponse<T> {
    data: T;
    message?: string;
    pagination?: {
        limit: number;
        offset: number;
        total: number;
    };
}

class ApiClient {
    private baseURL: string;
    private token: string | null = null;
    private pendingRequests = new Map<string, Promise<any>>();

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    setToken(token: string | null) {
        this.token = token;
        console.log('🔑 API Token', token ? 'set' : 'cleared');

    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        cacheConfig?: {
            useCache?: boolean;
            ttl?: number;
            cacheKey?: string;
        }
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        const method = options.method || 'GET';

        // Generate cache key
        const defaultCacheKey = apiCache.generateCacheKey(endpoint, {
            method,
            body: options.body,
            headers: options.headers,
        });
        const cacheKey = cacheConfig?.cacheKey || defaultCacheKey;

        // For GET requests, check cache first
        if (method === 'GET' && cacheConfig?.useCache !== false) {
            const cached = apiCache.get<ApiResponse<T>>(cacheKey, cacheConfig?.ttl);
            if (cached) {
                console.log(`💾 Cache HIT: ${endpoint}`);
                return cached;
            }

            // Check if request is already in flight
            if (this.pendingRequests.has(cacheKey)) {
                console.log(`⏳ Request already pending: ${endpoint}`);
                return this.pendingRequests.get(cacheKey);
            }
        }

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
                ...options.headers,
            },
        };

        const requestPromise = this.executeRequest<T>(url, config, endpoint);

        // Store pending request to prevent duplicates
        if (method === 'GET') {
            this.pendingRequests.set(cacheKey, requestPromise);
        }

        try {
            const response = await requestPromise;

            // Cache successful GET responses
            if (method === 'GET' && cacheConfig?.useCache !== false) {
                apiCache.set(cacheKey, response, cacheConfig?.ttl);
                console.log(`💾 Cache SET: ${endpoint}`);
            }

            return response;
        } finally {
            // Clean up pending request
            this.pendingRequests.delete(cacheKey);
        }
    }

    // Auth Methods
    async sendMagicLink(email: string) {
        return this.request<{ message: string; email: string }>('/auth/magic-link', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async verifyMagicLink(token: string, email: string) {
        return this.request<{
            user: any;
            accessToken: string;
            message: string;
        }>('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ token, email }),
        });
    }

    async getCurrentUser() {
        return this.request<any>('/auth/me');
    }

    async refreshToken() {
        return this.request<{ accessToken: string; user: any }>('/auth/refresh', {
            method: 'POST',
        });
    }

    async logout() {
        return this.request<{ message: string }>('/auth/logout', {
            method: 'POST',
        });
    }

    // Users Methods
    async getUsers(limit = 50, offset = 0) {
        return this.request<any[]>(`/users?limit=${limit}&offset=${offset}`);
    }

    async getUserById(id: string) {
        return this.request<any>(`/users/${id}`);
    }

    async updateUser(id: string, userData: any) {
        return this.request<any>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async getUserStats(id: string) {
        return this.request<any>(`/users/${id}/stats`);
    }

    private async executeRequest<T>(url: string, config: RequestInit, endpoint: string): Promise<ApiResponse<T>> {
        try {
            console.log(`🌐 API ${config.method || 'GET'}: ${url}`);

            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || `HTTP ${response.status}`);
            }

            console.log(`✅ API Success: ${endpoint}`);
            return data;
        } catch (error) {
            console.error(`❌ API Error: ${endpoint}`, error);
            throw error;
        }
    }


    async getSpots(filters: {
        limit?: number;
        offset?: number;
        spot_type?: string;
        is_verified?: boolean;
        min_rating?: number;
    } = {}) {
        const cacheKey = `spots:basic:${JSON.stringify(filters)}`;

        return this.request<any[]>('/spots', {
            method: 'GET',
        }, {
            useCache: true,
            ttl: 10 * 60 * 1000, // 10 minutes for basic spots
            cacheKey
        });
    }

    async getSpotsFiltered(filters: {
        transportModes?: string[];
        latitude?: number;
        longitude?: number;
        radius?: number;
        limit?: number;
        offset?: number;
        spotType?: string;
        minRating?: number;
        safetyPriority?: string;
    } = {}) {
        // Create stable cache key
        const locationKey = filters.latitude && filters.longitude
            ? `${filters.latitude.toFixed(3)},${filters.longitude.toFixed(3)},${filters.radius || 10}`
            : 'no-location';

        const cacheKey = `spots:filtered:${JSON.stringify({
            modes: filters.transportModes?.sort(),
            location: locationKey,
            spotType: filters.spotType,
            minRating: filters.minRating,
            safety: filters.safetyPriority,
            limit: filters.limit || 50,
            offset: filters.offset || 0
        })}`;

        const params = new URLSearchParams();

        if (filters.transportModes?.length) {
            params.append('transport_modes', filters.transportModes.join(','));
        }
        if (filters.latitude) params.append('latitude', filters.latitude.toString());
        if (filters.longitude) params.append('longitude', filters.longitude.toString());
        if (filters.radius) params.append('radius', filters.radius.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());
        if (filters.spotType) params.append('spot_type', filters.spotType);
        if (filters.minRating) params.append('min_rating', filters.minRating.toString());
        if (filters.safetyPriority) params.append('safety_priority', filters.safetyPriority);

        return this.request<any[]>(`/spots/filtered?${params}`, {
            method: 'GET',
        }, {
            useCache: true,
            ttl: filters.latitude ? 2 * 60 * 1000 : 5 * 60 * 1000,
            cacheKey
        });
    }

    async getSpotReviews(spotId: string, filters: {
        transport_mode?: string;
        limit?: number;
        offset?: number;
        sort_by?: 'newest' | 'oldest' | 'most_helpful';
    } = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, value.toString());
        });

        return this.request<any[]>(`/spots/${spotId}/reviews?${params}`);
    }

    async getSpotReviewSummary(spotId: string) {
        return this.request<any>(`/spots/${spotId}/reviews/summary`);
    }




    async getNearbySpots(latitude: number, longitude: number, radius = 10, limit = 20) {
        return this.request<any[]>(
            `/spots/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}&limit=${limit}`
        );
    }

    async getSpotById(id: string) {
        return this.request<any>(`/spots/${id}`);
    }

    async createSpot(spotData: {
        name: string;
        description: string;
        latitude: number;
        longitude: number;
        spot_type: string;
        tips?: string;
        accessibility_info?: string;
        facilities?: string[];
    }) {
        return this.request<any>('/spots', {
            method: 'POST',
            body: JSON.stringify(spotData),
        });
    }

    async updateSpot(id: string, spotData: {
        name?: string;
        description?: string;
        tips?: string;
        accessibility_info?: string;
        facilities?: string[];
    }) {
        return this.request<any>(`/spots/${id}`, {
            method: 'PUT',
            body: JSON.stringify(spotData),
        });
    }

    async deleteSpot(id: string) {
        return this.request<any>(`/spots/${id}`, {
            method: 'DELETE',
        });
    }

    async addSpotReview(spotId: string, reviewData: {
        transport_mode: string;
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
        context?: string;
    }) {
        return this.request<any>(`/spots/${spotId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    }

    // Trips Methods
    async getTrips(filters: {
        limit?: number;
        offset?: number;
        status?: string;
        is_public?: boolean;
        user_id?: string;
    } = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, value.toString());
        });

        return this.request<any[]>(`/trips?${params}`);
    }

    async getTripById(id: string) {
        return this.request<any>(`/trips/${id}`);
    }

    async createTrip(tripData: {
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
    }) {
        return this.request<any>('/trips', {
            method: 'POST',
            body: JSON.stringify(tripData),
        });
    }

    async updateTrip(id: string, tripData: any) {
        return this.request<any>(`/trips/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tripData),
        });
    }

    async addSpotToTrip(tripId: string, spotId: string, orderIndex?: number) {
        return this.request<any>(`/trips/${tripId}/spots`, {
            method: 'POST',
            body: JSON.stringify({ spot_id: spotId, order_index: orderIndex }),
        });
    }
    async getUserProfile(userId: string) {
        return this.request<any>(`/users/${userId}/profile`);
    }

    async updateUserProfile(userId: string, profileData: any) {
        return this.request<any>(`/users/${userId}/profile`, {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }


    async createUserProfile(userId: string, profileData: any) {
        return this.request<any>(`/users/${userId}/profile`, {
            method: 'POST',
            body: JSON.stringify(profileData),
        });
    }}


export const apiClient = new ApiClient(API_BASE_URL);