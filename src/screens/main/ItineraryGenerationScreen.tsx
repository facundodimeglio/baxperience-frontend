import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { palette } from '../../theme/colors/palette';

const { width } = Dimensions.get('window');

interface ItineraryGenerationScreenProps {
  navigation: any;
  route: {
    params: {
      tripData: any;
    };
  };
}

export const ItineraryGenerationScreen: React.FC<ItineraryGenerationScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { tripData } = route.params;
  const [loadingStage, setLoadingStage] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const loadingStages = [
    {
      id: 0,
      title: "Analyzing your preferences...",
      subtitle: "Reading your travel style and interests",
      icon: "🧠",
      duration: 2000,
    },
    {
      id: 1,
      title: "Finding the perfect places...",
      subtitle: "Searching through 3,500+ locations in Buenos Aires",
      icon: "🔍",
      duration: 2500,
    },
    {
      id: 2,
      title: "Applying AI clustering...",
      subtitle: "Grouping nearby attractions for optimal routes",
      icon: "🤖",
      duration: 2000,
    },
    {
      id: 3,
      title: "Optimizing your route...",
      subtitle: "Creating the perfect day-by-day schedule",
      icon: "🗺️",
      duration: 1500,
    },
    {
      id: 4,
      title: "Adding special events...",
      subtitle: "Including events happening during your visit",
      icon: "🎭",
      duration: 1000,
    },
  ];

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();

    // Start rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingStage < loadingStages.length - 1) {
        setLoadingStage(loadingStage + 1);
      } else {
        // Navigate to generated itinerary
        navigation.replace('GeneratedItinerary', { 
          tripData,
          generatedItinerary: generateMockItinerary(tripData)
        });
      }
    }, loadingStages[loadingStage].duration);

    return () => clearTimeout(timer);
  }, [loadingStage]);

  const generateMockItinerary = (tripData: any) => {
    // Mock itinerary data - in real app this would come from your clustering API
    return {
      tripName: tripData.tripName,
      destination: 'Buenos Aires, CABA',
      dates: {
        start: tripData.startDate,
        end: tripData.endDate,
      },
      baseLocation: tripData.baseLocation,
      transportMode: tripData.transportMode,
      days: [
        {
          day: 1,
          date: tripData.startDate,
          title: "Cultural Discovery",
          pois: [
            {
              id: 1,
              name: "Museo Nacional de Bellas Artes",
              category: "Museums",
              time: "09:00 - 11:00",
              duration: 120,
              description: "World-class art collection in a beautiful historic building",
              rating: 4.6,
              reviews: 1243,
              coordinates: { lat: -34.5843, lng: -58.3926 },
              clusterInfo: {
                clusterId: 1,
                clusterName: "Recoleta Cultural Zone",
                nearbyPois: 8,
              }
            },
            {
              id: 2,
              name: "Cementerio de la Recoleta",
              category: "Historical Sites",
              time: "11:30 - 12:30",
              duration: 60,
              description: "Famous cemetery with elaborate mausoleums and Eva Perón's tomb",
              rating: 4.4,
              reviews: 2156,
              coordinates: { lat: -34.5879, lng: -58.3931 },
              clusterInfo: {
                clusterId: 1,
                clusterName: "Recoleta Cultural Zone",
                nearbyPois: 8,
              }
            },
            {
              id: 3,
              name: "Café Tortoni",
              category: "Restaurants",
              time: "13:00 - 14:00",
              duration: 60,
              description: "Historic café famous for tango shows and traditional atmosphere",
              rating: 4.2,
              reviews: 3421,
              coordinates: { lat: -34.6118, lng: -58.3725 },
              clusterInfo: {
                clusterId: 2,
                clusterName: "Historic Center",
                nearbyPois: 12,
              }
            },
          ],
          totalDistance: "2.3 km",
          walkingTime: "28 minutes",
          clustersSummary: [
            { name: "Recoleta Cultural Zone", pois: 2, color: "#4ECDC4" },
            { name: "Historic Center", pois: 1, color: "#45B7D1" },
          ]
        },
        {
          day: 2,
          date: new Date(tripData.startDate.getTime() + 24 * 60 * 60 * 1000),
          title: "Neighborhood Explorer",
          pois: [
            {
              id: 4,
              name: "Caminito",
              category: "Attractions",
              time: "10:00 - 11:30",
              duration: 90,
              description: "Colorful street museum in La Boca with tango performances",
              rating: 4.1,
              reviews: 5632,
              coordinates: { lat: -34.6394, lng: -58.3628 },
              clusterInfo: {
                clusterId: 3,
                clusterName: "La Boca Artistic Quarter",
                nearbyPois: 6,
              }
            },
            {
              id: 5,
              name: "Puerto Madero",
              category: "Districts",
              time: "14:00 - 16:00",
              duration: 120,
              description: "Modern waterfront district with upscale dining and architecture",
              rating: 4.5,
              reviews: 1876,
              coordinates: { lat: -34.6118, lng: -58.3960 },
              clusterInfo: {
                clusterId: 4,
                clusterName: "Waterfront Modern",
                nearbyPois: 10,
              }
            },
          ],
          totalDistance: "4.1 km",
          walkingTime: "48 minutes",
          clustersSummary: [
            { name: "La Boca Artistic Quarter", pois: 1, color: "#FF6B6B" },
            { name: "Waterfront Modern", pois: 1, color: "#4ECDC4" },
          ]
        },
      ],
      stats: {
        totalPois: 5,
        totalDistance: "6.4 km", 
        clustersUsed: 4,
        areasExplored: "4 neighborhoods",
      },
      aiInsights: [
        "Your itinerary balances cultural attractions with neighborhood exploration",
        "All locations are within walking distance or short transport rides",
        "We've included 2 highly-rated restaurants based on your preferences",
        "Special events happening during your visit have been added",
      ]
    };
  };

  const currentStage = loadingStages[loadingStage];
  const progress = ((loadingStage + 1) / loadingStages.length) * 100;

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.primary.main} />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: `${progress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        {/* Main Icon */}
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              transform: [{ rotate: rotateInterpolate }]
            }
          ]}
        >
          <Text style={styles.mainIcon}>{currentStage.icon}</Text>
        </Animated.View>

        {/* Loading Text */}
        <Text style={styles.loadingTitle}>{currentStage.title}</Text>
        <Text style={styles.loadingSubtitle}>{currentStage.subtitle}</Text>

        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <Text style={styles.tripInfoTitle}>Creating itinerary for:</Text>
          <Text style={styles.tripName}>{tripData.tripName}</Text>
                  <Text style={styles.tripDetails}>
          Buenos Aires, CABA • {tripData.startDate?.toLocaleDateString()} - {tripData.endDate?.toLocaleDateString()}
        </Text>
        </View>

        {/* Loading Stages */}
        <View style={styles.stagesContainer}>
          {loadingStages.map((stage, index) => (
            <View key={stage.id} style={styles.stageItem}>
              <View style={[
                styles.stageIndicator,
                index <= loadingStage && styles.stageIndicatorActive,
                index < loadingStage && styles.stageIndicatorCompleted,
              ]}>
                {index < loadingStage ? (
                  <Text style={styles.stageCheck}>✓</Text>
                ) : (
                  <Text style={styles.stageNumber}>{index + 1}</Text>
                )}
              </View>
              <Text style={[
                styles.stageText,
                index <= loadingStage && styles.stageTextActive
              ]}>
                {stage.title.replace(/\.\.\.$/, '')}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width - 48,
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.secondary.main,
    borderRadius: 2,
  },
  progressText: {
    color: palette.secondary.main,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainIcon: {
    fontSize: 60,
  },
  loadingTitle: {
    color: palette.secondary.main,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingSubtitle: {
    color: palette.secondary.main,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 40,
  },
  tripInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  tripInfoTitle: {
    color: palette.secondary.main,
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  tripName: {
    color: palette.secondary.main,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  tripDetails: {
    color: palette.secondary.main,
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  stagesContainer: {
    width: '100%',
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stageIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stageIndicatorActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: palette.secondary.main,
  },
  stageIndicatorCompleted: {
    backgroundColor: palette.secondary.main,
  },
  stageCheck: {
    color: palette.primary.main,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stageNumber: {
    color: palette.secondary.main,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stageText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    flex: 1,
  },
  stageTextActive: {
    color: palette.secondary.main,
    fontWeight: '500',
  },
});
