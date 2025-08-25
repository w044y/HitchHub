// app/utils/modeAdaptations.ts
import { TransportMode, TRANSPORT_MODE_EMOJIS } from '@/app/types/transport';

export interface ModeSpecificData {
    primaryMetric: string;
    secondaryInfo: string;
    quickAction: string;
    contextualTip: string;
    priority: number; // for sorting/emphasis
}

export const getModeSpecificData = (
    spot: any,
    mode: TransportMode
): ModeSpecificData => {
    const modeRating = spot.mode_ratings?.[mode];

    switch (mode) {
        case TransportMode.HITCHHIKING:
            return {
                primaryMetric: modeRating?.avg_wait_time
                    ? `${Math.round(modeRating.avg_wait_time)}min avg wait`
                    : `${spot.safety_rating} safety`,
                secondaryInfo: spot.tips?.includes('visibility')
                    ? 'High visibility spot'
                    : 'Check local traffic flow',
                quickAction: 'Quick Review',
                contextualTip: 'Best times: Early morning, avoid rush hour',
                priority: spot.safety_rating * 2 + (modeRating?.effectiveness || 0)
            };

        case TransportMode.CYCLING:
            return {
                primaryMetric: modeRating?.facilities
                    ? `${modeRating.facilities}/5 bike facilities`
                    : 'Check bike infrastructure',
                secondaryInfo: spot.facilities?.includes('parking')
                    ? 'Secure bike parking available'
                    : 'Verify bike safety',
                quickAction: 'Route Profile',
                contextualTip: 'Check elevation and bike lane access',
                priority: (modeRating?.safety || 0) + (modeRating?.facilities || 0)
            };

        case TransportMode.VAN_LIFE:
            return {
                primaryMetric: modeRating?.legal_status
                    ? `${modeRating.legal_status}/5 legal status`
                    : 'Verify parking legality',
                secondaryInfo: spot.facilities?.includes('restroom') && spot.facilities?.includes('food')
                    ? 'Full facilities available'
                    : 'Limited facilities',
                quickAction: 'Legal Check',
                contextualTip: 'Confirm overnight parking rules',
                priority: (modeRating?.legal_status || 0) * 2 + (modeRating?.safety || 0)
            };

        case TransportMode.WALKING:
            return {
                primaryMetric: modeRating?.accessibility
                    ? `${modeRating.accessibility}/5 accessibility`
                    : `${spot.safety_rating} pedestrian safety`,
                secondaryInfo: spot.accessibility_info
                    ? 'Accessibility info available'
                    : 'Standard pedestrian access',
                quickAction: 'Safety Info',
                contextualTip: 'Check lighting and sidewalk conditions',
                priority: (modeRating?.accessibility || 0) + spot.safety_rating
            };

        default:
            return {
                primaryMetric: `${spot.overall_rating} overall`,
                secondaryInfo: 'Multi-modal friendly',
                quickAction: 'View Details',
                contextualTip: 'Good for multiple transport types',
                priority: spot.overall_rating
            };
    }
};

export const getModeSpecificQuickActions = (mode: TransportMode) => {
    switch (mode) {
        case TransportMode.HITCHHIKING:
            return [
                { label: 'Quick Review', emoji: '⭐', primary: true },
                { label: 'Safety Check', emoji: '🛡️', primary: false },
                { label: 'Navigate', emoji: '🧭', primary: false }
            ];
        case TransportMode.CYCLING:
            return [
                { label: 'Route Profile', emoji: '📊', primary: true },
                { label: 'Bike Facilities', emoji: '🔧', primary: false },
                { label: 'Elevation', emoji: '⛰️', primary: false }
            ];
        case TransportMode.VAN_LIFE:
            return [
                { label: 'Legal Status', emoji: '⚖️', primary: true },
                { label: 'Facilities', emoji: '🏢', primary: false },
                { label: 'Overnight OK?', emoji: '🌙', primary: false }
            ];
        case TransportMode.WALKING:
            return [
                { label: 'Safety Info', emoji: '🚨', primary: true },
                { label: 'Accessibility', emoji: '♿', primary: false },
                { label: 'Navigate', emoji: '🧭', primary: false }
            ];
        default:
            return [
                { label: 'View Details', emoji: 'ℹ️', primary: true },
                { label: 'Navigate', emoji: '🧭', primary: false }
            ];
    }
};