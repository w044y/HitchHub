import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const mockPosts = [
    {
        id: 1,
        author: 'RoadWanderer',
        avatar: '🎒',
        time: '2h ago',
        type: 'tip',
        title: 'Best hitchhiking spot on Highway 101!',
        content: 'Just discovered this amazing rest stop with great visibility and friendly drivers. Got 3 rides in 30 minutes!',
        likes: 12,
        comments: 5,
        location: 'Highway 101, CA',
    },
    {
        id: 2,
        author: 'NomadLife',
        avatar: '🌟',
        time: '5h ago',
        type: 'question',
        title: 'Hitchhiking etiquette in Europe?',
        content: 'Planning my first hitchhiking trip across Europe. Any cultural differences I should know about?',
        likes: 8,
        comments: 15,
        location: 'General Discussion',
    },
    {
        id: 3,
        author: 'SafetyFirst',
        avatar: '🛡️',
        time: '1d ago',
        type: 'safety',
        title: 'Night hitchhiking safety tips',
        content: 'After 5 years of hitchhiking, here are my essential safety tips for traveling after dark...',
        likes: 25,
        comments: 8,
        location: 'Safety Tips',
    },
];

const categories = ['All', 'Tips', 'Questions', 'Safety', 'Route Planning', 'Stories'];

export default function CommunityScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const getPostTypeColor = (type: string) => {
        switch (type) {
            case 'tip': return '#4CAF50';
            case 'question': return '#2196F3';
            case 'safety': return '#FF9800';
            default: return colors.primary;
        }
    };

    const getPostTypeIcon = (type: string) => {
        switch (type) {
            case 'tip': return '💡';
            case 'question': return '❓';
            case 'safety': return '🛡️';
            default: return '💬';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Search */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.searchInput, {
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.border,
                        color: colors.text
                    }]}
                    placeholder="Search discussions..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[styles.categoryChip, {
                            backgroundColor: selectedCategory === category ? colors.primary : colors.secondary,
                            borderColor: colors.border
                        }]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[styles.categoryText, {
                            color: selectedCategory === category ? '#ffffff' : colors.text
                        }]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.actionButtonText}>✍️ Create Post</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accent }]}>
                    <Text style={styles.actionButtonText}>🚨 Report Issue</Text>
                </TouchableOpacity>
            </View>

            {/* Posts */}
            <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
                {mockPosts.map((post) => (
                    <TouchableOpacity
                        key={post.id}
                        style={[styles.postCard, {
                            backgroundColor: colors.background,
                            borderColor: colors.border
                        }]}
                    >
                        {/* Post Header */}
                        <View style={styles.postHeader}>
                            <View style={styles.authorInfo}>
                                <Text style={styles.avatar}>{post.avatar}</Text>
                                <View style={styles.authorDetails}>
                                    <Text style={[styles.authorName, { color: colors.text }]}>{post.author}</Text>
                                    <Text style={[styles.postTime, { color: colors.textSecondary }]}>{post.time}</Text>
                                </View>
                            </View>
                            <View style={[styles.postTypeBadge, { backgroundColor: getPostTypeColor(post.type) }]}>
                                <Text style={styles.postTypeText}>
                                    {getPostTypeIcon(post.type)} {post.type.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        {/* Post Content */}
                        <View style={styles.postContent}>
                            <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
                            <Text style={[styles.postText, { color: colors.textSecondary }]} numberOfLines={3}>
                                {post.content}
                            </Text>
                            <Text style={[styles.postLocation, { color: colors.primary }]}>
                                📍 {post.location}
                            </Text>
                        </View>

                        {/* Post Actions */}
                        <View style={styles.postActions}>
                            <TouchableOpacity style={styles.actionItem}>
                                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                                    👍 {post.likes}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionItem}>
                                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                                    💬 {post.comments}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionItem}>
                                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                                    🔗 Share
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Load More */}
                <TouchableOpacity style={[styles.loadMoreButton, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.loadMoreText, { color: colors.text }]}>Load More Posts</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
    },
    categoriesContainer: {
        marginBottom: 16,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    postsContainer: {
        flex: 1,
    },
    postCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        fontSize: 20,
        marginRight: 8,
    },
    authorDetails: {
        flex: 1,
    },
    authorName: {
        fontSize: 14,
        fontWeight: '600',
    },
    postTime: {
        fontSize: 12,
    },
    postTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    postTypeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '600',
    },
    postContent: {
        marginBottom: 12,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    postText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    postLocation: {
        fontSize: 12,
        fontWeight: '500',
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 12,
    },
    actionItem: {
        flex: 1,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '500',
    },
    loadMoreButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    loadMoreText: {
        fontSize: 14,
        fontWeight: '600',
    },
});