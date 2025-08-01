import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const spotTypes = ['Rest Stop', 'Gas Station', 'Bridge', 'Highway Entrance', 'Town Center', 'Other'];
const safetyLevels = ['High', 'Medium', 'Low'];

export default function AddSpotScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [spotName, setSpotName] = useState('');
    const [spotType, setSpotType] = useState('');
    const [description, setDescription] = useState('');
    const [safetyLevel, setSafetyLevel] = useState('');
    const [tips, setTips] = useState('');

    const handleSubmit = () => {
        if (!spotName || !spotType || !safetyLevel) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        Alert.alert(
            'Spot Added!',
            'Thank you for contributing to the HitchSpot community!',
            [{ text: 'OK' }]
        );

        // Reset form
        setSpotName('');
        setSpotType('');
        setDescription('');
        setSafetyLevel('');
        setTips('');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Add New Spot</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Help fellow hitchhikers by sharing a great spot you've discovered!
                    </Text>
                </View>

                {/* Current Location */}
                <TouchableOpacity style={[styles.locationCard, {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border
                }]}>
                    <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>Current Location</Text>
                    <Text style={[styles.locationText, { color: colors.text }]}>
                        📍 Loading your location...
                    </Text>
                    <Text style={[styles.locationSubtext, { color: colors.textSecondary }]}>
                        Tap to change or adjust pin on map
                    </Text>
                </TouchableOpacity>

                {/* Form */}
                <View style={styles.form}>
                    {/* Spot Name */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Spot Name *</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: colors.inputBackground,
                                borderColor: colors.border,
                                color: colors.text
                            }]}
                            placeholder="e.g., Highway 101 Rest Area"
                            placeholderTextColor={colors.textSecondary}
                            value={spotName}
                            onChangeText={setSpotName}
                        />
                    </View>

                    {/* Spot Type */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Spot Type *</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                            {spotTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.chip, {
                                        backgroundColor: spotType === type ? colors.primary : colors.secondary,
                                        borderColor: colors.border
                                    }]}
                                    onPress={() => setSpotType(type)}
                                >
                                    <Text style={[styles.chipText, {
                                        color: spotType === type ? '#ffffff' : colors.text
                                    }]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Safety Level */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Safety Level *</Text>
                        <View style={styles.safetyContainer}>
                            {safetyLevels.map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    style={[styles.safetyButton, {
                                        backgroundColor: safetyLevel === level ? colors.primary : colors.secondary,
                                        borderColor: colors.border
                                    }]}
                                    onPress={() => setSafetyLevel(level)}
                                >
                                    <Text style={[styles.safetyText, {
                                        color: safetyLevel === level ? '#ffffff' : colors.text
                                    }]}>
                                        {level === 'High' ? '🟢' : level === 'Medium' ? '🟡' : '🔴'} {level}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.inputBackground,
                                borderColor: colors.border,
                                color: colors.text
                            }]}
                            placeholder="Describe the location, visibility, traffic flow, etc."
                            placeholderTextColor={colors.textSecondary}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    {/* Tips */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Hitchhiking Tips</Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.inputBackground,
                                borderColor: colors.border,
                                color: colors.text
                            }]}
                            placeholder="Share any tips for this location (best times, positioning, etc.)"
                            placeholderTextColor={colors.textSecondary}
                            value={tips}
                            onChangeText={setTips}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Photo Upload Placeholder */}
                    <TouchableOpacity style={[styles.photoUpload, {
                        backgroundColor: colors.secondary,
                        borderColor: colors.border
                    }]}>
                        <Text style={[styles.photoUploadText, { color: colors.textSecondary }]}>
                            📷 Add Photos (Optional)
                        </Text>
                        <Text style={[styles.photoUploadSubtext, { color: colors.textSecondary }]}>
                            Help others visualize the spot
                        </Text>
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: colors.primary }]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>✨ Add Spot to Community</Text>
                    </TouchableOpacity>

                    {/* Guidelines */}
                    <View style={[styles.guidelines, { backgroundColor: colors.secondary }]}>
                        <Text style={[styles.guidelinesTitle, { color: colors.text }]}>
                            📋 Community Guidelines
                        </Text>
                        <Text style={[styles.guidelinesText, { color: colors.textSecondary }]}>
                            • Only add spots you've personally used{'\n'}
                            • Be honest about safety conditions{'\n'}
                            • Respect private property and local laws{'\n'}
                            • Include helpful details for other hitchhikers
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 22,
    },
    locationCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 24,
    },
    locationLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    locationSubtext: {
        fontSize: 12,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    chipContainer: {
        flexDirection: 'row',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    safetyContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    safetyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    safetyText: {
        fontSize: 14,
        fontWeight: '600',
    },
    photoUpload: {
        padding: 20,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    photoUploadText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    photoUploadSubtext: {
        fontSize: 12,
    },
    submitButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    guidelines: {
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    guidelinesTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    guidelinesText: {
        fontSize: 12,
        lineHeight: 18,
    },
});