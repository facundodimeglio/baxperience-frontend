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
import { authService } from '../../services/api/authService';
import { ApiException } from '../../services/api/client';
import { useAuth } from '../../contexts/AuthContext';

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
  const { login } = useAuth();

  const travelPreferences: TravelPreference[] = [
    {
      id: '1',
      title: 'Museums',
      description: 'Museums, historical sites, and educational experiences',
      icon: '🏛️',
      category: 'cultural'
    },
    {
      id: '2',
      title: 'Gastronomy',
      description: 'Local cuisine, restaurants, food tours, and culinary experiences',
      icon: '🍽️',
      category: 'culinary'
    },
    {
      id: '3',
      title: 'Monuments',
      description: 'Historical monuments, landmarks, and architectural sites',
      icon: '🗿',
      category: 'historical'
    },
    {
      id: '4',
      title: 'Historic Places',
      description: 'Historic sites, heritage buildings, and cultural landmarks',
      icon: '🏰',
      category: 'historical'
    },
    {
      id: '5',
      title: 'Entertainment',
      description: 'Theaters, cinemas, shows, and entertainment venues',
      icon: '🎭',
      category: 'entertainment'
    },
    {
      id: '6',
      title: 'Events',
      description: 'Cultural events, festivals, concerts, and special occasions',
      icon: '🎪',
      category: 'events'
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
      console.log('📝 Preparing registration data...');
      console.log('📧 Email:', email);
      console.log('👤 Registration data:', registrationData);
      console.log('📋 Profile data:', profileData);
      console.log('🎯 Selected preferences:', selectedPreferences);

      // Create registration request manually to preserve apellido from profileData and ensure all fields are strings
      // Convertir y validar las preferencias seleccionadas
      const validPreferences = selectedPreferences
        .filter(pref => pref && pref.trim() !== '')
        .map(pref => {
          const prefId = parseInt(pref, 10);
          return isNaN(prefId) ? null : prefId;
        })
        .filter((prefId): prefId is number => prefId !== null);
      
      // Log para debugging
      console.log('🔍 Selected preferences (raw):', selectedPreferences);
      console.log('🔍 Valid preferences (parsed):', validPreferences);
      
      if (validPreferences.length === 0) {
        Alert.alert(
          'Invalid Preferences',
          'Please select at least one valid preference category.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }
        
      const registrationRequest = {
        email: String(email),
        password: String(registrationData.password),
        nombre: String(profileData.nombre || registrationData.fullName.split(' ')[0] || 'Usuario'),
        apellido: String(profileData.apellido || registrationData.fullName.split(' ').slice(1).join(' ') || 'Sin Apellido'),
        username: String(profileData.username || email.split('@')[0]),
        fechaNacimiento: String(profileData.fecha_nacimiento || profileData.fechaNacimiento || '1990-01-01'),
        paisOrigen: String(profileData.pais_origen || profileData.paisOrigen || 'Argentina'),
        ciudadOrigen: String(profileData.ciudad_origen || profileData.ciudadOrigen || 'Buenos Aires'),
        idiomaPreferido: String(profileData.idioma_preferido || profileData.idiomaPreferido || 'es'),
        telefono: String(profileData.telefono || '123456789'),
        tipoViajero: String(profileData.tipo_viajero || profileData.tipoViajero || 'explorador'),
        genero: String(profileData.genero || 'other'),
        preferencias: validPreferences, // Usar las preferencias validadas
      };

      console.log('🚀 Sending registration request:', registrationRequest);
      
      // Make the real API call
      const response = await authService.register(registrationRequest);
      
      console.log('✅ Registration successful:', response.user);
      
      // Update authentication state
      login();
      
      Alert.alert(
        'Welcome to Baxperience! 🎉',
        `Great! Welcome ${response.user.nombre}! We've personalized your experience based on your ${selectedPreferences.length} selected interests. You're all set to explore!`,
        [
          {
            text: 'Start Exploring',
            onPress: () => {
              // Navigation will be handled automatically by auth state change
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      let errorMessage = 'Failed to complete registration. Please try again.';
      
      if (error instanceof ApiException) {
        switch (error.statusCode) {
          case 400:
            errorMessage = 'Please check that all your information is correct and try again.';
            break;
          case 409:
            errorMessage = 'An account with this email already exists. Please try logging in instead.';
            break;
          case 0:
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      Alert.alert('Registration Failed', errorMessage);
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
          style={styles.completeButton}
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
