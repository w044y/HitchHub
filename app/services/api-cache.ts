// app/services/api-cache.ts - New cache system
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    key: string;
}

class ApiCacheManager {
    private cache = new Map<string, CacheEntry<any>>();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
    private readonly LOCATION_TTL = 2 * 60 * 1000; // 2 minutes for location-based queries

    generateCacheKey(endpoint: string, params?: Record<string, any>): string {
        const sortedParams = params ? JSON.stringify(params, Object.keys(params).sort()) : '';
        return `${endpoint}:${sortedParams}`;
    }

    set<T>(key: string, data: T, ttl?: number): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            key
        };

        this.cache.set(key, entry);

        // Auto-cleanup after TTL
        setTimeout(() => {
            this.cache.delete(key);
        }, ttl || this.DEFAULT_TTL);
    }

    get<T>(key: string, ttl?: number): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const age = Date.now() - entry.timestamp;
        const maxAge = ttl || this.DEFAULT_TTL;

        if (age > maxAge) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    invalidate(pattern: string): void {
        const keysToDelete = Array.from(this.cache.keys()).filter(key =>
            key.includes(pattern)
        );

        keysToDelete.forEach(key => this.cache.delete(key));
        console.log(`🗑️ Cache invalidated: ${keysToDelete.length} entries removed for pattern "${pattern}"`);
    }

    clear(): void {
        this.cache.clear();
        console.log('🗑️ Cache cleared completely');
    }

    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            oldestEntry: Math.min(...Array.from(this.cache.values()).map(e => e.timestamp)),
        };
    }
}

export const apiCache = new ApiCacheManager();