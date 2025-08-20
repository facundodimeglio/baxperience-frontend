import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { CustomButton } from '../../components/common/CustomButton';
import { palette } from '../../theme/colors/palette';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
    ]).start();
  }, []);

  const quickActions = [
    {
      id: 'new-trip',
      title: 'New Trip',
      subtitle: 'Create AI itinerary',
      icon: '✨',
      color: palette.primary.main,
      onPress: () => navigation.navigate('CreateTrip'),
    },
    {
      id: 'surprise-me',
      title: 'Surprise Me',
      subtitle: 'Random destination',
      icon: '🎲',
      color: '#FF6B6B',
      onPress: () => {/* Handle surprise trip */},
    },
    {
      id: 'nearby',
      title: 'Nearby',
      subtitle: 'Local experiences',
      icon: '📍',
      color: '#4ECDC4',
      onPress: () => {/* Handle nearby */},
    },
    {
      id: 'favorites',
      title: 'Favorites',
      subtitle: 'Saved places',
      icon: '❤️',
      color: '#45B7D1',
      onPress: () => {/* Handle favorites */},
    },
  ];

  const recentTrips = [
    {
      id: '1',
      destination: 'Buenos Aires',
      dates: 'Mar 15-20, 2024',
      image: '🏙️',
      status: 'completed',
    },
    {
      id: '2',
      destination: 'Bariloche',
      dates: 'Feb 10-14, 2024',
      image: '🏔️',
      status: 'completed',
    },
    {
      id: '3',
      destination: 'Mendoza',
      dates: 'Jan 5-8, 2024',
      image: '🍷',
      status: 'completed',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.primary.main} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.heroContent}>
            <Text style={styles.welcomeText}>Welcome back! 👋</Text>
            <Text style={styles.heroTitle}>Ready for your next{'\n'}adventure?</Text>
            <Text style={styles.heroSubtitle}>
              Let AI create the perfect itinerary based on your preferences
            </Text>
          </View>
          
          <View style={styles.heroButtons}>
            <CustomButton
              title="Create New Trip"
              onPress={() => navigation.navigate('CreateTrip')}
              style={styles.primaryButton}
            />
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('TripHistory')}
            >
              <Text style={styles.secondaryButtonText}>View My Trips</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.section,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.id}
                style={[
                  styles.quickActionCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      })
                    }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={[styles.quickActionButton, { borderColor: action.color }]}
                  onPress={action.onPress}
                  activeOpacity={0.8}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <Text style={styles.quickActionIconText}>{action.icon}</Text>
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* AI Features */}
        <Animated.View 
          style={[
            styles.section,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>AI-Powered Features</Text>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🤖</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Itinerary Generator</Text>
              <Text style={styles.featureDescription}>
                Our AI analyzes your preferences, budget, and time to create personalized travel plans
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🎯</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Personalized Recommendations</Text>
              <Text style={styles.featureDescription}>
                Get suggestions tailored to your interests: art, food, culture, and more
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Recent Trips */}
        <Animated.View 
          style={[
            styles.section,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TripHistory')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tripsScroll}
          >
            {recentTrips.map((trip, index) => (
              <Animated.View
                key={trip.id}
                style={[
                  styles.tripCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      })
                    }]
                  }
                ]}
              >
                <TouchableOpacity style={styles.tripCardContent}>
                  <View style={styles.tripImage}>
                    <Text style={styles.tripImageText}>{trip.image}</Text>
                  </View>
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripDestination}>{trip.destination}</Text>
                    <Text style={styles.tripDates}>{trip.dates}</Text>
                    <View style={styles.tripStatus}>
                      <Text style={styles.tripStatusText}>✓ Completed</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View 
          style={[
            styles.section,
            styles.statsSection,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>Your Travel Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Trips Created</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Cities Visited</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Days Traveled</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: palette.primary.main,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    marginBottom: 32,
  },
  welcomeText: {
    color: palette.secondary.main,
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.9,
  },
  heroTitle: {
    color: palette.secondary.main,
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 38,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: palette.secondary.main,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  heroButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: palette.secondary.main,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: palette.secondary.main,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: palette.secondary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: palette.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 60) / 2,
  },
  quickActionButton: {
    backgroundColor: palette.background.default,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: palette.text.secondary,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: palette.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: palette.text.secondary,
    lineHeight: 20,
  },
  tripsScroll: {
    paddingRight: 24,
  },
  tripCard: {
    width: 200,
    marginRight: 16,
  },
  tripCardContent: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tripImage: {
    height: 100,
    backgroundColor: palette.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripImageText: {
    fontSize: 40,
  },
  tripInfo: {
    padding: 16,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 12,
    color: palette.text.secondary,
    marginBottom: 8,
  },
  tripStatus: {
    alignSelf: 'flex-start',
  },
  tripStatusText: {
    fontSize: 12,
    color: palette.success.main,
    fontWeight: '500',
  },
  statsSection: {
    backgroundColor: palette.background.paper,
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: palette.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: palette.text.secondary,
    textAlign: 'center',
  },
});
