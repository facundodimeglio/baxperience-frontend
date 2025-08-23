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
  Linking,
  Alert,
} from 'react-native';
import { CustomButton } from '../../components/common/CustomButton';
import { palette } from '../../theme/colors/palette';

const { width, height } = Dimensions.get('window');

interface POIDetailScreenProps {
  navigation: any;
  route: {
    params: {
      poi: any;
      tripData: any;
    };
  };
}

export const POIDetailScreen: React.FC<POIDetailScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { poi, tripData } = route.params;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In real app, save to user favorites
  };

  const openInMaps = () => {
    const { lat, lng } = poi.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleModifyTime = () => {
    Alert.alert(
      'Modify Schedule',
      'What would you like to change?',
      [
        { text: 'Change Time', onPress: () => {} },
        { text: 'Remove from Itinerary', onPress: () => {} },
        { text: 'Add More Time', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getDetailedInfo = () => {
    // Mock detailed information based on category
    const baseInfo = {
      openingHours: {
        monday: '10:00 - 18:00',
        tuesday: '10:00 - 18:00',
        wednesday: '10:00 - 18:00',
        thursday: '10:00 - 18:00',
        friday: '10:00 - 18:00',
        saturday: '10:00 - 19:00',
        sunday: '10:00 - 18:00',
      },
      contact: {
        phone: '+54 11 5236-9000',
        website: 'www.mnba.gob.ar',
        email: 'info@mnba.gob.ar',
      },
      amenities: ['Wheelchair Accessible', 'Audio Guides Available', 'Gift Shop', 'Café'],
      entryFee: poi.category === 'Restaurants' ? 'Free Entry' : 'Free Admission',
      averageVisitTime: `${poi.duration} minutes`,
      bestTimeToVisit: 'Weekday mornings (less crowded)',
    };

    return baseInfo;
  };

  const getNearbyPOIs = () => {
    // Mock nearby POIs from the same cluster
    return [
      {
        id: 'nearby1',
        name: 'Plaza Francia',
        distance: '200m',
        category: 'Parks',
        rating: 4.3,
      },
      {
        id: 'nearby2',
        name: 'Centro Cultural Recoleta',
        distance: '350m',
        category: 'Cultural Centers',
        rating: 4.5,
      },
      {
        id: 'nearby3',
        name: 'Palais de Glace',
        distance: '400m',
        category: 'Art Galleries',
        rating: 4.2,
      },
    ];
  };

  const getPhotos = () => {
    // Mock photo representation
    return [
      { id: 1, emoji: '🏛️', caption: 'Main Building' },
      { id: 2, emoji: '🎨', caption: 'Art Collections' },
      { id: 3, emoji: '🏛️', caption: 'Interior View' },
      { id: 4, emoji: '🌳', caption: 'Surrounding Gardens' },
    ];
  };

  const detailedInfo = getDetailedInfo();
  const nearbyPOIs = getNearbyPOIs();
  const photos = getPhotos();

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={toggleFavorite}
          style={styles.favoriteButton}
        >
          <Text style={styles.favoriteText}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContent}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{poi.category}</Text>
        </View>
        
        <Text style={styles.poiName}>{poi.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {poi.rating}</Text>
          <Text style={styles.reviews}>({poi.reviews} reviews)</Text>
        </View>

        <View style={styles.clusterInfo}>
          <Text style={styles.clusterBadge}>
            🎯 {poi.clusterInfo.clusterName}
          </Text>
          <Text style={styles.clusterDetails}>
            Part of a cluster with {poi.clusterInfo.nearbyPois} nearby places
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderScheduleInfo = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🕐 Your Schedule</Text>
        <TouchableOpacity onPress={handleModifyTime}>
          <Text style={styles.modifyButton}>Modify</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleTime}>
          <Text style={styles.timeText}>{poi.time}</Text>
          <Text style={styles.durationText}>{poi.duration} minutes</Text>
        </View>
        
        <View style={styles.scheduleDetails}>
          <Text style={styles.scheduleNote}>
            Optimal time based on your transport preference: {tripData.transportMode}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderPhotos = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.sectionTitle}>📸 Photos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.photosContainer}>
          {photos.map((photo) => (
            <TouchableOpacity key={photo.id} style={styles.photoCard}>
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoEmoji}>{photo.emoji}</Text>
              </View>
              <Text style={styles.photoCaption}>{photo.caption}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderDescription = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.sectionTitle}>📋 About This Place</Text>
      <Text style={styles.description}>
        {showFullDescription ? (
          `${poi.description}\n\nThis location was selected by our AI clustering algorithm because it perfectly matches your interests in ${poi.category.toLowerCase()} and is conveniently located within the ${poi.clusterInfo.clusterName}. The area offers excellent walkability and is known for its cultural significance.\n\nVisitors typically spend about ${poi.duration} minutes here, making it perfect for your schedule. The location has consistently high ratings and positive reviews from travelers with similar preferences to yours.`
        ) : poi.description}
      </Text>
      <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
        <Text style={styles.readMoreButton}>
          {showFullDescription ? 'Show Less' : 'Read More'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderDetails = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.sectionTitle}>ℹ️ Practical Information</Text>
      
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Entry Fee</Text>
          <Text style={styles.infoValue}>{detailedInfo.entryFee}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Visit Duration</Text>
          <Text style={styles.infoValue}>{detailedInfo.averageVisitTime}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Best Time</Text>
          <Text style={styles.infoValue}>{detailedInfo.bestTimeToVisit}</Text>
        </View>
      </View>

      <View style={styles.amenitiesContainer}>
        <Text style={styles.amenitiesTitle}>Amenities:</Text>
        <View style={styles.amenitiesList}>
          {detailedInfo.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>✓ {amenity}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderContact = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.sectionTitle}>📞 Contact & Hours</Text>
      
      <View style={styles.contactInfo}>
        <TouchableOpacity style={styles.contactItem}>
          <Text style={styles.contactLabel}>📞 Phone:</Text>
          <Text style={styles.contactValue}>{detailedInfo.contact.phone}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem}>
          <Text style={styles.contactLabel}>🌐 Website:</Text>
          <Text style={styles.contactValue}>{detailedInfo.contact.website}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hoursContainer}>
        <Text style={styles.hoursTitle}>Opening Hours:</Text>
        {Object.entries(detailedInfo.openingHours).map(([day, hours]) => (
          <View key={day} style={styles.hoursRow}>
            <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            <Text style={styles.hoursText}>{hours}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderNearbyPlaces = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.sectionTitle}>📍 Nearby in This Cluster</Text>
      
      {nearbyPOIs.map((nearbyPOI) => (
        <TouchableOpacity key={nearbyPOI.id} style={styles.nearbyCard}>
          <View style={styles.nearbyInfo}>
            <Text style={styles.nearbyName}>{nearbyPOI.name}</Text>
            <Text style={styles.nearbyCategory}>{nearbyPOI.category}</Text>
          </View>
          <View style={styles.nearbyDetails}>
            <Text style={styles.nearbyDistance}>{nearbyPOI.distance}</Text>
            <Text style={styles.nearbyRating}>⭐ {nearbyPOI.rating}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const renderActions = () => (
    <Animated.View 
      style={[
        styles.actionsContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <CustomButton
        title="Open in Maps"
        onPress={openInMaps}
        style={styles.mapsButton}
      />
      
      <View style={styles.secondaryActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Add to Favorites</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.primary.main} />
      
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderScheduleInfo()}
        {renderPhotos()}
        {renderDescription()}
        {renderDetails()}
        {renderContact()}
        {renderNearbyPlaces()}
        {renderActions()}
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {},
  backText: {
    color: palette.secondary.main,
    fontSize: 16,
    fontWeight: '500',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteText: {
    fontSize: 20,
  },
  headerContent: {},
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: palette.secondary.main,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  poiName: {
    color: palette.secondary.main,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 30,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    color: palette.secondary.main,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  reviews: {
    color: palette.secondary.main,
    fontSize: 14,
    opacity: 0.8,
  },
  clusterInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  clusterBadge: {
    color: palette.secondary.main,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  clusterDetails: {
    color: palette.secondary.main,
    fontSize: 12,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
  },
  modifyButton: {
    color: palette.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleCard: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTime: {
    marginRight: 16,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.primary.main,
    marginBottom: 2,
  },
  durationText: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleNote: {
    fontSize: 14,
    color: palette.text.secondary,
    lineHeight: 20,
  },
  photosContainer: {
    flexDirection: 'row',
    paddingRight: 24,
  },
  photoCard: {
    marginRight: 16,
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 100,
    height: 80,
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoEmoji: {
    fontSize: 30,
  },
  photoCaption: {
    fontSize: 12,
    color: palette.text.secondary,
    textAlign: 'center',
    width: 100,
  },
  description: {
    fontSize: 16,
    color: palette.text.secondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  readMoreButton: {
    color: palette.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: palette.text.secondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.primary,
    textAlign: 'center',
  },
  amenitiesContainer: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
  },
  amenitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.primary,
    marginBottom: 12,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: palette.secondary.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amenityText: {
    fontSize: 12,
    color: palette.text.primary,
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: palette.text.secondary,
    width: 80,
  },
  contactValue: {
    fontSize: 14,
    color: palette.primary.main,
    fontWeight: '500',
    flex: 1,
  },
  hoursContainer: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
  },
  hoursTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.primary,
    marginBottom: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  dayText: {
    fontSize: 14,
    color: palette.text.primary,
    textTransform: 'capitalize',
  },
  hoursText: {
    fontSize: 14,
    color: palette.text.secondary,
  },
  nearbyCard: {
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.primary,
    marginBottom: 2,
  },
  nearbyCategory: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  nearbyDetails: {
    alignItems: 'flex-end',
  },
  nearbyDistance: {
    fontSize: 12,
    color: palette.primary.main,
    fontWeight: '600',
    marginBottom: 2,
  },
  nearbyRating: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  mapsButton: {
    marginBottom: 16,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.secondary.dark,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: palette.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
