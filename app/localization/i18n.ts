import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Translation resources
const resources = {
    en: {
        translation: {
            // Common
            common: {
                loading: 'Loading...',
                error: 'Error',
                success: 'Success',
                cancel: 'Cancel',
                confirm: 'Confirm',
                save: 'Save',
                delete: 'Delete',
                edit: 'Edit',
                back: 'Back',
                next: 'Next',
                finish: 'Finish',
                retry: 'Retry',
                refresh: 'Refresh',
                search: 'Search...',
                filter: 'Filter',
                sort: 'Sort',
                map: 'Map',
                list: 'List',
                settings: 'Settings',
                profile: 'Profile',
                help: 'Help',
                about: 'About',
                terms: 'Terms of Service',
                privacy: 'Privacy Policy',
                logout: 'Logout',
            },

            // Authentication
            auth: {
                welcome: 'Welcome to EcoRide',
                subtitle: 'Travel sustainably, connect authentically',
                login: 'Login',
                register: 'Sign Up',
                forgotPassword: 'Forgot Password?',
                resetPassword: 'Reset Password',
                email: 'Email',
                password: 'Password',
                confirmPassword: 'Confirm Password',
                firstName: 'First Name',
                lastName: 'Last Name',
                dateOfBirth: 'Date of Birth',
                phone: 'Phone Number',
                createAccount: 'Create Account',
                haveAccount: 'Already have an account?',
                noAccount: "Don't have an account?",
                signInWith: 'Sign in with {{provider}}',
                acceptTerms: 'I accept the Terms of Service and Privacy Policy',
                verifyEmail: 'Please verify your email address',
                verificationSent: 'Verification email sent',
            },

            // Navigation
            nav: {
                discover: 'Discover',
                rides: 'Rides',
                add: 'Add',
                community: 'Community',
                profile: 'Profile',
                messages: 'Messages',
                tripPlanning: 'Plan Trip',
                safety: 'Safety Center',
            },

            // Map & Spots
            spots: {
                title: 'Hitchhiking Spots',
                addSpot: 'Add New Spot',
                nearbySpots: 'Nearby Spots',
                spotName: 'Spot Name',
                spotType: 'Spot Type',
                description: 'Description',
                safetyLevel: 'Safety Level',
                tips: 'Hitchhiking Tips',
                photos: 'Photos',
                navigate: 'Navigate',
                report: 'Report',
                save: 'Save Spot',
                saved: 'Saved',
                verified: 'Verified',
                lastUpdated: 'Last updated',
                addedBy: 'Added by',
                reviews: 'reviews',
                safety: {
                    high: 'High Safety',
                    medium: 'Medium Safety',
                    low: 'Low Safety',
                },
                types: {
                    rest_stop: 'Rest Stop',
                    gas_station: 'Gas Station',
                    bridge: 'Bridge',
                    highway_entrance: 'Highway Entrance',
                    town_center: 'Town Center',
                    other: 'Other',
                },
            },

            // Ride Sharing
            rides: {
                title: 'Find Rides',
                offerRide: 'Offer Ride',
                findRide: 'Find Ride',
                requestRide: 'Request Ride',
                availableRides: 'Available Rides',
                myRides: 'My Rides',
                rideHistory: 'Ride History',
                from: 'From',
                to: 'To',
                date: 'Date',
                time: 'Time',
                passengers: 'Passengers',
                driver: 'Driver',
                route: 'Route',
                price: 'Price',
                duration: 'Duration',
                distance: 'Distance',
                carbonSaved: 'CO₂ Saved',
                seat: 'seat',
                seats: 'seats',
                free: 'Free',
                preferences: {
                    smoking: 'Smoking',
                    pets: 'Pets',
                    music: 'Music',
                    conversation: 'Conversation',
                    allowed: 'Allowed',
                    notAllowed: 'Not Allowed',
                    quiet: 'Quiet',
                    moderate: 'Moderate',
                    loud: 'Loud',
                    minimal: 'Minimal',
                    chatty: 'Chatty',
                },
            },

            // Community
            community: {
                title: 'Community',
                discussions: 'Discussions',
                createPost: 'Create Post',
                reportIssue: 'Report Issue',
                tips: 'Tips',
                questions: 'Questions',
                safety: 'Safety',
                stories: 'Stories',
                routePlanning: 'Route Planning',
                likes: 'likes',
                comments: 'comments',
                share: 'Share',
                reply: 'Reply',
                loadMore: 'Load More Posts',
            },

            // Profile
            profile: {
                title: 'Profile',
                editProfile: 'Edit Profile',
                mySpots: 'My Spots',
                savedSpots: 'Saved Spots',
                tripHistory: 'Trip History',
                notifications: 'Notifications',
                privacySafety: 'Privacy & Safety',
                helpSupport: 'Help & Support',
                rateApp: 'Rate EcoRide',
                spotsAdded: 'Spots Added',
                totalRides: 'Total Rides',
                countries: 'Countries',
                rating: 'Rating',
                level: 'Level',
                memberSince: 'Member since',
                stats: {
                    carbonSaved: 'CO₂ Saved',
                    moneySaved: 'Money Saved',
                    timeSpent: 'Time Spent',
                    friendsMade: 'Friends Made',
                },
            },

            // Trip Planning
            trip: {
                title: 'Trip Planning',
                newTrip: 'New Trip',
                tripName: 'Trip Name',
                startDate: 'Start Date',
                endDate: 'End Date',
                participants: 'Participants',
                budget: 'Budget',
                preferences: 'Preferences',
                safety: 'Safety Settings',
                route: 'Route',
                schedule: 'Schedule',
                checkpoints: 'Checkpoints',
                emergency: 'Emergency',
                checkIn: 'Check In',
                status: {
                    planning: 'Planning',
                    active: 'Active',
                    completed: 'Completed',
                    cancelled: 'Cancelled',
                },
            },

            // Safety
            safety: {
                title: 'Safety Center',
                emergencyContacts: 'Emergency Contacts',
                locationSharing: 'Location Sharing',
                autoCheckIn: 'Auto Check-in',
                safetyTips: 'Safety Tips',
                reportIncident: 'Report Incident',
                emergencyAlert: 'Emergency Alert',
                checkInStatus: 'Check-in Status',
                lastSeen: 'Last seen',
                batteryLevel: 'Battery Level',
                guidelines: {
                    title: 'Safety Guidelines',
                    item1: 'Always share your location with trusted contacts',
                    item2: 'Check in regularly during your trip',
                    item3: 'Trust your instincts about people and situations',
                    item4: 'Keep emergency contacts updated',
                    item5: 'Have a backup plan for transportation',
                },
            },

            // Messaging
            messages: {
                title: 'Messages',
                typeMessage: 'Type a message...',
                sendMessage: 'Send',
                shareLocation: 'Share Location',
                locationShared: 'Location Shared',
                typing: '{{name}} is typing...',
                online: 'Online',
                lastSeen: 'Last seen {{time}}',
                safetyFeatures: 'Safety features active',
                emergencyAlert: 'Emergency Alert',
                voiceCall: 'Voice Call',
                videoCall: 'Video Call',
            },

            // Notifications
            notifications: {
                rideRequest: 'New ride request from {{name}}',
                rideAccepted: 'Your ride request was accepted',
                rideRejected: 'Your ride request was rejected',
                messageReceived: 'New message from {{name}}',
                tripStarted: 'Trip started: {{route}}',
                checkInReminder: 'Time for safety check-in',
                emergencyAlert: 'Emergency alert from {{name}}',
                spotApproved: 'Your spot "{{name}}" was approved',
                newSpotNearby: 'New hitchhiking spot added nearby',
            },

            // Errors
            errors: {
                network: 'Network connection error',
                locationPermission: 'Location permission required',
                cameraPermission: 'Camera permission required',
                loginFailed: 'Login failed. Please check your credentials.',
                registrationFailed: 'Registration failed. Please try again.',
                tripCreationFailed: 'Failed to create trip',
                spotSubmissionFailed: 'Failed to submit spot',
                messageNotSent: 'Message could not be sent',
                locationNotShared: 'Could not share location',
                emergencyAlertFailed: 'Emergency alert could not be sent',
            },

            // Success Messages
            success: {
                loginSuccess: 'Welcome back!',
                registrationSuccess: 'Account created successfully',
                spotAdded: 'Spot added successfully',
                tripCreated: 'Trip created successfully',
                profileUpdated: 'Profile updated',
                messagesSent: 'Message sent',
                locationShared: 'Location shared',
                emergencyAlertSent: 'Emergency alert sent',
                checkInCompleted: 'Check-in completed',
            },
        },
    },
    pl: {
        translation: {
            // Common - Polish translations
            common: {
                loading: 'Ładowanie...',
                error: 'Błąd',
                success: 'Sukces',
                cancel: 'Anuluj',
                confirm: 'Potwierdź',
                save: 'Zapisz',
                delete: 'Usuń',
                edit: 'Edytuj',
                back: 'Wstecz',
                next: 'Dalej',
                finish: 'Zakończ',
                retry: 'Spróbuj ponownie',
                refresh: 'Odśwież',
                search: 'Szukaj...',
                filter: 'Filtruj',
                sort: 'Sortuj',
                map: 'Mapa',
                list: 'Lista',
                settings: 'Ustawienia',
                profile: 'Profil',
                help: 'Pomoc',
                about: 'O aplikacji',
                terms: 'Regulamin',
                privacy: 'Polityka prywatności',
                logout: 'Wyloguj',
            },

            // Authentication - Polish
            auth: {
                welcome: 'Witamy w EcoRide',
                subtitle: 'Podróżuj zrównoważenie, łącz się autentycznie',
                login: 'Zaloguj się',
                register: 'Zarejestruj się',
                forgotPassword: 'Zapomniałeś hasła?',
                resetPassword: 'Resetuj hasło',
                email: 'Email',
                password: 'Hasło',
                confirmPassword: 'Potwierdź hasło',
                firstName: 'Imię',
                lastName: 'Nazwisko',
                dateOfBirth: 'Data urodzenia',
                phone: 'Numer telefonu',
                createAccount: 'Utwórz konto',
                haveAccount: 'Masz już konto?',
                noAccount: 'Nie masz konta?',
                signInWith: 'Zaloguj się przez {{provider}}',
                acceptTerms: 'Akceptuję Regulamin i Politykę Prywatności',
                verifyEmail: 'Proszę zweryfikować adres email',
                verificationSent: 'Email weryfikacyjny wysłany',
            },

            // Add more Polish translations as needed...
            nav: {
                discover: 'Odkrywaj',
                rides: 'Przejazdy',
                add: 'Dodaj',
                community: 'Społeczność',
                profile: 'Profil',
                messages: 'Wiadomości',
                tripPlanning: 'Planuj Podróż',
                safety: 'Centrum Bezpieczeństwa',
            },

            spots: {
                title: 'Miejsca Autostopowe',
                addSpot: 'Dodaj Nowe Miejsce',
                nearbySpots: 'Miejsca w Pobliżu',
                spotName: 'Nazwa Miejsca',
                spotType: 'Typ Miejsca',
                description: 'Opis',
                safetyLevel: 'Poziom Bezpieczeństwa',
                tips: 'Wskazówki Autostopowe',
                photos: 'Zdjęcia',
                navigate: 'Nawiguj',
                report: 'Zgłoś',
                save: 'Zapisz Miejsce',
                saved: 'Zapisane',
                verified: 'Zweryfikowane',
                lastUpdated: 'Ostatnio aktualizowane',
                addedBy: 'Dodane przez',
                reviews: 'opinie',
                safety: {
                    high: 'Wysokie Bezpieczeństwo',
                    medium: 'Średnie Bezpieczeństwo',
                    low: 'Niskie Bezpieczeństwo',
                },
                types: {
                    rest_stop: 'Miejsce Odpoczynku',
                    gas_station: 'Stacja Benzynowa',
                    bridge: 'Most',
                    highway_entrance: 'Wjazd na Autostradę',
                    town_center: 'Centrum Miasta',
                    other: 'Inne',
                },
            },

            // Continue with other Polish translations...
        },
    },
};

const LANGUAGE_DETECTOR = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem('user-language');
            if (savedLanguage) {
                callback(savedLanguage);
            } else {
                // Default to English if no saved language
                callback('en');
            }
        } catch (error) {
            console.error('Error reading language from storage:', error);
            callback('en');
        }
    },
    init: () => {},
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem('user-language', language);
        } catch (error) {
            console.error('Error saving language to storage:', error);
        }
    },
};

export const initializeI18n = async () => {
    return i18n
        .use(LANGUAGE_DETECTOR)
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng: 'en',
            debug: __DEV__,
            interpolation: {
                escapeValue: false,
            },
            react: {
                useSuspense: false,
            },
        });
};

export default i18n;