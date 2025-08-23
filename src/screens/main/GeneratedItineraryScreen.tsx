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
} from 'react-native';
import { CustomButton } from '../../components/common/CustomButton';
import { palette } from '../../theme/colors/palette';

const { width } = Dimensions.get('window');

interface GeneratedItineraryScreenProps {
  navigation: any;
  route: {
    params: {
      tripData: any;
      generatedItinerary: any;
    };
  };
}

export const GeneratedItineraryScreen: React.FC<GeneratedItineraryScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { tripData, generatedItinerary } = route.params;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedDay, setSelectedDay] = useState(0);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePOIPress = (poi: any) => {
    navigation.navigate('POIDetail', { poi, tripData });
  };

  const handleSaveItinerary = () => {
    Alert.alert(
      'Itinerary Saved! 🎉',
      'Your personalized itinerary has been saved to your trips.',
      [
        { text: 'View My Trips', onPress: () => navigation.navigate('TripHistory') },
        { text: 'Continue Planning', style: 'cancel' },
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

  const renderClusterInfo = (clustersInfo: any[]) => (
    <View style={styles.clustersContainer}>
      <Text style={styles.clustersTitle}>📍 Areas You'll Explore Today</Text>
      <View style={styles.clustersList}>
        {clustersInfo.map((cluster, index) => (
          <View key={index} style={styles.clusterItem}>
            <View style={[styles.clusterColor, { backgroundColor: cluster.color }]} />
            <Text style={styles.clusterName}>{cluster.name}</Text>
            <Text style={styles.clusterCount}>{cluster.pois} place{cluster.pois !== 1 ? 's' : ''}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPOI = (poi: any, index: number) => (
    <TouchableOpacity
      key={poi.id}
      style={styles.poiCard}
      onPress={() => handlePOIPress(poi)}
      activeOpacity={0.8}
    >
      <View style={styles.poiHeader}>
        <View style={styles.poiTimeContainer}>
          <Text style={styles.poiTime}>{poi.time}</Text>
          <Text style={styles.poiDuration}>{poi.duration} min</Text>
        </View>
        <View style={[
          styles.clusterIndicator, 
          { backgroundColor: poi.clusterInfo.clusterName === 'Recoleta Cultural Zone' ? '#4ECDC4' : 
                            poi.clusterInfo.clusterName === 'Historic Center' ? '#45B7D1' :
                            poi.clusterInfo.clusterName === 'La Boca Artistic Quarter' ? '#FF6B6B' : '#95A5A6' }
        ]} />
      </View>
      
      <View style={styles.poiContent}>
        <Text style={styles.poiName}>{poi.name}</Text>
        <Text style={styles.poiCategory}>{poi.category}</Text>
        <Text style={styles.poiDescription} numberOfLines={2}>
          {poi.description}
        </Text>
        
        <View style={styles.poiFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {poi.rating}</Text>
            <Text style={styles.reviews}>({poi.reviews} reviews)</Text>
          </View>
          
          <View style={styles.clusterInfo}>
            <Text style={styles.clusterTag}>
              🎯 {poi.clusterInfo.clusterName}
            </Text>
          </View>
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
            {currentDay.totalDistance} • {currentDay.walkingTime} walking
          </Text>
        </View>

        {renderClusterInfo(currentDay.clustersSummary)}

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
              <Text style={styles.statNumber}>{generatedItinerary.stats.totalDistance}</Text>
              <Text style={styles.statLabel}>Total Distance</Text>
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
            {generatedItinerary.destination} • {generatedItinerary.dates.start.toLocaleDateString()} - {generatedItinerary.dates.end.toLocaleDateString()}
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
  clustersContainer: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  clustersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 12,
  },
  clustersList: {
    gap: 8,
  },
  clusterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  clusterColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  clusterName: {
    flex: 1,
    fontSize: 14,
    color: palette.text.primary,
    fontWeight: '500',
  },
  clusterCount: {
    fontSize: 12,
    color: palette.text.secondary,
    backgroundColor: palette.secondary.light,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
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
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  poiHeader: {
    alignItems: 'center',
    marginRight: 16,
  },
  poiTimeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  poiTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.primary.main,
  },
  poiDuration: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  clusterIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
  },
  poiContent: {
    flex: 1,
  },
  poiName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  poiCategory: {
    fontSize: 12,
    color: palette.text.secondary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  poiDescription: {
    fontSize: 14,
    color: palette.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  poiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: palette.text.disabled,
  },
  clusterInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  clusterTag: {
    fontSize: 10,
    color: palette.text.disabled,
  },
  poiArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
