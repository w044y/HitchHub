import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Screen } from '../../components/layout/Screen';
import { LoadingSpinner} from '../../components/ui/LoadingSpinner';
import {Card} from '../../components/ui/Card';

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

  // Show loading while checking auth - using new LoadingSpinner component
  if (isLoading) {
    return (
        <LoadingSpinner
            message="Checking authentication..."
            color="#2E7D32"
        />
    );
  }

  // Show main content if authenticated - using new Screen and Card components
  return (
      <Screen scrollable>
        {/* Welcome Card */}
        <Card>
          <Text style={styles.title}>🌍 Welcome to EcoRide!</Text>
          <Text style={styles.subtitle}>Your sustainable travel companion</Text>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>📍</Text>
              <Text style={styles.actionText}>Find Spots</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>🚗</Text>
              <Text style={styles.actionText}>Find Rides</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats Dashboard - Your existing stats */}
        <Card>
          <Text style={styles.sectionTitle}>Your Impact</Text>
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
        </Card>

        {/* Recent Activity */}
        <Card>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityEmoji}>✅</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Added new spot: Highway Rest Stop</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityEmoji}>🚗</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Completed ride to Berlin</Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
          </View>
        </Card>
      </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f0f8f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  dashboardContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});