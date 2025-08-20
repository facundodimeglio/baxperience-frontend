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
    destination: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    budget: '',
    travelers: '1',
    tripType: '',
    preferences: [] as string[],
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

  const budgetOptions = [
    { label: 'Budget-friendly ($0 - $500)', value: 'budget' },
    { label: 'Mid-range ($500 - $1500)', value: 'mid-range' },
    { label: 'Luxury ($1500+)', value: 'luxury' },
    { label: 'No budget limit', value: 'unlimited' },
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

  const quickDestinations = [
    { name: 'Buenos Aires', emoji: '🏙️' },
    { name: 'Bariloche', emoji: '🏔️' },
    { name: 'Mendoza', emoji: '🍷' },
    { name: 'Salta', emoji: '⛰️' },
    { name: 'Ushuaia', emoji: '🐧' },
    { name: 'Córdoba', emoji: '🏛️' },
  ];

  const handleCreateTrip = async () => {
    if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate AI trip generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      Alert.alert(
        'Trip Created! 🎉',
        'Your AI-generated itinerary is ready! Check your trip history to view the details.',
        [
          { text: 'View Trip', onPress: () => navigation.navigate('TripHistory') },
          { text: 'Create Another', onPress: () => {
            setTripData({
              destination: '',
              startDate: null,
              endDate: null,
              budget: '',
              travelers: '1',
              tripType: '',
              preferences: [],
            });
          }},
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTripData = (key: string) => (value: string | Date) => {
    setTripData(prev => ({ ...prev, [key]: value }));
  };

  const handleQuickDestination = (destination: string) => {
    setTripData(prev => ({ ...prev, destination }));
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
        {/* Destination Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>🌍 Where to?</Text>
          
          <CustomInput
            label="Destination"
            placeholder="Enter city or country"
            value={tripData.destination}
            onChangeText={updateTripData('destination')}
          />
          
          <Text style={styles.quickSelectTitle}>Quick Select:</Text>
          <View style={styles.quickDestinations}>
            {quickDestinations.map((dest) => (
              <TouchableOpacity
                key={dest.name}
                style={[
                  styles.quickDestButton,
                  tripData.destination === dest.name && styles.quickDestButtonActive
                ]}
                onPress={() => handleQuickDestination(dest.name)}
              >
                <Text style={styles.quickDestEmoji}>{dest.emoji}</Text>
                <Text style={[
                  styles.quickDestText,
                  tripData.destination === dest.name && styles.quickDestTextActive
                ]}>
                  {dest.name}
                </Text>
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
            label="Budget Range"
            placeholder="Select your budget"
            options={budgetOptions}
            selectedValue={tripData.budget}
            onSelect={updateTripData('budget')}
          />
          
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
            Our AI will analyze your preferences, budget, and travel dates to create a personalized itinerary with:
          </Text>
          <View style={styles.aiFeatures}>
            <Text style={styles.aiFeature}>• Recommended attractions & activities</Text>
            <Text style={styles.aiFeature}>• Optimal daily schedules</Text>
            <Text style={styles.aiFeature}>• Restaurant suggestions</Text>
            <Text style={styles.aiFeature}>• Transportation options</Text>
            <Text style={styles.aiFeature}>• Budget breakdown</Text>
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
});
