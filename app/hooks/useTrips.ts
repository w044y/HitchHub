// hooks/useTrips.ts
import { useState, useEffect, useCallback } from 'react';
import { Trip, TripStatus, TripWithFlexibleLocation, CreateFlexibleTripRequest } from '@/types/trip';
import { apiClient } from '@/services/api';

export const useTrips = () => {
    const [trips, setTrips] = useState<TripWithFlexibleLocation[]>([]);
    const [activeTrip, setActiveTrip] = useState<TripWithFlexibleLocation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user's trips
    const loadTrips = useCallback(async (filters?: { status?: TripStatus }) => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('📋 Loading trips with filters:', filters);

            const response = await apiClient.getMyTripsEnhanced(filters);
            setTrips(response.data);

            console.log('✅ Trips loaded:', response.data.length);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load trips';
            setError(errorMessage);
            console.error('❌ Failed to load trips:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load active trip
    const loadActiveTrip = useCallback(async () => {
        try {
            console.log('🔍 Loading active trip...');

            const response = await apiClient.getActiveTrip();
            setActiveTrip(response.data);

            if (response.data) {
                console.log('✅ Active trip found:', response.data.title);
            } else {
                console.log('ℹ️ No active trip found');
            }
        } catch (err) {
            console.error('❌ Failed to load active trip:', err);
            // Don't set error for this - it's okay to not have an active trip
        }
    }, []);

    // Create new trip
    const createTrip = useCallback(async (tripData: CreateFlexibleTripRequest): Promise<TripWithFlexibleLocation> => {
        try {
            setError(null);
            console.log('🎒 Creating new trip:', tripData.title);

            const response = await apiClient.createFlexibleTrip(tripData);
            const newTrip = response.data;

            // Add to trips list
            setTrips(prev => [newTrip, ...prev]);

            console.log('✅ Trip created:', newTrip.id);
            return newTrip;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create trip';
            setError(errorMessage);
            console.error('❌ Failed to create trip:', err);
            throw err;
        }
    }, []);

    // Start trip (make it active)
    const startTrip = useCallback(async (tripId: string) => {
        try {
            setError(null);
            console.log('🚀 Starting trip:', tripId);

            const response = await apiClient.startTrip(tripId);
            const updatedTrip = response.data;

            // Update trips list
            setTrips(prev => prev.map(trip =>
                trip.id === tripId ? updatedTrip : trip
            ));

            // Set as active trip
            setActiveTrip(updatedTrip);

            console.log('✅ Trip started:', updatedTrip.title);
            return updatedTrip;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to start trip';
            setError(errorMessage);
            console.error('❌ Failed to start trip:', err);
            throw err;
        }
    }, []);

    // Complete trip
    const completeTrip = useCallback(async (tripId: string) => {
        try {
            setError(null);
            console.log('✅ Completing trip:', tripId);

            const response = await apiClient.completeTrip(tripId);
            const updatedTrip = response.data;

            // Update trips list
            setTrips(prev => prev.map(trip =>
                trip.id === tripId ? updatedTrip : trip
            ));

            // Clear active trip if this was it
            if (activeTrip?.id === tripId) {
                setActiveTrip(null);
            }

            console.log('✅ Trip completed:', updatedTrip.title);
            return updatedTrip;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to complete trip';
            setError(errorMessage);
            console.error('❌ Failed to complete trip:', err);
            throw err;
        }
    }, [activeTrip]);

    // Update trip
    const updateTrip = useCallback(async (
        tripId: string,
        updates: Partial<CreateFlexibleTripRequest>
    ) => {
        try {
            setError(null);
            console.log('📝 Updating trip:', tripId, updates);

            const response = await apiClient.updateFlexibleTrip(tripId, updates);
            const updatedTrip = response.data;

            // Update trips list
            setTrips(prev => prev.map(trip =>
                trip.id === tripId ? updatedTrip : trip
            ));

            // Update active trip if this was it
            if (activeTrip?.id === tripId) {
                setActiveTrip(updatedTrip);
            }

            console.log('✅ Trip updated:', updatedTrip.title);
            return updatedTrip;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update trip';
            setError(errorMessage);
            console.error('❌ Failed to update trip:', err);
            throw err;
        }
    }, [activeTrip]);

    // Delete trip
    const deleteTrip = useCallback(async (tripId: string) => {
        try {
            setError(null);
            console.log('🗑️ Deleting trip:', tripId);

            await apiClient.deleteTrip(tripId);

            // Remove from trips list
            setTrips(prev => prev.filter(trip => trip.id !== tripId));

            // Clear active trip if this was it
            if (activeTrip?.id === tripId) {
                setActiveTrip(null);
            }

            console.log('✅ Trip deleted');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete trip';
            setError(errorMessage);
            console.error('❌ Failed to delete trip:', err);
            throw err;
        }
    }, [activeTrip]);

    // Quick trip creation - "start tracking now"
    const startQuickTrip = useCallback(async (data: {
        title: string;
        travel_modes: string[];
        current_location?: { latitude: number; longitude: number };
    }) => {
        try {
            setError(null);
            console.log('⚡ Starting quick trip:', data.title);

            const response = await apiClient.startQuickTrip(data);
            const newTrip = response.data;

            // Add to trips list
            setTrips(prev => [newTrip, ...prev]);

            // Set as active trip
            setActiveTrip(newTrip);

            console.log('✅ Quick trip started:', newTrip.title);
            return newTrip;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to start quick trip';
            setError(errorMessage);
            console.error('❌ Failed to start quick trip:', err);
            throw err;
        }
    }, []);

    // Add spot to trip
    const addSpotToTrip = useCallback(async (
        tripId: string,
        spotId: string,
        options?: { notes?: string }
    ) => {
        try {
            setError(null);
            console.log('📍 Adding spot to trip:', { tripId, spotId });

            await apiClient.addSpotToTripEnhanced(tripId, spotId, options);

            // Reload the specific trip to get updated spot count
            const response = await apiClient.getTripByIdEnhanced(tripId);
            const updatedTrip = response.data;

            // Update trips list
            setTrips(prev => prev.map(trip =>
                trip.id === tripId ? updatedTrip : trip
            ));

            // Update active trip if this was it
            if (activeTrip?.id === tripId) {
                setActiveTrip(updatedTrip);
            }

            console.log('✅ Spot added to trip');
            return updatedTrip;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add spot to trip';
            setError(errorMessage);
            console.error('❌ Failed to add spot to trip:', err);
            throw err;
        }
    }, [activeTrip]);

    // Refresh all trip data
    const refreshTrips = useCallback(() => {
        console.log('🔄 Refreshing all trip data...');
        loadTrips();
        loadActiveTrip();
    }, [loadTrips, loadActiveTrip]);

    // Filter trips by status
    const getTripsbyStatus = useCallback((status: TripStatus) => {
        return trips.filter(trip => trip.status === status);
    }, [trips]);

    // Get trip statistics
    const getTripStats = useCallback(() => {
        const activeTrips = trips.filter(trip => trip.status === TripStatus.ACTIVE).length;
        const plannedTrips = trips.filter(trip => trip.status === TripStatus.PLANNED).length;
        const completedTrips = trips.filter(trip => trip.status === TripStatus.COMPLETED).length;
        const totalSpots = trips.reduce((sum, trip) => sum + (trip.spots_discovered || 0), 0);
        const totalMemories = trips.reduce((sum, trip) => sum + (trip.memories_captured || 0), 0);

        return {
            total: trips.length,
            active: activeTrips,
            planned: plannedTrips,
            completed: completedTrips,
            totalSpots,
            totalMemories,
        };
    }, [trips]);

    // Load trips on mount
    useEffect(() => {
        console.log('🔄 useTrips hook mounted, loading initial data...');
        loadTrips();
        loadActiveTrip();
    }, [loadTrips, loadActiveTrip]);

    return {
        // Data
        trips,
        activeTrip,
        isLoading,
        error,

        // Actions
        createTrip,
        startTrip,
        completeTrip,
        updateTrip,
        deleteTrip,
        startQuickTrip,
        addSpotToTrip,

        // Utils
        refreshTrips,
        loadTrips,
        getTripsbyStatus,
        getTripStats,

        // Clear error
        clearError: () => setError(null),
    };
};

// Export hook with different return patterns for specific use cases
export const useActiveTrip = () => {
    const { activeTrip, isLoading, error, refreshTrips } = useTrips();

    return {
        activeTrip,
        isLoading,
        error,
        refreshActiveTrip: refreshTrips,
    };
};

export const useTripStats = () => {
    const { getTripStats, isLoading } = useTrips();

    return {
        stats: getTripStats(),
        isLoading,
    };
};