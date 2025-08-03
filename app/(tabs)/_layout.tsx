import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

// Simple tab bar icon
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
    focused: boolean;
}) {
    return (
        <FontAwesome
            size={props.focused ? 26 : 22}
            style={{
                marginBottom: -3,
                opacity: props.focused ? 1 : 0.7,
            }}
            {...props}
        />
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                // Tab bar styling
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#2E7D32',
                tabBarInactiveTintColor: '#666',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#2E7D32',
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="home" color={color} focused={focused} />
                    ),
                    headerTitle: '🏠 EcoRide Home',
                }}
            />

            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="map" color={color} focused={focused} />
                    ),
                    headerTitle: '🗺️ Discover Spots',
                }}
            />

            <Tabs.Screen
                name="spots"
                options={{
                    title: 'Spots',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="list" color={color} focused={focused} />
                    ),
                    headerTitle: '📍 Near You',
                }}
            />

            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="plus-circle" color={color} focused={focused} />
                    ),
                    headerTitle: '✨ Share a Spot',
                }}
            />

            <Tabs.Screen
                name="community"
                options={{
                    title: 'Community',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="users" color={color} focused={focused} />
                    ),
                    headerTitle: '👥 Connect',
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="user" color={color} focused={focused} />
                    ),
                    headerTitle: '👤 You',
                }}
            />
        </Tabs>
    );
}