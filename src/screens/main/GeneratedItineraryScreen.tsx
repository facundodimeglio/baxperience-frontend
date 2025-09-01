import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { CustomButton } from '../../components/common/CustomButton';
import { palette } from '../../theme/colors/palette';
import { itineraryService } from '../../services/api/itineraryService';

const { width } = Dimensions.get('window');

interface GeneratedItineraryScreenProps {
  navigation: any;
  route: {
    params: {
      tripData: any;
      itinerary: any;
    };
  };
}

export const GeneratedItineraryScreen: React.FC<GeneratedItineraryScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { tripData, itinerary } = route.params;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedDay, setSelectedDay] = useState(0);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    console.log('📋 Received itinerary:', JSON.stringify(itinerary, null, 2));
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Generic images for different categories
  const getGenericImage = (category: string) => {
    const images: { [key: string]: string } = {
      'Gastronomía': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop',
      'Monumentos': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=200&fit=crop',
      'Museos': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=200&fit=crop',
      'Evento': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop',
      'Parques': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop',
      'Teatros': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
      'default': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=200&fit=crop'
    };
    return images[category] || images.default;
  };

  const handlePOIPress = (poi: any) => {
    // Create mock POI data for detail screen since endpoint doesn't provide full details yet
    const mockPOIDetail = {
      id: poi.id,
      name: poi.nombre,
      category: poi.categoria,
      subcategory: poi.subcategoria,
      description: `Discover ${poi.nombre} in ${poi.barrio}. This amazing place offers a unique experience in Buenos Aires.`,
      rating: poi.valoracion_promedio || 4.2,
      reviews: Math.floor(Math.random() * 1000) + 100,
      coordinates: { lat: poi.latitud, lng: poi.longitud },
      address: `${poi.barrio}, Buenos Aires, Argentina`,
      openingHours: poi.es_gratuito ? 'Open 24/7' : '9:00 AM - 6:00 PM',
      price: poi.es_gratuito ? 'Free' : '$10-20',
      website: poi.tiene_web ? 'www.example.com' : null,
      phone: poi.tiene_telefono ? '+54 11 1234-5678' : null,
      images: [
        getGenericImage(poi.categoria),
        'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop'
      ],
      amenities: ['WiFi', 'Parking', 'Wheelchair Access'],
      tags: [poi.categoria, poi.barrio, poi.es_gratuito ? 'Free' : 'Paid'],
      clusterInfo: {
        clusterId: poi.clusterInfo?.clusterId || 1,
        clusterName: poi.clusterInfo?.clusterName || `${poi.barrio} Area`,
        nearbyPois: poi.clusterInfo?.nearbyPois || Math.floor(Math.random() * 10) + 3,
      },
      time: poi.time || `${poi.horario_inicio} - ${poi.horario_fin}`,
      duration: poi.duration || poi.duracion_minutos || 120,
    };
    
    navigation.navigate('POIDetail', { poi: mockPOIDetail, tripData });
  };

  const handleSaveItinerary = () => {
    Alert.alert(
      'Confirm Itinerary',
      'Do you want to save this itinerary to your trips?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: async () => {
            try {
              console.log('💾 Saving itinerary to database...');
              
              // Prepare data for confirmation endpoint
              const confirmationData = {
                nombre: itinerary.nombre,
                descripcion: `Itinerary generated for ${itinerary.fecha_visita}`,
                fecha_visita: itinerary.fecha_visita,
                hora_inicio: itinerary.hora_inicio,
                duracion_horas: itinerary.duracion_horas,
                ubicacion_origen: itinerary.ubicacion_origen,
                zona_preferida: itinerary.zona_preferida,
                modo_transporte_preferido: 'mixed',
                actividades: itinerary.actividades || []
              };

              const response = await itineraryService.confirmItinerary(confirmationData);
              
              Alert.alert(
                'Itinerary Saved! 🎉',
                'Your personalized itinerary has been saved to your trips.',
                [
                  { text: 'View My Trips', onPress: () => navigation.navigate('TripHistory') },
                  { text: 'Continue Planning', style: 'cancel' },
                ]
              );
            } catch (error: any) {
              console.error('Error saving itinerary:', error);
              Alert.alert(
                'Error', 
                error?.message || 'Failed to save itinerary. Please try again.'
              );
            }
          }
        },
      ]
    );
  };

  const handleEditItinerary = () => {
    Alert.alert(
      'Edit Itinerary',
      'What would you like to modify?',
      [
        { text: 'Change Dates', onPress: () => navigation.goBack() },
        { text: 'Regenerate with Different Preferences', onPress: () => navigation.navigate('CreateTrip') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Create a single day structure from the real API data
  const createDayFromItinerary = () => {
    return {
      day: 1,
      date: new Date(itinerary.fecha_visita),
      title: "Your Perfect Day",
      pois: itinerary.actividades?.map((activity: any, index: number) => ({
        id: activity.id,
        name: activity.nombre,
        category: activity.categoria,
        subcategoria: activity.subcategoria,
        time: `${activity.horario_inicio} - ${activity.horario_fin}`,
        duration: activity.duracion_minutos || 120,
        description: `Explore ${activity.nombre} in ${activity.barrio}. ${activity.es_gratuito ? 'Free entry!' : 'Paid attraction.'}`,
        rating: activity.valoracion_promedio || 4.2,
        reviews: Math.floor(Math.random() * 1000) + 100,
        coordinates: { lat: activity.latitud, lng: activity.longitud },
        clusterInfo: {
          clusterId: index + 1,
          clusterName: `${activity.barrio} Area`,
          nearbyPois: Math.floor(Math.random() * 10) + 3,
        },
        // Add real data fields
        ...activity
      })) || [],
      totalDistance: "Variable",
      walkingTime: `${Math.floor((itinerary.duracion_horas || 4) * 60 / 4)} minutes`,
      clustersSummary: []
    };
  };

  const generatedItinerary = {
    tripName: itinerary.nombre || 'Your Trip',
    destination: itinerary.ubicacion_origen?.direccion || 'Buenos Aires, CABA',
    dates: {
      start: new Date(itinerary.fecha_visita),
      end: new Date(itinerary.fecha_visita), // Single day trip
    },
    days: [createDayFromItinerary()],
    stats: {
      totalPois: itinerary.actividades?.length || 0,
      totalDistance: "Variable",
      clustersUsed: itinerary.actividades?.length || 0,
      areasExplored: `${new Set(itinerary.actividades?.map((a: any) => a.barrio)).size} neighborhoods`,
    },
    aiInsights: [
      "Your itinerary balances different types of attractions",
      "All locations are optimized for your travel preferences",
      "Activities are scheduled based on optimal visiting times",
      "The route minimizes travel time between locations",
    ]
  };

  const renderDaySelector = () => (
    <View style={styles.daySelector}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {generatedItinerary.days.map((day: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayTab,
              selectedDay === index && styles.dayTabActive
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text style={[
              styles.dayTabText,
              selectedDay === index && styles.dayTabTextActive
            ]}>
              Day {day.day}
            </Text>
            <Text style={[
              styles.dayTabDate,
              selectedDay === index && styles.dayTabDateActive
            ]}>
              {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const getClusterColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Gastronomía': '#FF6B6B',
      'Monumentos': '#4ECDC4',
      'Museos': '#45B7D1',
      'Evento': '#96CEB4',
      'Parques': '#FECA57',
      'default': '#95A5A6'
    };
    return colors[category] || colors.default;
  };

  const renderPOI = (poi: any, index: number) => (
    <TouchableOpacity
      key={poi.id}
      style={styles.poiCard}
      onPress={() => handlePOIPress(poi)}
      activeOpacity={0.8}
    >
      {/* POI Image */}
      <Image 
        source={{ uri: getGenericImage(poi.categoria) }}
        style={styles.poiImage}
        defaultSource={{ uri: getGenericImage('default') }}
      />
      
      <View style={styles.poiContent}>
        <View style={styles.poiHeader}>
          <View style={styles.poiTimeContainer}>
            <Text style={styles.poiTime}>{poi.horario_inicio || poi.time}</Text>
            <Text style={styles.poiDuration}>{poi.duracion_minutos || poi.duration} min</Text>
          </View>
          <View style={[
            styles.clusterIndicator, 
            { backgroundColor: getClusterColor(poi.categoria) }
          ]} />
        </View>
        
        <Text style={styles.poiName}>{poi.nombre || poi.name}</Text>
        <Text style={styles.poiCategory}>{poi.categoria}</Text>
        {poi.subcategoria && (
          <Text style={styles.poiSubcategory}>{poi.subcategoria}</Text>
        )}
        <Text style={styles.poiDescription} numberOfLines={2}>
          {poi.description || `Visit ${poi.nombre} in ${poi.barrio}`}
        </Text>
        
        <View style={styles.poiFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {poi.valoracion_promedio || poi.rating}</Text>
            <Text style={styles.reviews}>({poi.reviews} reviews)</Text>
          </View>
          
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>📍 {poi.barrio}</Text>
          </View>
          
          {poi.es_gratuito && (
            <View style={styles.freeTag}>
              <Text style={styles.freeText}>FREE</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.poiArrow}>
        <Text style={styles.arrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDayContent = () => {
    const currentDay = generatedItinerary.days[selectedDay];
    
    return (
      <Animated.View style={[styles.dayContent, { opacity: fadeAnim }]}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{currentDay.title}</Text>
          <Text style={styles.daySubtitle}>
            {itinerary.actividades?.length || 0} activities • {itinerary.duracion_horas || 4} hours
          </Text>
        </View>

        <View style={styles.poisContainer}>
          <Text style={styles.poisTitle}>🗓️ Your Schedule</Text>
          {currentDay.pois.map((poi: any, index: number) => renderPOI(poi, index))}
        </View>
      </Animated.View>
    );
  };

  const renderStatsModal = () => (
    showStats && (
      <Animated.View style={[styles.statsOverlay, { opacity: fadeAnim }]}>
        <View style={styles.statsModal}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>🤖 AI Insights</Text>
            <TouchableOpacity onPress={() => setShowStats(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{generatedItinerary.stats.totalPois}</Text>
              <Text style={styles.statLabel}>Places to Visit</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{generatedItinerary.stats.clustersUsed}</Text>
              <Text style={styles.statLabel}>Areas Covered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{itinerary.duracion_horas}h</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{generatedItinerary.stats.areasExplored}</Text>
              <Text style={styles.statLabel}>Areas Explored</Text>
            </View>
          </View>

          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Why we chose these places:</Text>
            {generatedItinerary.aiInsights.map((insight: string, index: number) => (
              <Text key={index} style={styles.insightItem}>• {insight}</Text>
            ))}
          </View>
        </View>
      </Animated.View>
    )
  );

  if (!itinerary) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>No itinerary data found</Text>
        <CustomButton
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.primaryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.primary.main} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{generatedItinerary.tripName}</Text>
          <Text style={styles.headerSubtitle}>
            {generatedItinerary.destination} • {generatedItinerary.dates.start.toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.statsButton}
          onPress={() => setShowStats(true)}
        >
          <Text style={styles.statsButtonText}>📊</Text>
        </TouchableOpacity>
      </Animated.View>

      {renderDaySelector()}

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderDayContent()}
        
        {/* Action Buttons */}
        <Animated.View style={[styles.actionsContainer, { opacity: fadeAnim }]}>
          <CustomButton
            title="Save This Itinerary"
            onPress={handleSaveItinerary}
            style={styles.saveButton}
          />
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditItinerary}
          >
            <Text style={styles.editButtonText}>Make Changes</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {renderStatsModal()}
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
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    color: palette.secondary.main,
    fontSize: 16,
    fontWeight: '500',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: palette.secondary.main,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: palette.secondary.main,
    fontSize: 14,
    opacity: 0.8,
  },
  statsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsButtonText: {
    fontSize: 18,
  },
  daySelector: {
    backgroundColor: palette.background.paper,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.secondary.dark,
  },
  dayTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  dayTabActive: {
    backgroundColor: palette.primary.main,
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.secondary,
  },
  dayTabTextActive: {
    color: palette.secondary.main,
  },
  dayTabDate: {
    fontSize: 12,
    color: palette.text.disabled,
    marginTop: 2,
  },
  dayTabDateActive: {
    color: palette.secondary.main,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  dayContent: {
    padding: 24,
  },
  dayHeader: {
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  daySubtitle: {
    fontSize: 16,
    color: palette.text.secondary,
  },
  poisContainer: {
    marginBottom: 24,
  },
  poisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 16,
  },
  poiCard: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  poiImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  poiContent: {
    padding: 16,
  },
  poiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  poiTimeContainer: {
    alignItems: 'flex-start',
  },
  poiTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.primary.main,
  },
  poiDuration: {
    fontSize: 12,
    color: palette.text.secondary,
    marginTop: 2,
  },
  clusterIndicator: {
    width: 8,
    height: 30,
    borderRadius: 4,
  },
  poiName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  poiCategory: {
    fontSize: 12,
    color: palette.primary.main,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  poiSubcategory: {
    fontSize: 12,
    color: palette.text.secondary,
    marginBottom: 6,
  },
  poiDescription: {
    fontSize: 14,
    color: palette.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  poiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: palette.text.disabled,
  },
  locationInfo: {
    flex: 1,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  freeTag: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  freeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  poiArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  arrowText: {
    fontSize: 16,
    color: palette.text.disabled,
  },
  actionsContainer: {
    padding: 24,
    gap: 12,
  },
  saveButton: {
    paddingVertical: 16,
    backgroundColor: palette.primary.main,
  },
  editButton: {
    borderWidth: 2,
    borderColor: palette.primary.main,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: palette.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: palette.primary.main,
  },
  errorText: {
    fontSize: 16,
    color: palette.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  statsModal: {
    backgroundColor: palette.background.default,
    borderRadius: 16,
    margin: 24,
    padding: 24,
    maxHeight: '80%',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.text.primary,
  },
  closeButton: {
    fontSize: 20,
    color: palette.text.secondary,
    padding: 4,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: palette.text.secondary,
    textAlign: 'center',
  },
  insightsContainer: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 12,
  },
  insightItem: {
    fontSize: 14,
    color: palette.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
});
