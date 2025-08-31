// app/spots/add.tsx - Complete new file
import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    StyleSheet,
    Platform,
} from 'react-native';
import { Text } from '@/components/Themed';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useColorScheme } from '@/components/useColorScheme';
import { router, useLocalSearchParams } from 'expo-router';
import { apiClient } from '@/app/services/api';
import {apiCache} from "@/app/services/api-cache";

const SPOT_TYPES = [
    { value: 'highway_entrance', label: 'Highway Entrance', emoji: '🛣️' },
    { value: 'rest_stop', label: 'Rest Stop', emoji: '🛑' },
    { value: 'gas_station', label: 'Gas Station', emoji: '⛽' },
    { value: 'bridge', label: 'Bridge', emoji: '🌉' },
    { value: 'roundabout', label: 'Roundabout', emoji: '🔄' },
    { value: 'parking_lot', label: 'Parking Lot', emoji: '🅿️' },
    { value: 'other', label: 'Other', emoji: '📍' },
];

const FACILITIES = [
    { value: 'restroom', label: 'Restroom', emoji: '🚻' },
    { value: 'food', label: 'Food', emoji: '🍔' },
    { value: 'parking', label: 'Parking', emoji: '🅿️' },
    { value: 'wifi', label: 'WiFi', emoji: '📶' },
    { value: 'atm', label: 'ATM', emoji: '💳' },
    { value: 'shelter', label: 'Shelter', emoji: '🏠' },
];

export default function AddSpotScreen() {
    const params = useLocalSearchParams<{
        latitude?: string;
        longitude?: string;
    }>();

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        spot_type: '',
        tips: '',
        accessibility_info: '',
        facilities: [] as string[],
    });

    // Location state
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
        address: string;
    } | null>(null);

    // Photo state
    const [photos, setPhotos] = useState<string[]>([]);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    useEffect(() => {
        if (params.latitude && params.longitude) {
            const lat = parseFloat(params.latitude);
            const lng = parseFloat(params.longitude);

            setLocation({
                latitude: lat,
                longitude: lng,
                address: 'Getting address...'
            });

            getAddressFromCoordinates(lat, lng);
        } else {
            getCurrentLocation();
        }
    }, [params.latitude, params.longitude]);

    const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
        setIsLoadingAddress(true);
        try {
            const address = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            const addressString = address[0] ?
                `${address[0].street || ''} ${address[0].city || ''} ${address[0].country || ''}`.trim()
                : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

            setLocation(prev => prev ? {
                ...prev,
                address: addressString
            } : null);
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            setLocation(prev => prev ? {
                ...prev,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            } : null);
        } finally {
            setIsLoadingAddress(false);
        }
    };

    const getCurrentLocation = async () => {
        setIsLoadingAddress(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Location permission is required to add spots');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const address = await Location.reverseGeocodeAsync({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });

            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                address: address[0] ?
                    `${address[0].street || ''} ${address[0].city || ''} ${address[0].country || ''}`.trim()
                    : 'Unknown location'
            });
        } catch (error) {
            Alert.alert('Error', 'Could not get current location');
            console.error('Location error:', error);
        } finally {
            setIsLoadingAddress(false);
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Camera roll permission is required to add photos');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 5 - photos.length,
            });

            if (!result.canceled) {
                const newPhotos = result.assets.map(asset => asset.uri);
                setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
            }
        } catch (error) {
            Alert.alert('Error', 'Could not pick images');
            console.error('Image picker error:', error);
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Camera permission is required to take photos');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setPhotos(prev => [...prev, result.assets[0].uri].slice(0, 5));
            }
        } catch (error) {
            Alert.alert('Error', 'Could not take photo');
            console.error('Camera error:', error);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const toggleFacility = (facility: string) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter a spot name');
            return false;
        }
        if (!formData.description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return false;
        }
        if (!formData.spot_type) {
            Alert.alert('Error', 'Please select a spot type');
            return false;
        }
        if (!location) {
            Alert.alert('Error', 'Location is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const spotData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                latitude: location!.latitude,
                longitude: location!.longitude,
                spot_type: formData.spot_type,
                tips: formData.tips.trim() || undefined,
                accessibility_info: formData.accessibility_info.trim() || undefined,
                facilities: formData.facilities,
            };

            await apiClient.createSpot(spotData);
            apiCache.invalidate('spots');

            Alert.alert(
                'Success! 🎉',
                'Your hitchhiking spot has been added successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );

        } catch (error) {
            Alert.alert('Error', 'Failed to create spot. Please try again.');
            console.error('Spot creation error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Screen scrollable>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Add Hitchhiking Spot</Text>
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading}
                    style={[
                        styles.submitButton,
                        { backgroundColor: isLoading ? colors.textSecondary : colors.primary }
                    ]}
                >
                    <Text style={styles.submitButtonText}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Selected Location Card */}
            <Card style={styles.locationCard}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>📍 Selected Location</Text>

                {location ? (
                    <View style={styles.locationInfo}>
                        <Text style={[styles.locationAddress, { color: colors.text }]}>
                            {isLoadingAddress ? 'Getting address...' : location.address}
                        </Text>
                        <Text style={[styles.locationCoords, { color: colors.textSecondary }]}>
                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </Text>
                        {params.latitude && params.longitude && (
                            <View style={[styles.mapSelectedBadge, { backgroundColor: colors.success }]}>
                                <Text style={styles.mapSelectedText}>✓ Selected from map</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <Text style={[styles.noLocation, { color: colors.textSecondary }]}>
                        No location available
                    </Text>
                )}
            </Card>

            {/* Basic Info */}
            <Card>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>

                <TextInput
                    style={[styles.input, {
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary
                    }]}
                    placeholder="Spot name (e.g. 'Highway A1 Rest Stop')"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.name}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    maxLength={100}
                />

                <TextInput
                    style={[styles.textArea, {
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary
                    }]}
                    placeholder="Describe this hitchhiking spot. What makes it good? Safety info, visibility, traffic flow, etc."
                    placeholderTextColor={colors.textSecondary}
                    value={formData.description}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                />
            </Card>

            {/* Spot Type */}
            <Card>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Spot Type</Text>
                <View style={styles.typeGrid}>
                    {SPOT_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type.value}
                            style={[
                                styles.typeButton,
                                { backgroundColor: colors.backgroundSecondary },
                                formData.spot_type === type.value && {
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary
                                }
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, spot_type: type.value }))}
                        >
                            <Text style={styles.typeEmoji}>{type.emoji}</Text>
                            <Text style={[
                                styles.typeLabel,
                                { color: colors.text },
                                formData.spot_type === type.value && { color: '#FFFFFF' }
                            ]}>
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Card>

            {/* Facilities */}
            <Card>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Facilities</Text>
                <View style={styles.facilitiesGrid}>
                    {FACILITIES.map((facility) => (
                        <TouchableOpacity
                            key={facility.value}
                            style={[
                                styles.facilityButton,
                                { backgroundColor: colors.backgroundSecondary },
                                formData.facilities.includes(facility.value) && {
                                    backgroundColor: colors.success,
                                    borderColor: colors.success
                                }
                            ]}
                            onPress={() => toggleFacility(facility.value)}
                        >
                            <Text style={styles.facilityEmoji}>{facility.emoji}</Text>
                            <Text style={[
                                styles.facilityLabel,
                                { color: colors.text },
                                formData.facilities.includes(facility.value) && { color: '#FFFFFF' }
                            ]}>
                                {facility.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Card>

            {/* Photos */}
            <Card>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Photos ({photos.length}/5)</Text>

                <View style={styles.photoActions}>
                    <TouchableOpacity
                        style={[styles.photoActionButton, { backgroundColor: colors.primary }]}
                        onPress={takePhoto}
                        disabled={photos.length >= 5}
                    >
                        <Text style={styles.photoActionText}>📷 Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.photoActionButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, borderWidth: 1 }]}
                        onPress={pickImage}
                        disabled={photos.length >= 5}
                    >
                        <Text style={[styles.photoActionText, { color: colors.text }]}>🖼️ Choose Photos</Text>
                    </TouchableOpacity>
                </View>

                {photos.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                        {photos.map((photo, index) => (
                            <View key={index} style={styles.photoContainer}>
                                <Image source={{ uri: photo }} style={styles.photo} />
                                <TouchableOpacity
                                    style={styles.removePhotoButton}
                                    onPress={() => removePhoto(index)}
                                >
                                    <Text style={styles.removePhotoText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </Card>

            {/* Tips & Accessibility */}
            <Card>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Information</Text>

                <TextInput
                    style={[styles.textArea, {
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary
                    }]}
                    placeholder="Hitchhiking tips for this spot (optional)&#10;e.g. 'Best time is early morning', 'Stand near the blue sign', etc."
                    placeholderTextColor={colors.textSecondary}
                    value={formData.tips}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, tips: text }))}
                    multiline
                    numberOfLines={3}
                    maxLength={300}
                />

                <TextInput
                    style={[styles.input, {
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: colors.backgroundSecondary
                    }]}
                    placeholder="Accessibility information (optional)"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.accessibility_info}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, accessibility_info: text }))}
                    maxLength={200}
                />
            </Card>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Layout.spacing.base,
        marginBottom: Layout.spacing.base,
    },
    cancelButton: {
        fontSize: 16,
        fontWeight: '500',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    submitButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    locationCard: {
        marginBottom: Layout.spacing.base,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Layout.spacing.base,
    },
    locationInfo: {
        paddingVertical: Layout.spacing.sm,
    },
    locationAddress: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    locationCoords: {
        fontSize: 14,
        fontFamily: 'monospace',
    },
    mapSelectedBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    mapSelectedText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    noLocation: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: Layout.spacing.lg,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: Layout.spacing.base,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: Layout.spacing.base,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Layout.spacing.sm,
    },
    typeButton: {
        flex: 1,
        minWidth: '45%',
        maxWidth: '48%',
        paddingVertical: Layout.spacing.base,
        paddingHorizontal: Layout.spacing.sm,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    typeEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    typeLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    facilitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Layout.spacing.xs,
    },
    facilityButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    facilityEmoji: {
        fontSize: 14,
        marginRight: 4,
    },
    facilityLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    photoActions: {
        flexDirection: 'row',
        gap: Layout.spacing.sm,
        marginBottom: Layout.spacing.base,
    },
    photoActionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    photoActionText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    photosContainer: {
        marginTop: Layout.spacing.sm,
    },
    photoContainer: {
        position: 'relative',
        marginRight: Layout.spacing.sm,
    },
    photo: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removePhotoButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FF4444',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removePhotoText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});