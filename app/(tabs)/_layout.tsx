import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Modern tab bar icon with better visual feedback
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
    focused: boolean;
}) {
    return (
        <FontAwesome
            size={props.focused ? 26 : 22} // Larger when active
            style={{
                marginBottom: -3,
                opacity: props.focused ? 1 : 0.7, // Subtle opacity change
            }}
            {...props}
        />
    );
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <Tabs
            screenOptions={{
                // Modern color scheme
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,

                tabBarStyle: {
                    backgroundColor: '#f0f0f3',
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    borderRadius: 25,
                    height: 70,
                    borderTopWidth: 0,
                    // Neumorphism shadow
                    shadowColor: '#babecc',
                    shadowOffset: { width: -5, height: -5 },
                    shadowOpacity: 1,
                    shadowRadius: 10,
                    elevation: 10,
                },

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                    marginBottom: 2,
                },

                tabBarItemStyle: {
                    borderRadius: 15,
                    marginHorizontal: 2,
                    paddingVertical: 4,
                },

                // Modern header styling
                headerShown: useClientOnlyValue(false, true),
                headerStyle: {
                    backgroundColor: colors.background,
                    shadowColor: 'transparent',
                    elevation: 0,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 20,
                },
            }}>

            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "map" : "map-o"}
                            color={color}
                            focused={focused}
                        />
                    ),
                    headerTitle: '🗺️ Discover Spots',
                }}
            />

            <Tabs.Screen
                name="spots"
                options={{
                    title: 'Spots',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "th-list" : "list-ul"}
                            color={color}
                            focused={focused}
                        />
                    ),
                    headerTitle: '📍 Near You',
                }}
            />

            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "plus-circle" : "plus"}
                            color={focused ? '#4CAF50' : color} // Special green color when active
                            focused={focused}
                        />
                    ),
                    headerTitle: '✨ Share a Spot',
                    // Special styling for the add button
                    tabBarActiveTintColor: '#4CAF50',
                }}
            />

            <Tabs.Screen
                name="community"
                options={{
                    title: 'Community',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "users" : "group"}
                            color={color}
                            focused={focused}
                        />
                    ),
                    headerTitle: '👥 Connect',
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "user" : "user-o"}
                            color={color}
                            focused={focused}
                        />
                    ),
                    headerTitle: '👤 You',
                }}
            />

        </Tabs>
    );
}