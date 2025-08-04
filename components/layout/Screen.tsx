import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
    children: React.ReactNode;
    scrollable?: boolean;
    padding?: boolean;
    backgroundColor?: string;
    style?: any;
}

export function Screen({
                           children,
                           scrollable = false,
                           padding = true,
                           backgroundColor = '#f5f5f5',
                           style
                       }: ScreenProps) {
    const Container = scrollable ? ScrollView : View;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <Container
                style={[styles.content, padding && styles.padding, style]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={scrollable ? styles.scrollContent : undefined}
            >
                {children}
            </Container>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    padding: {
        padding: 16,
    },
    scrollContent: {
        flexGrow: 1,
    },
});