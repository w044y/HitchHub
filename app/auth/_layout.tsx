// app/auth/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="login"
                options={{
                    title: 'Login',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="verify"
                options={{
                    title: 'Verify Email',
                    headerShown: false
                }}
            />
        </Stack>
    );
}