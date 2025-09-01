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
import { itineraryService } from '../../services/api/itineraryService';

const { width } = Dimensions.get('window');

interface ItineraryGenerationScreenProps {
  navigation: any;
  route: {
    params: {
      requestData: any;
      tripData: any;
    };
  };
}

export const ItineraryGenerationScreen: React.FC<ItineraryGenerationScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { requestData, tripData } = route.params;
  const [loadingStage, setLoadingStage] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);

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
        // Call the real API when all stages are complete
        generateRealItinerary();
      }
    }, loadingStages[loadingStage].duration);

    return () => clearTimeout(timer);
  }, [loadingStage]);

  const generateRealItinerary = async () => {
    try {
      console.log('📤 Calling real API to generate itinerary...');
      const response = await itineraryService.generatePersonalizedItinerary(requestData);
      
      console.log('✅ Itinerary generated successfully:', response);
      setGeneratedItinerary(response.itinerario_propuesto);
      
      // Navigate to generated itinerary screen with real data
      navigation.replace('GeneratedItinerary', { 
        itinerary: response.itinerario_propuesto,
        tripData
      });
      
    } catch (error: any) {
      console.error('❌ Failed to generate itinerary:', error);
      
      // Navigate back to CreateTrip with error
      navigation.goBack();
      // You could also show an error alert here
    }
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
            Buenos Aires, CABA • {tripData.startDate?.toLocaleDateString()}
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
