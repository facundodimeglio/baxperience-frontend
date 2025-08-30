import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { CustomDatePicker } from '../../components/common/CustomDatePicker';
import { palette } from '../../theme/colors/palette';

interface CreateTripScreenProps {
  navigation: any;
}

export const CreateTripScreen: React.FC<CreateTripScreenProps> = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [tripData, setTripData] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    preferences: [] as string[],
    baseLocation: '',
    baseAddress: '',
    transportMode: '',
    tripName: '',
    preferredArea: '',
    durationHours: '4', // Default duration of 4 hours for one-day itineraries
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const preferredAreaOptions = [
    { label: 'No preference (All CABA)', value: 'all' },
    { label: 'Agronomia', value: 'agronomia' },
    { label: 'Almagro', value: 'almagro' },
    { label: 'Balvanera', value: 'balvanera' },
    { label: 'Barracas', value: 'barracas' },
    { label: 'Belgrano', value: 'belgrano' },
    { label: 'Boedo', value: 'boedo' },
    { label: 'Caballito', value: 'caballito' },
    { label: 'Chacarita', value: 'chacarita' },
    { label: 'Coghlan', value: 'coghlan' },
    { label: 'Colegiales', value: 'colegiales' },
    { label: 'Constitucion', value: 'constitucion' },
    { label: 'Flores', value: 'flores' },
    { label: 'Floresta', value: 'floresta' },
    { label: 'La Boca', value: 'la_boca' },
    { label: 'Liniers', value: 'liniers' },
    { label: 'Mataderos', value: 'mataderos' },
    { label: 'Monte Castro', value: 'monte_castro' },
    { label: 'Monserrat', value: 'monserrat' },
    { label: 'Nueva Pompeya', value: 'nueva_pompeya' },
    { label: 'Nuñez', value: 'nunez' },
    { label: 'Palermo', value: 'palermo' },
    { label: 'Parque Avellaneda', value: 'parque_avellaneda' },
    { label: 'Parque Chacabuco', value: 'parque_chacabuco' },
    { label: 'Parque Chas', value: 'parque_chas' },
    { label: 'Parque Patricios', value: 'parque_patricios' },
    { label: 'Paternal', value: 'paternal' },
    { label: 'Puerto Madero', value: 'puerto_madero' },
    { label: 'Recoleta', value: 'recoleta' },
    { label: 'Retiro', value: 'retiro' },
    { label: 'Saavedra', value: 'saavedra' },
    { label: 'San Cristobal', value: 'san_cristobal' },
    { label: 'San Nicolas', value: 'san_nicolas' },
    { label: 'San Telmo', value: 'san_telmo' },
    { label: 'Versalles', value: 'versalles' },
    { label: 'Villa Crespo', value: 'villa_crespo' },
    { label: 'Villa Del Parque', value: 'villa_del_parque' },
    { label: 'Villa Devoto', value: 'villa_devoto' },
    { label: 'Villa Lugano', value: 'villa_lugano' },
    { label: 'Villa Luro', value: 'villa_luro' },
    { label: 'Villa Ortuzar', value: 'villa_ortuzar' },
    { label: 'Villa Pueyrredon', value: 'villa_pueyrredon' },
    { label: 'Villa Riachuelo', value: 'villa_riachuelo' },
    { label: 'Villa Santa Rita', value: 'villa_santa_rita' },
    { label: 'Villa Soldati', value: 'villa_soldati' },
    { label: 'Villa Urquiza', value: 'villa_urquiza' }
  ];



  const transportOptions = [
    { label: 'Walking', value: 'walking' },
    { label: 'Public Transport', value: 'public' },
    { label: 'Car/Taxi', value: 'car' },
    { label: 'Bicycle', value: 'bicycle' },
    { label: 'Mixed (Flexible)', value: 'mixed' },
  ];

  const baseLocationOptions = [
    { label: 'Hotel/Accommodation', value: 'hotel' },
    { label: 'Palermo', value: 'palermo' },
    { label: 'Recoleta', value: 'recoleta' },
    { label: 'San Telmo', value: 'san_telmo' },
    { label: 'Puerto Madero', value: 'puerto_madero' },
    { label: 'Microcentro', value: 'microcentro' },
    { label: 'Other', value: 'other' },
  ];

  const popularAreas = [
    { name: 'Palermo', emoji: '🌳', description: 'Parks & nightlife' },
    { name: 'Recoleta', emoji: '🏛️', description: 'Museums & culture' },
    { name: 'San Telmo', emoji: '🎭', description: 'Tango & history' },
    { name: 'Puerto Madero', emoji: '🏢', description: 'Modern & waterfront' },
    { name: 'La Boca', emoji: '🎨', description: 'Colorful & artistic' },
    { name: 'Microcentro', emoji: '🏪', description: 'Business & shopping' },
  ];

  const handleCreateTrip = async () => {
    // Validation
    if (!tripData.tripName.trim()) {
      Alert.alert('Missing Information', 'Please enter a name for your trip.');
      return;
    }
    if (!tripData.startDate || !tripData.endDate) {
      Alert.alert('Missing Information', 'Please select your travel dates.');
      return;
    }
    if (!tripData.baseLocation || !tripData.transportMode) {
      Alert.alert('Missing Information', 'Please select your base location and preferred transport mode.');
      return;
    }
    
    // Validate duration hours for single-day trips
    if (isSingleDayTrip()) {
      const hours = parseInt(tripData.durationHours);
      if (isNaN(hours) || hours <= 0 || hours > 24) {
        Alert.alert('Invalid Duration', 'Please enter a valid duration between 1 and 24 hours.');
        return;
      }
    }

    setLoading(true);
    
    try {
      // Add Buenos Aires as destination since it's always CABA
      const completeData = {
        ...tripData,
        destination: 'Buenos Aires, CABA',
        isSingleDay: isSingleDayTrip()
      };
      
      // Navigate to itinerary generation screen
      navigation.navigate('ItineraryGeneration', { tripData: completeData });
      
    } catch (error) {
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTripData = (key: string) => (value: string | Date) => {
    setTripData(prev => ({ ...prev, [key]: value }));
  };

  const handleAreaSelection = (area: string) => {
    setTripData(prev => ({ ...prev, preferredArea: area }));
  };

  const calculateDays = () => {
    if (tripData.startDate && tripData.endDate) {
      const diffTime = Math.abs(tripData.endDate.getTime() - tripData.startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  // Check if it's a single day trip
  const isSingleDayTrip = () => {
    if (tripData.startDate && tripData.endDate) {
      // Check if the same day (ignoring time)
      return (
        tripData.startDate.getDate() === tripData.endDate.getDate() &&
        tripData.startDate.getMonth() === tripData.endDate.getMonth() &&
        tripData.startDate.getFullYear() === tripData.endDate.getFullYear()
      );
    }
    return false;
  };

  // Request location permissions
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const result = await Geolocation.requestAuthorization('whenInUse');
      return result === 'granted';
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to automatically fill your address in Buenos Aires.',
          buttonNeutral: 'Ask Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  // Reverse geocoding function to convert coordinates to address
  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=es`,
        {
          headers: {
            'User-Agent': 'BAXperience/1.0',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      
      // Check if response is valid JSON
      if (!text || text.trim().startsWith('<')) {
        throw new Error('Invalid response format');
      }
      
      const data = JSON.parse(text);
      
      if (data && data.display_name) {
        // Validate that the location is in Buenos Aires, CABA
        const address = data.address || {};
        const city = address.city || address.town || address.municipality || '';
        const state = address.state || address.province || '';
        const country = address.country || '';
        const countryCode = address.country_code || '';
        
        // More flexible validation for Buenos Aires, Argentina
        const isInArgentina = (
          country.toLowerCase().includes('argentina') || 
          country.toLowerCase().includes('arg') ||
          countryCode.toLowerCase() === 'ar'
        );
        
        const isInBuenosAires = (
          city.toLowerCase().includes('buenos aires') || 
          city.toLowerCase().includes('ciudad autónoma') ||
          city.toLowerCase().includes('caba') ||
          state.toLowerCase().includes('buenos aires') ||
          state.toLowerCase().includes('ciudad autónoma') ||
          state.toLowerCase().includes('caba') ||
          data.display_name.toLowerCase().includes('buenos aires') ||
          data.display_name.toLowerCase().includes('caba')
        );
        
        // Log location info for debugging emulator issues
        if (!isInArgentina || !isInBuenosAires) {
          console.log('🔍 Location received:', {
            detected: `${city}, ${state}, ${country}`,
            isEmulator: city === 'Mountain View' && state === 'California'
          });
        }
        
        if (!isInArgentina || !isInBuenosAires) {
          throw new Error('LOCATION_NOT_IN_CABA');
        }
        
        // Extract relevant parts of the address
        const addressParts = [];
        
        if (address.house_number && address.road) {
          addressParts.push(`${address.house_number} ${address.road}`);
        } else if (address.road) {
          addressParts.push(address.road);
        }
        
        if (address.neighbourhood || address.suburb) {
          addressParts.push(address.neighbourhood || address.suburb);
        }
        
        if (address.city || address.town || address.village) {
          addressParts.push(address.city || address.town || address.village);
        }
        
        return addressParts.length > 0 ? addressParts.join(', ') : data.display_name;
      }
      
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      if (error instanceof Error && error.message === 'LOCATION_NOT_IN_CABA') {
        // This is a validation error, not a technical error - don't log to console
        throw error;
      }
      // Only log technical errors to console
      console.error('Reverse geocoding technical error:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  // Get current location and fill address
  const getCurrentLocation = async () => {
    setGettingLocation(true);
    
    try {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied', 
          'Location permission is required to automatically fill your address.'
        );
        return;
      }
      
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const address = await reverseGeocode(latitude, longitude);
            setTripData(prev => ({ ...prev, baseAddress: address }));
            Alert.alert('Perfect!', 'Address has been filled with your current location in Buenos Aires.');
          } catch (error) {
            if (error instanceof Error && error.message === 'LOCATION_NOT_IN_CABA') {
              // This is a validation case, not a technical error - don't log to console
              Alert.alert(
                'Location outside CABA', 
                'Your current location is not in Buenos Aires City (CABA). This feature is only available for users within CABA.\n\nPlease enter your address manually.'
              );
            } else {
              // Only log technical errors to console
              console.error('Technical error getting address:', error);
              Alert.alert('Error', 'Could not get address from your location. Please enter the address manually.');
            }
          } finally {
            setGettingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation service error:', error);
          setGettingLocation(false);
          Alert.alert(
            'Location Error', 
            'Could not get your current location. Please make sure location services are enabled.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error) {
      console.error('Location permission error:', error);
      setGettingLocation(false);
      Alert.alert('Error', 'An error occurred while requesting location permissions.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.primary.main} />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Trip</Text>
        <Text style={styles.headerSubtitle}>
          Let AI create your perfect itinerary
        </Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trip Name Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>✈️ Trip Name</Text>
          <CustomInput
            label="What should we call this trip?"
            placeholder="e.g., Buenos Aires Adventure, Weekend Getaway..."
            value={tripData.tripName}
            onChangeText={updateTripData('tripName')}
          />
        </Animated.View>

        {/* Preferred Area Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>📍 Preferred Area</Text>
          
          <CustomDropdown
            label="Preferred Area (Optional)"
            placeholder="Select or type to search neighborhoods"
            options={preferredAreaOptions}
            selectedValue={tripData.preferredArea}
            onSelect={updateTripData('preferredArea')}
            searchable={true}
          />
        </Animated.View>



        {/* Dates Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>📅 When?</Text>
          
          <View style={styles.datesRow}>
            <CustomDatePicker
              label="Start Date"
              placeholder="Select start date"
              selectedDate={tripData.startDate}
              onDateSelect={updateTripData('startDate')}
              containerStyle={styles.dateInput}
              minimumAge={0}
              maximumAge={0}
            />
            
            <CustomDatePicker
              label="End Date"
              placeholder="Select end date"
              selectedDate={tripData.endDate}
              onDateSelect={updateTripData('endDate')}
              containerStyle={styles.dateInput}
              minimumAge={0}
              maximumAge={0}
            />
          </View>
          
          {calculateDays() > 0 && (
            <Text style={styles.durationText}>
              Duration: {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
            </Text>
          )}
          
          {isSingleDayTrip() && (
            <View style={styles.durationHoursContainer}>
              <Text style={styles.durationHoursLabel}>Since this is a one-day trip, please specify duration:</Text>
              <View style={styles.hoursInputContainer}>
                <CustomInput
                  label="Duration (in hours)"
                  placeholder="Enter hours"
                  value={tripData.durationHours}
                  onChangeText={updateTripData('durationHours')}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}
        </Animated.View>

        {/* Base Location Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>📍 Starting Point</Text>
          
          <CustomDropdown
            label="Base Location"
            placeholder="Where will you be staying?"
            options={baseLocationOptions}
            selectedValue={tripData.baseLocation}
            onSelect={updateTripData('baseLocation')}
          />
          
          {(tripData.baseLocation === 'hotel' || tripData.baseLocation === 'other') && (
            <View style={styles.addressInputContainer}>
              <CustomInput
                label="Specific Address"
                placeholder="Enter hotel name or address"
                value={tripData.baseAddress}
                onChangeText={updateTripData('baseAddress')}
                containerStyle={styles.addressInput}
              />
              {tripData.baseLocation === 'hotel' && (
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={getCurrentLocation}
                  disabled={gettingLocation}
                >
                  <Text style={styles.locationButtonText}>
                    {gettingLocation ? '📍 Getting location...' : '📍 Use my current location'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Animated.View>

        {/* Transport Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>🚶‍♂️ How do you prefer to get around?</Text>
          
          <CustomDropdown
            label="Preferred Transport Mode"
            placeholder="Select your transportation preference"
            options={transportOptions}
            selectedValue={tripData.transportMode}
            onSelect={updateTripData('transportMode')}
          />
        </Animated.View>

        {/* Trip Details Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>🎯 Trip Details</Text>
          

          

        </Animated.View>

        {/* AI Info */}
        <Animated.View 
          style={[
            styles.aiInfoCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.aiInfoTitle}>🤖 AI Magic</Text>
          <Text style={styles.aiInfoText}>
            Our AI will analyze your preferences and travel dates to create a personalized Buenos Aires itinerary with:
          </Text>
          <View style={styles.aiFeatures}>
            <Text style={styles.aiFeature}>• Recommended attractions & activities across CABA</Text>
            <Text style={styles.aiFeature}>• Optimal daily schedules with clustering</Text>
            <Text style={styles.aiFeature}>• Restaurant suggestions in your preferred areas</Text>
            <Text style={styles.aiFeature}>• Transportation options within Buenos Aires</Text>
            <Text style={styles.aiFeature}>• Cultural events happening during your visit</Text>
          </View>
        </Animated.View>

        {/* Create Button */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <CustomButton
            title={loading ? "Creating Your Trip..." : "Generate AI Itinerary"}
            onPress={handleCreateTrip}
            loading={loading}
            style={styles.createButton}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  durationHoursContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary.main,
  },
  durationHoursLabel: {
    fontSize: 14,
    color: palette.text.primary,
    marginBottom: 12,
    fontWeight: '500',
  },
  hoursInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: palette.background.default,
  },
  header: {
    backgroundColor: palette.primary.main,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    color: palette.secondary.main,
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: palette.secondary.main,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: palette.secondary.main,
    fontSize: 16,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 16,
  },
  quickSelectTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.secondary,
    marginTop: 16,
    marginBottom: 12,
  },
  quickDestinations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickDestButton: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.secondary.dark,
    minWidth: 80,
  },
  quickDestButtonActive: {
    backgroundColor: palette.primary.main,
    borderColor: palette.primary.main,
  },
  quickDestEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickDestText: {
    fontSize: 12,
    color: palette.text.primary,
    textAlign: 'center',
  },
  quickDestTextActive: {
    color: palette.secondary.main,
    fontWeight: '600',
  },
  datesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  durationText: {
    fontSize: 14,
    color: palette.primary.main,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  aiInfoCard: {
    backgroundColor: palette.background.paper,
    margin: 24,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary.main,
  },
  aiInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 12,
  },
  aiInfoText: {
    fontSize: 14,
    color: palette.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  aiFeatures: {
    gap: 4,
  },
  aiFeature: {
    fontSize: 12,
    color: palette.text.secondary,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  createButton: {
    paddingVertical: 18,
  },
  addressInput: {
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  addressInputContainer: {
    marginTop: 12,
    backgroundColor: 'transparent',
  },
  locationButton: {
    backgroundColor: palette.primary.main,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationButtonText: {
    color: palette.secondary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  destinationInfo: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  destinationFixed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.primary.main,
    marginBottom: 4,
  },
  destinationSubtext: {
    fontSize: 14,
    color: palette.text.secondary,
    textAlign: 'center',
  },
  areaDescription: {
    fontSize: 10,
    color: palette.text.disabled,
    textAlign: 'center',
    marginTop: 2,
  },
});
