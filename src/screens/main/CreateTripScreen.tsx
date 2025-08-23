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
} from 'react-native';
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

  const [tripData, setTripData] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    travelers: '1',
    tripType: '',
    preferences: [] as string[],
    baseLocation: '',
    baseAddress: '',
    transportMode: '',
    tripName: '',
    preferredArea: '',
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
    { label: 'Palermo', value: 'palermo' },
    { label: 'Recoleta', value: 'recoleta' },
    { label: 'San Telmo', value: 'san_telmo' },
    { label: 'Puerto Madero', value: 'puerto_madero' },
    { label: 'Microcentro', value: 'microcentro' },
    { label: 'La Boca', value: 'la_boca' },
    { label: 'Barrio Norte', value: 'barrio_norte' },
  ];

  const travelerOptions = [
    { label: 'Solo (1 person)', value: '1' },
    { label: 'Couple (2 people)', value: '2' },
    { label: 'Small group (3-5 people)', value: '3-5' },
    { label: 'Large group (6+ people)', value: '6+' },
  ];

  const tripTypeOptions = [
    { label: 'Leisure & Relaxation', value: 'leisure' },
    { label: 'Adventure & Outdoor', value: 'adventure' },
    { label: 'Cultural & Historical', value: 'cultural' },
    { label: 'Business & Work', value: 'business' },
    { label: 'Family Vacation', value: 'family' },
    { label: 'Romantic Getaway', value: 'romantic' },
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

    setLoading(true);
    
    try {
      // Add Buenos Aires as destination since it's always CABA
      const completeData = {
        ...tripData,
        destination: 'Buenos Aires, CABA'
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

        {/* Buenos Aires Focus Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>🏙️ Exploring Buenos Aires</Text>
          
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationFixed}>📍 Buenos Aires, CABA</Text>
            <Text style={styles.destinationSubtext}>
              Discover the best of Argentina's capital city
            </Text>
          </View>
          
          <CustomDropdown
            label="Preferred Area (Optional)"
            placeholder="Any area preference?"
            options={preferredAreaOptions}
            selectedValue={tripData.preferredArea}
            onSelect={updateTripData('preferredArea')}
          />
          
          <Text style={styles.quickSelectTitle}>Popular Areas:</Text>
          <View style={styles.quickDestinations}>
            {popularAreas.map((area) => (
              <TouchableOpacity
                key={area.name}
                style={[
                  styles.quickDestButton,
                  tripData.preferredArea === area.name.toLowerCase() && styles.quickDestButtonActive
                ]}
                onPress={() => handleAreaSelection(area.name.toLowerCase())}
              >
                <Text style={styles.quickDestEmoji}>{area.emoji}</Text>
                <Text style={[
                  styles.quickDestText,
                  tripData.preferredArea === area.name.toLowerCase() && styles.quickDestTextActive
                ]}>
                  {area.name}
                </Text>
                <Text style={styles.areaDescription}>{area.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
            <CustomInput
              label="Specific Address"
              placeholder="Enter hotel name or address"
              value={tripData.baseAddress}
              onChangeText={updateTripData('baseAddress')}
              style={styles.addressInput}
            />
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
          
          <CustomDropdown
            label="Number of Travelers"
            placeholder="How many people?"
            options={travelerOptions}
            selectedValue={tripData.travelers}
            onSelect={updateTripData('travelers')}
          />
          
          <CustomDropdown
            label="Trip Type"
            placeholder="What kind of trip?"
            options={tripTypeOptions}
            selectedValue={tripData.tripType}
            onSelect={updateTripData('tripType')}
          />
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
    marginTop: 12,
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
