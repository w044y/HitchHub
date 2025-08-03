import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

// Updated auth check to show tabs
function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Starting auth check...');
    setTimeout(() => {
      // CHANGE THIS TO TRUE TO SEE TABS
      setIsAuthenticated(true); // 🎯 Set to true to show tabs
      setIsLoading(false);
      console.log('✅ Auth check complete - showing tabs');
    }, 500);
  }, []);

  return { isAuthenticated, isLoading };
}

export {
  ErrorBoundary,
} from 'expo-router';

// Update initial route for tabs
export const unstable_settings = {
  initialRouteName: '(tabs)', // Change this when showing tabs
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { isAuthenticated, isLoading } = useAuthCheck();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && !isLoading) {
      console.log('🚀 Hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  if (!loaded || isLoading) {
    console.log('⏳ Still loading...');
    return null;
  }

  console.log('🎯 Rendering navigation with auth:', isAuthenticated);
  return <RootLayoutNav isAuthenticated={isAuthenticated} />;
}

function RootLayoutNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const colorScheme = useColorScheme();

  console.log('📱 RootLayoutNav - isAuthenticated:', isAuthenticated);

  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
              <>
                {console.log('✅ Showing TABS')}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </>
          ) : (
              <>
                {console.log('✅ Showing WELCOME screens')}
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
              </>
          )}
        </Stack>
      </ThemeProvider>
  );
}