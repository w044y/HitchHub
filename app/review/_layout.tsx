// app/review/_layout.tsx
import { Stack } from 'expo-router';

export default function ReviewLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="add"
                options={{
                    title: 'Add Review',
                    presentation: 'modal'
                }}
            />
        </Stack>
    );
}