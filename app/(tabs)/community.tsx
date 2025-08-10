// app/(tabs)/community.tsx - Ensure proper default export
import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { Colors, ColorPalette } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';

// Type definitions
interface FeedPost {
    id: string;
    user: {
        name: string;
        avatar: string;
        level: string;
    };
    type: 'solo_story' | 'group_trip' | 'local_tip' | 'ride_share';
    timeAgo: string;
    content: string;
    image?: string;
    location: string;
    ecoPoints: number;
    comments: number;
    likes: number;
    tags: string[];
    isVerified?: boolean;
}

interface CommunityHeaderProps {
    colors: ColorPalette;
}

interface SectionTabsProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    colors: ColorPalette;
}

interface CommunityFeedProps {
    colors: ColorPalette;
}

interface PostProps {
    post: FeedPost;
    colors: ColorPalette;
}

interface PlaceholderProps {
    colors: ColorPalette;
}

// Main Component - ENSURE THIS IS THE DEFAULT EXPORT
export default function CommunityScreen() {
    const [activeSection, setActiveSection] = useState<string>('feed');
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <Screen scrollable>
            <CommunityHeader colors={colors} />
            <SectionTabs
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                colors={colors}
            />

            {activeSection === 'feed' && <CommunityFeed colors={colors} />}
            {activeSection === 'groups' && <TravelGroups colors={colors} />}
            {activeSection === 'stories' && <TravelStories colors={colors} />}
            {activeSection === 'local' && <LocalCommunity colors={colors} />}
        </Screen>
    );
}

// Community Header Component
const CommunityHeader: React.FC<CommunityHeaderProps> = ({ colors }) => (
    <Card style={styles.headerCard}>
        <View style={styles.communityHeaderContent}>
            <Text style={styles.communityEmoji}>🌍</Text>
            <View style={styles.communityInfo}>
                <Text style={[styles.communityTitle, { color: colors.text }]}>
                    Travel Community
                </Text>
                <Text style={[styles.communitySubtitle, { color: colors.textSecondary }]}>
                    52,340 sustainable travelers worldwide
                </Text>
            </View>
            <TouchableOpacity
                style={[styles.joinButton, { backgroundColor: colors.primary }]}
                onPress={() => Alert.alert('Join Community', 'Community features coming soon!')}
            >
                <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.globalImpactRow}>
            <View style={styles.impactStat}>
                <Text style={[styles.impactNumber, { color: colors.primary }]}>1.2M kg</Text>
                <Text style={[styles.impactLabel, { color: colors.textSecondary }]}>CO₂ saved today</Text>
            </View>
            <View style={styles.impactSeparator}>
                <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
            </View>
            <View style={styles.impactStat}>
                <Text style={[styles.impactNumber, { color: colors.primary }]}>847</Text>
                <Text style={[styles.impactLabel, { color: colors.textSecondary }]}>active trips now</Text>
            </View>
        </View>
    </Card>
);

// Section Navigation Tabs
const SectionTabs: React.FC<SectionTabsProps> = ({ activeSection, setActiveSection, colors }) => {
    const sections = [
        { id: 'feed', emoji: '📱', name: 'Feed' },
        { id: 'groups', emoji: '👥', name: 'Groups' },
        { id: 'stories', emoji: '📖', name: 'Stories' },
        { id: 'local', emoji: '📍', name: 'Local' }
    ];

    return (
        <View style={styles.sectionTabsContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sectionTabsContent}
            >
                {sections.map(section => (
                    <TouchableOpacity
                        key={section.id}
                        style={[
                            styles.sectionTab,
                            { backgroundColor: colors.backgroundSecondary },
                            activeSection === section.id && [
                                styles.activeSectionTab,
                                { backgroundColor: colors.primary }
                            ]
                        ]}
                        onPress={() => setActiveSection(section.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.sectionEmoji,
                            activeSection === section.id && styles.activeSectionEmoji
                        ]}>
                            {section.emoji}
                        </Text>
                        <Text style={[
                            styles.sectionName,
                            { color: colors.textSecondary },
                            activeSection === section.id && styles.activeSectionName
                        ]}>
                            {section.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// Community Feed Component
const CommunityFeed: React.FC<CommunityFeedProps> = ({ colors }) => {
    const feedPosts: FeedPost[] = [
        {
            id: '1',
            user: { name: 'Sarah Explorer', avatar: '🏕️', level: 'Eco Wanderer' },
            type: 'solo_story',
            timeAgo: '2 hours ago',
            content: 'Just discovered this amazing sustainable café in Prague! ☕ They grow their own beans and use 100% renewable energy.',
            location: 'Prague, Czech Republic',
            ecoPoints: 45,
            comments: 12,
            likes: 89,
            tags: ['#SoloTravel', '#Prague', '#SustainableCafe'],
            isVerified: true
        }
    ];

    return (
        <>
            {/* Quick Actions */}
            <Card style={styles.quickActionCard}>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>Quick Actions</Text>
                <View style={styles.quickActionButtons}>
                    <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: `${colors.primary}15` }]}
                        onPress={() => Alert.alert('Share Story', 'Story sharing coming soon!')}
                    >
                        <Text style={styles.quickActionEmoji}>📖</Text>
                        <Text style={[styles.quickActionText, { color: colors.primary }]}>Share Story</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: `${colors.success}15` }]}
                        onPress={() => Alert.alert('Find Group', 'Group finder coming soon!')}
                    >
                        <Text style={styles.quickActionEmoji}>👥</Text>
                        <Text style={[styles.quickActionText, { color: colors.success }]}>Find Group</Text>
                    </TouchableOpacity>
                </View>
            </Card>

            {/* Feed Posts */}
            {feedPosts.map(post => (
                <Card key={post.id} style={styles.feedCard}>
                    <PostHeader post={post} colors={colors} />
                    <PostContent post={post} colors={colors} />
                    <PostActions post={post} colors={colors} />
                </Card>
            ))}
        </>
    );
};

// Post Components
const PostHeader: React.FC<PostProps> = ({ post, colors }) => (
    <View style={styles.postHeader}>
        <View style={styles.userSection}>
            <View style={[styles.userAvatar, { backgroundColor: `${colors.primary}20` }]}>
                <Text style={styles.userAvatarEmoji}>{post.user.avatar}</Text>
            </View>
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>{post.user.name}</Text>
                <Text style={[styles.userLevel, { color: colors.primary }]}>{post.user.level}</Text>
            </View>
        </View>
    </View>
);

const PostContent: React.FC<PostProps> = ({ post, colors }) => (
    <View style={styles.postContent}>
        <Text style={[styles.postText, { color: colors.text }]}>{post.content}</Text>
        <View style={styles.postLocation}>
            <Text style={styles.locationEmoji}>📍</Text>
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>{post.location}</Text>
        </View>
    </View>
);

const PostActions: React.FC<PostProps> = ({ post, colors }) => (
    <View style={[styles.postActions, { borderTopColor: `${colors.border}50` }]}>
        <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>🌱</Text>
            <Text style={[styles.actionCount, { color: colors.textSecondary }]}>{post.ecoPoints}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionEmoji}>❤️</Text>
            <Text style={[styles.actionCount, { color: colors.textSecondary }]}>{post.likes}</Text>
        </TouchableOpacity>
    </View>
);

// Placeholder Components
const TravelGroups: React.FC<PlaceholderProps> = ({ colors }) => (
    <Card style={styles.placeholderCard}>
        <Text style={styles.placeholderEmoji}>👥</Text>
        <Text style={[styles.placeholderTitle, { color: colors.text }]}>Travel Groups</Text>
        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Find travel companions and join group adventures.
        </Text>
        <TouchableOpacity
            style={[styles.comingSoonButton, { backgroundColor: colors.primary }]}
            onPress={() => Alert.alert('Travel Groups', 'Group features coming soon!')}
        >
            <Text style={styles.comingSoonText}>Coming Soon</Text>
        </TouchableOpacity>
    </Card>
);

const TravelStories: React.FC<PlaceholderProps> = ({ colors }) => (
    <Card style={styles.placeholderCard}>
        <Text style={styles.placeholderEmoji}>📖</Text>
        <Text style={[styles.placeholderTitle, { color: colors.text }]}>Travel Stories</Text>
        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Read and share detailed travel experiences.
        </Text>
        <TouchableOpacity
            style={[styles.comingSoonButton, { backgroundColor: colors.primary }]}
            onPress={() => Alert.alert('Travel Stories', 'Stories feature coming soon!')}
        >
            <Text style={styles.comingSoonText}>Coming Soon</Text>
        </TouchableOpacity>
    </Card>
);

const LocalCommunity: React.FC<PlaceholderProps> = ({ colors }) => (
    <Card style={styles.placeholderCard}>
        <Text style={styles.placeholderEmoji}>📍</Text>
        <Text style={[styles.placeholderTitle, { color: colors.text }]}>Local Community</Text>
        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Connect with locals and get insider tips.
        </Text>
        <TouchableOpacity
            style={[styles.comingSoonButton, { backgroundColor: colors.primary }]}
            onPress={() => Alert.alert('Local Community', 'Local features coming soon!')}
        >
            <Text style={styles.comingSoonText}>Coming Soon</Text>
        </TouchableOpacity>
    </Card>
);

// Styles
const styles = StyleSheet.create({
    headerCard: {
        marginBottom: Layout.spacing.base,
    },
    communityHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Layout.spacing.base,
    },
    communityEmoji: {
        fontSize: 40,
        marginRight: Layout.spacing.base,
    },
    communityInfo: {
        flex: 1,
    },
    communityTitle: {
        fontSize: Typography.sizes['2xl'],
        fontFamily: Typography.fonts.bold,
        marginBottom: 4,
    },
    communitySubtitle: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.medium,
    },
    joinButton: {
        paddingHorizontal: Layout.spacing.base,
        paddingVertical: Layout.spacing.sm,
        borderRadius: Layout.radius.base,
    },
    joinButtonText: {
        color: '#FFFFFF',
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.semiBold,
    },
    globalImpactRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    impactStat: {
        flex: 1,
        alignItems: 'center',
    },
    impactNumber: {
        fontSize: Typography.sizes.lg,
        fontFamily: Typography.fonts.bold,
        marginBottom: 2,
    },
    impactLabel: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.medium,
        textAlign: 'center',
    },
    impactSeparator: {
        paddingHorizontal: Layout.spacing.sm,
    },
    separatorLine: {
        width: 1,
        height: 30,
    },
    sectionTabsContainer: {
        marginBottom: Layout.spacing.base,
    },
    sectionTabsContent: {
        paddingHorizontal: Layout.spacing.base,
        gap: Layout.spacing.sm,
    },
    sectionTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Layout.spacing.base,
        paddingVertical: Layout.spacing.sm,
        borderRadius: Layout.radius.lg,
    },
    activeSectionTab: {},
    sectionEmoji: {
        fontSize: 16,
        marginRight: 6,
    },
    activeSectionEmoji: {},
    sectionName: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.medium,
    },
    activeSectionName: {
        color: '#FFFFFF',
    },
    quickActionCard: {
        marginBottom: Layout.spacing.base,
    },
    quickActionTitle: {
        fontSize: Typography.sizes.lg,
        fontFamily: Typography.fonts.semiBold,
        marginBottom: Layout.spacing.base,
    },
    quickActionButtons: {
        flexDirection: 'row',
        gap: Layout.spacing.sm,
    },
    quickActionButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Layout.spacing.base,
        borderRadius: Layout.radius.base,
    },
    quickActionEmoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    quickActionText: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.medium,
    },
    feedCard: {
        marginBottom: Layout.spacing.base,
    },
    postHeader: {
        flexDirection: 'row',
        marginBottom: Layout.spacing.base,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Layout.spacing.base,
    },
    userAvatarEmoji: {
        fontSize: 18,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.semiBold,
        marginBottom: 2,
    },
    userLevel: {
        fontSize: Typography.sizes.xs,
        fontFamily: Typography.fonts.medium,
    },
    postContent: {
        marginBottom: Layout.spacing.base,
    },
    postText: {
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.regular,
        marginBottom: Layout.spacing.base,
    },
    postLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Layout.spacing.sm,
    },
    locationEmoji: {
        fontSize: 14,
        marginRight: 6,
    },
    locationText: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.medium,
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Layout.spacing.base,
        borderTopWidth: 1,
        gap: Layout.spacing.lg,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionEmoji: {
        fontSize: 16,
        marginRight: 4,
    },
    actionCount: {
        fontSize: Typography.sizes.sm,
        fontFamily: Typography.fonts.medium,
    },
    placeholderCard: {
        alignItems: 'center',
        paddingVertical: Layout.spacing['3xl'],
    },
    placeholderEmoji: {
        fontSize: 64,
        marginBottom: Layout.spacing.lg,
    },
    placeholderTitle: {
        fontSize: Typography.sizes['2xl'],
        fontFamily: Typography.fonts.bold,
        marginBottom: Layout.spacing.base,
        textAlign: 'center',
    },
    placeholderText: {
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.regular,
        textAlign: 'center',
        marginBottom: Layout.spacing.xl,
        paddingHorizontal: Layout.spacing.lg,
    },
    comingSoonButton: {
        paddingHorizontal: Layout.spacing.xl,
        paddingVertical: Layout.spacing.base,
        borderRadius: Layout.radius.base,
    },
    comingSoonText: {
        color: '#FFFFFF',
        fontSize: Typography.sizes.base,
        fontFamily: Typography.fonts.semiBold,
    },
});

// CRITICAL: Make sure this is the default export
