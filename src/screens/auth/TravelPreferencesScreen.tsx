import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Animated,
} from 'react-native';
import { PreferenceCard } from '../../components/common/PreferenceCard';
import { CustomButton } from '../../components/common/CustomButton';
import { palette } from '../../theme/colors/palette';

interface TravelPreferencesScreenProps {
  navigation: any;
  route: any;
}

interface TravelPreference {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export const TravelPreferencesScreen: React.FC<TravelPreferencesScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { email, registrationData, profileData } = route.params;
  
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const travelPreferences: TravelPreference[] = [
    {
      id: 'arte',
      title: 'Arte',
      description: 'Galleries, exhibitions, street art, and artistic experiences',
      icon: '🎨',
      category: 'cultural'
    },
    {
      id: 'gastronomia',
      title: 'Gastronomía',
      description: 'Local cuisine, restaurants, food tours, and culinary experiences',
      icon: '🍽️',
      category: 'culinary'
    },
    {
      id: 'cine',
      title: 'Cine',
      description: 'Movie theaters, film festivals, and cinema experiences',
      icon: '🎬',
      category: 'entertainment'
    },
    {
      id: 'museos',
      title: 'Museos',
      description: 'Museums, historical sites, and educational experiences',
      icon: '🏛️',
      category: 'cultural'
    },
    {
      id: 'monumentos',
      title: 'Monumentos',
      description: 'Historical monuments, landmarks, and architectural sites',
      icon: '🗿',
      category: 'historical'
    },
    {
      id: 'naturaleza',
      title: 'Naturaleza',
      description: 'Parks, nature reserves, outdoor activities, and eco-tourism',
      icon: '🌿',
      category: 'nature'
    },
    {
      id: 'vida_nocturna',
      title: 'Vida Nocturna',
      description: 'Bars, clubs, nightlife, and evening entertainment',
      icon: '🌃',
      category: 'entertainment'
    },
    {
      id: 'compras',
      title: 'Compras',
      description: 'Shopping centers, local markets, and retail experiences',
      icon: '🛍️',
      category: 'leisure'
    },
    {
      id: 'deportes',
      title: 'Deportes',
      description: 'Sports events, stadiums, and athletic activities',
      icon: '⚽',
      category: 'sports'
    },
    {
      id: 'musica',
      title: 'Música',
      description: 'Concerts, live music venues, and musical experiences',
      icon: '🎵',
      category: 'entertainment'
    }
  ];

  const handleTogglePreference = (preferenceId: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preferenceId)) {
        // Remove if already selected
        return prev.filter(id => id !== preferenceId);
      } else {
        // Add if not selected
        return [...prev, preferenceId];
      }
    });
  };

  const handleCompleteRegistration = async () => {
    if (selectedPreferences.length === 0) {
      Alert.alert(
        'Select Your Interests',
        'Please select at least one travel preference to personalize your experience.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    
    try {
      // Combine all registration data
      const completeUserData = {
        ...registrationData,
        ...profileData,
        email,
        travel_preferences: selectedPreferences,
        preferences_count: selectedPreferences.length,
        preference_categories: [...new Set(
          selectedPreferences.map(id => 
            travelPreferences.find(p => p.id === id)?.category || 'other'
          )
        )],
        registration_completed_at: new Date().toISOString(),
      };
      
      console.log('Complete User Registration Data:', completeUserData);
      
      // Simulate API call to complete registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Welcome to Baxperience! 🎉',
        `Great! We've personalized your experience based on your ${selectedPreferences.length} selected interests. You're all set to explore!`,
        [
          {
            text: 'Start Exploring',
            onPress: () => {
              // Navigate to main app
              navigation.navigate('Main');
            }
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCount = () => selectedPreferences.length;
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
          <Text style={styles.progressText}>Step 3 of 3</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          
          <Text style={styles.title}>What interests you?</Text>
          <Text style={styles.subtitle}>
            Choose your travel preferences to get personalized recommendations
          </Text>
          
          {getSelectedCount() > 0 && (
            <View style={styles.selectionCounter}>
              <Text style={styles.counterText}>
                {getSelectedCount()} preference{getSelectedCount() !== 1 ? 's' : ''} selected
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.preferencesContainer}>
          <Text style={styles.sectionTitle}>🌟 Select Your Interests</Text>
          <Text style={styles.sectionSubtitle}>
            You can select multiple options and change them later in settings
          </Text>
          
          {travelPreferences.map((preference, index) => (
            <Animated.View
              key={preference.id}
              style={{
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  })
                }]
              }}
            >
              <PreferenceCard
                id={preference.id}
                title={preference.title}
                description={preference.description}
                icon={preference.icon}
                isSelected={selectedPreferences.includes(preference.id)}
                onToggle={handleTogglePreference}
              />
            </Animated.View>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🎯 Personalized Experience</Text>
            <Text style={styles.infoText}>
              Based on your selections, we'll recommend experiences, places, and activities that match your interests.
            </Text>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🔄 Always Flexible</Text>
            <Text style={styles.infoText}>
              You can update your preferences anytime in your profile settings.
            </Text>
          </View>
        </View>

        <CustomButton
          title={`Complete Registration (${getSelectedCount()} selected)`}
          onPress={handleCompleteRegistration}
          loading={loading}
          disabled={getSelectedCount() === 0}
          style={[
            styles.completeButton,
            getSelectedCount() === 0 && styles.disabledButton
          ]}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  progressText: {
    fontSize: 12,
    color: palette.text.disabled,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: palette.secondary.dark,
    borderRadius: 2,
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: palette.primary.main,
    borderRadius: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: palette.primary.main,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: palette.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  selectionCounter: {
    backgroundColor: palette.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  counterText: {
    color: palette.secondary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  preferencesContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: palette.text.secondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: palette.background.paper,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary.main,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: palette.text.secondary,
    lineHeight: 18,
  },
  completeButton: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
