import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function TabOneScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Replace with real auth check
      // For now, simulate checking stored auth token

      // Simulate API call or storage check
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock auth check - you can replace this with real logic
      const hasAuthToken = true; // Change to true to test authenticated state

      console.log('🔍 Auth check result:', hasAuthToken);

      if (!hasAuthToken) {
        console.log('🔄 Not authenticated, redirecting to welcome');
        router.replace('/welcome');
        return;
      }

      // User is authenticated, stay on this tab
      console.log('✅ User authenticated, showing main app');
      setIsAuthenticated(true);

    } catch (error) {
      console.error('❌ Auth check failed:', error);
      // On error, redirect to welcome
      router.replace('/welcome');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Checking authentication...</Text>
        </View>
    );
  }

  // Show main content if authenticated
  return (
      <View style={styles.container}>
        <Text style={styles.title}>🌍 Welcome to EcoRide!</Text>
        <Text style={styles.subtitle}>Your sustainable travel companion</Text>

        {/* You can add your main dashboard content here */}
        <View style={styles.dashboardContent}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Trips Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>245 kg</Text>
            <Text style={styles.statLabel}>CO₂ Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Countries Visited</Text>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  dashboardContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    minWidth: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});