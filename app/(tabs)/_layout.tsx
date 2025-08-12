// app/(tabs)/_layout.tsx
import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '../contexts/AuthContext';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { isAuthenticated, isLoading } = useAuth();

    // Redirect to auth if not logged in
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/auth/login');
        }
    }, [isAuthenticated, isLoading]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    // Don't render tabs if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    const colors = Colors?.[colorScheme ?? 'light'] ?? {
        primary: '#D4622A',
        background: '#FFFFFF',
        border: '#E5E7EB',
        tabIconDefault: '#9CA3AF',
        backgroundSecondary: '#F8F9FA'
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.tabIconDefault,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    paddingBottom: 4,
                    paddingTop: 4,
                    height: 65,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            }}>

            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 22, color }}>🏠</Text>
                    ),
                }}
            />

            <Tabs.Screen
                name="trips"
                options={{
                    title: 'Trips',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 22, color }}>🎒</Text>
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ focused, color }) => (
                        <View style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: -10,
                            backgroundColor: focused ? colors.primary : colors.backgroundSecondary,
                            borderWidth: 2,
                            borderColor: '#FFFFFF',
                        }}>
                            <Text style={{
                                fontSize: 24,
                                color: focused ? '#FFFFFF' : color
                            }}>
                                🗺️
                            </Text>
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="community"
                options={{
                    title: 'Community',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 22, color }}>🌱</Text>
                    ),
                }}
            />

            <Tabs.Screen
                name="you"
                options={{
                    title: 'You',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 22, color }}>👤</Text>
                    ),
                }}
            />
        </Tabs>
    );
}