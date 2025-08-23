// app/spots/_layout.tsx
import { Stack } from 'expo-router';

export default function SpotsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="add" />
            <Stack.Screen name="[id]" />
        </Stack>
    );
}