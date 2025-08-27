// components/home/QuickActionsCard.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useColorScheme } from '@/components/useColorScheme';
import { TransportMode } from '@/app/types/transport';
import { router } from 'expo-router';

interface QuickAction {
    label: string;
    emoji: string;
    action: string;
    mode: TransportMode;
}

interface QuickActionsCardProps {
    travelModes: TransportMode[];
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ travelModes }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getAllActions = (): QuickAction[] => [
        {
            label: 'Find Spots',
            emoji: '📍',
            action: 'findSpots',
            mode: TransportMode.HITCHHIKING,
        },
        {
            label: 'Plan Route',
            emoji: '🚲',
            action: 'planRoute',
            mode: TransportMode.CYCLING,
        },
        {
            label: 'Check Parking',
            emoji: '⚖️',
            action: 'checkParking',
            mode: TransportMode.VAN_LIFE,
        },
        {
            label: 'Find Trails',
            emoji: '🚶',
            action: 'findTrails',
            mode: TransportMode.WALKING,
        },
        {
            label: 'Log Trip',
            emoji: '⭐',
            action: 'logTrip',
            mode: TransportMode.HITCHHIKING, // Could be any mode
        },
    ];

    const getRelevantActions = (): QuickAction[] => {
        const allActions = getAllActions();
        return allActions
            .filter(action =>
                travelModes.includes(action.mode) || action.action === 'logTrip'
            )
            .slice(0, 3); // Show max 3 actions
    };

    const handleAction = (action: string) => {
        switch (action) {
            case 'findSpots':
                router.push('/(tabs)/explore');
                break;
            case 'planRoute':
                Alert.alert('Plan Route', 'Cycling route planning coming soon!');
                break;
            case 'checkParking':
                Alert.alert('Check Parking', 'Van parking checker coming soon!');
                break;
            case 'findTrails':
                Alert.alert('Find Trails', 'Walking trail finder coming soon!');
                break;
            case 'logTrip':
                Alert.alert('Log Trip', 'Trip logging coming soon!');
                break;
            default:
                Alert.alert('Action', `${action} not implemented yet`);
        }
    };

    const relevantActions = getRelevantActions();

    return (
        <Card style={styles.card}>
            <Text style={[styles.title, { color: colors.text }]}>Quick Actions</Text>

            <View style={styles.actionsRow}>
                {relevantActions.map((action) => (
                    <TouchableOpacity
                        key={action.action}
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => handleAction(action.action)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.actionEmoji}>{action.emoji}</Text>
                        <Text style={styles.actionText}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: Layout.spacing.base,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Layout.spacing.base,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: Layout.spacing.sm,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Layout.spacing.base,
        borderRadius: Layout.radius.base,
    },
    actionEmoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});