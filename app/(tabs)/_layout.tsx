import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                tabBarStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderTopColor: Colors[colorScheme ?? 'light'].border,
                    height: 90, // Change tab bar height
                    paddingBottom: 20, // Bottom padding
                    paddingTop: 10, // Top padding
                    // Add shadows, borders, etc.
                },
                headerShown: useClientOnlyValue(false, true),
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
                headerTintColor: Colors[colorScheme ?? 'light'].text,
            }}>

            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
                    headerTitle: 'HitchSpot Map',
                }}
            />

            <Tabs.Screen
                name="spots"
                options={{
                    title: 'Spots',
                    tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
                    headerTitle: 'Nearby Spots',
                }}
            />

            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add Spot',
                    tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
                    headerTitle: 'Add New Spot',
                }}
            />

            <Tabs.Screen
                name="community"
                options={{
                    title: 'Community',
                    tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
                    headerTitle: 'Community',
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                    headerTitle: 'My Profile',
                }}
            />

        </Tabs>
    );
}