import { Platform } from 'react-native';

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

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    setToken(token: string | null) {
        this.token = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
                ...options.headers,
            },
        };

        try {
            console.log(`🌐 API ${config.method || 'GET'}: ${url}`);

            const response = await fetch(url, config);
            const data = await response.json();

            console.log('📊 Response status:', response.status);
            console.log('📊 Response data:', JSON.stringify(data, null, 2));

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

    // Spots Methods
    async getSpots(filters: {
        limit?: number;
        offset?: number;
        spot_type?: string;
        is_verified?: boolean;
        min_rating?: number;
    } = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, value.toString());
        });

        return this.request<any[]>(`/spots?${params}`);
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

    async updateSpot(id: string, spotData: any) {
        return this.request<any>(`/spots/${id}`, {
            method: 'PUT',
            body: JSON.stringify(spotData),
        });
    }

    async addSpotReview(spotId: string, reviewData: {
        safety_rating: number;
        overall_rating: number;
        comment?: string;
        photos?: string[];
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
}

export const apiClient = new ApiClient(API_BASE_URL);