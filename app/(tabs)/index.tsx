// app/(tabs)/index.tsx
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Screen } from '../../components/layout/Screen';
import { LoadingSpinner} from '../../components/ui/LoadingSpinner';
import {Card} from '../../components/ui/Card';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabOneScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const hasAuthToken = true;

      console.log('🔍 Auth check result:', hasAuthToken);

      if (!hasAuthToken) {
        console.log('🔄 Not authenticated, redirecting to welcome');
        router.replace('/welcome');
        return;
      }

      console.log('✅ User authenticated, showing main app');
      setIsAuthenticated(true);

    } catch (error) {
      console.error('❌ Auth check failed:', error);
      router.replace('/welcome');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
        <LoadingSpinner
            message="Checking authentication..."
            color={colors.primary}
        />
    );
  }

  return (
      <Screen scrollable>
        {/* Welcome Card */}
        <Card>
          <Text style={[styles.title, { color: colors.primary }]}>VENDRO</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your hitchhiking companion</Text>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={styles.actionEmoji}>📍</Text>
              <Text style={[styles.actionText, { color: colors.primary }]}>Find Spots</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={styles.actionEmoji}>🚗</Text>
              <Text style={[styles.actionText, { color: colors.primary }]}>Find Rides</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats Dashboard */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Journey</Text>
          <View style={styles.dashboardContent}>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trips Completed</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>245 km</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distance Traveled</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>8</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Countries Visited</Text>
            </View>
          </View>
        </Card>

        {/* Recent Activity */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <View style={[styles.activityItem, { borderBottomColor: colors.border }]}>
            <Text style={styles.activityEmoji}>✅</Text>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>Added new spot: Highway Rest Stop</Text>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>2 hours ago</Text>
            </View>
          </View>
          <View style={[styles.activityItem, { borderBottomColor: colors.border }]}>
            <Text style={styles.activityEmoji}>🚗</Text>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>Completed ride to Berlin</Text>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>Yesterday</Text>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dashboardContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
  },
  statCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
});