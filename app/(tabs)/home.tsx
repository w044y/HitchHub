// app/(tabs)/home.tsx - Aligned styling
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {TouchableOpacity, StyleSheet, Alert, Platform} from 'react-native';
import { Text, View } from '../../components/Themed';
import { Screen } from '../../components/layout/Screen';
import { LoadingSpinner} from '../../components/ui/LoadingSpinner';
import {Card} from '../../components/ui/Card';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { useColorScheme } from '../../components/useColorScheme';

export default function HomeScreen() {
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

      if (!hasAuthToken) {
        router.replace('/welcome');
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      router.replace('/welcome');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindSpots = () => {
    router.push('/(tabs)/trips');
  };

  const handleFindRides = () => {
    Alert.alert('Find Rides', 'Ride sharing feature coming soon!');
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
        <Card style={styles.card}>
          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeEmoji}>🏕️</Text>
            <Text style={[styles.title, { color: colors.primary }]}>Welcome to HitchHub!</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Ready for your next adventure?
            </Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={handleFindSpots}
                activeOpacity={0.7}
            >
              <Text style={styles.actionEmoji}>📍</Text>
              <Text style={[styles.actionText, { color: colors.primary }]}>Find Spots</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={handleFindRides}
                activeOpacity={0.7}
            >
              <Text style={styles.actionEmoji}>🚗</Text>
              <Text style={[styles.actionText, { color: colors.primary }]}>Find Rides</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats Dashboard */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Journey</Text>
          <View style={styles.dashboardContent}>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trips</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>1.2K</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>km traveled</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>8</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Countries</Text>
            </View>
          </View>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>

          <View style={[styles.activityItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.activityIcon, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={styles.activityEmoji}>✅</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>
                Added new spot: Highway Rest Stop
              </Text>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                2 hours ago
              </Text>
            </View>
          </View>

          <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.activityIcon, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={styles.activityEmoji}>🚗</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>
                Completed ride to Berlin
              </Text>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                Yesterday
              </Text>
            </View>
          </View>
        </Card>

        {/* Community Stats */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Community</Text>
          <View style={styles.communityStats}>
            <View style={styles.communityItem}>
              <Text style={styles.communityEmoji}>👥</Text>
              <Text style={[styles.communityLabel, { color: colors.textSecondary }]}>
                50K+ Active Hitchhikers
              </Text>
            </View>
            <View style={styles.communityItem}>
              <Text style={styles.communityEmoji}>🌍</Text>
              <Text style={[styles.communityLabel, { color: colors.textSecondary }]}>
                15K+ Verified Spots
              </Text>
            </View>
            <View style={styles.communityItem}>
              <Text style={styles.communityEmoji}>🚗</Text>
              <Text style={[styles.communityLabel, { color: colors.textSecondary }]}>
                1M+ Successful Rides
              </Text>
            </View>
          </View>
        </Card>
      </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Layout.spacing.base,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: Layout.spacing.base,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.base,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Layout.spacing.base,
  },
  actionButton: {
    flex: 1,
    padding: Layout.spacing.lg,
    borderRadius: Layout.radius.base,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dashboardContent: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  statCard: {
    padding: Layout.spacing.base,
    borderRadius: Layout.radius.base,
    alignItems: 'center',
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.base,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.base,
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
  },
  communityStats: {
    gap: Layout.spacing.base,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  communityEmoji: {
    fontSize: 20,
    marginRight: Layout.spacing.base,
    width: 24,
    textAlign: 'center',
  },
  communityLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});