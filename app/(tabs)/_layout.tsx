// app/(tabs)/_layout.tsx - Enhanced with consistent styling
import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { Layout } from '../../constants/Layout';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

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
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused, color }) => (
                        <Text style={{ fontSize: 24, color }}>
                            {focused ? '🏠' : '🏠'}
                        </Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ focused, color }) => (
                        <Text style={{ fontSize: 24, color }}>
                            {focused ? '🗺️' : '🗺️'}
                        </Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused, color }) => (
                        <Text style={{ fontSize: 24, color }}>
                            {focused ? '👤' : '👤'}
                        </Text>
                    ),
                }}
            />
        </Tabs>
    );
}