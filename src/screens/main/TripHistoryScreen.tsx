import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { palette } from '../../theme/colors/palette';

interface TripHistoryScreenProps {
  navigation: any;
}

interface Trip {
  id: string;
  destination: string;
  dates: string;
  duration: string;
  image: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  activities: string[];
  rating?: number;
}

export const TripHistoryScreen: React.FC<TripHistoryScreenProps> = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const trips: Trip[] = [
    {
      id: '1',
      destination: 'Buenos Aires',
      dates: 'Mar 15-20, 2024',
      duration: '5 days',
      image: '🏙️',
      status: 'completed',
      activities: ['Museums', 'Gastronomy', 'Art'],
      rating: 5,
    },
    {
      id: '2',
      destination: 'Bariloche',
      dates: 'Feb 10-14, 2024',
      duration: '4 days',
      image: '🏔️',
      status: 'completed',
      activities: ['Nature', 'Adventure', 'Photography'],
      rating: 4,
    },
    {
      id: '3',
      destination: 'Mendoza',
      dates: 'Jan 5-8, 2024',
      duration: '3 days',
      image: '🍷',
      status: 'completed',
      activities: ['Wine Tasting', 'Gastronomy'],
      rating: 5,
    },
    {
      id: '4',
      destination: 'Salta',
      dates: 'May 20-25, 2024',
      duration: '5 days',
      image: '⛰️',
      status: 'upcoming',
      activities: ['Culture', 'History', 'Nature'],
    },
    {
      id: '5',
      destination: 'Ushuaia',
      dates: 'Jun 10-15, 2024',
      duration: '5 days',
      image: '🐧',
      status: 'upcoming',
      activities: ['Adventure', 'Nature', 'Wildlife'],
    },
  ];

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    return trip.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return palette.success.main;
      case 'upcoming':
        return palette.primary.main;
      case 'cancelled':
        return palette.error.main;
      default:
        return palette.text.disabled;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓ Completed';
      case 'upcoming':
        return '📅 Upcoming';
      case 'cancelled':
        return '✗ Cancelled';
      default:
        return status;
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text
            key={star}
            style={[
              styles.star,
              { color: star <= rating ? '#FFD700' : palette.text.disabled }
            ]}
          >
            ⭐
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.background.default} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''}
        </Text>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View style={[styles.filterContainer, { opacity: fadeAnim }]}>
        {['all', 'completed', 'upcoming'].map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[
              styles.filterTab,
              filter === filterOption && styles.filterTabActive
            ]}
            onPress={() => setFilter(filterOption as any)}
          >
            <Text style={[
              styles.filterTabText,
              filter === filterOption && styles.filterTabTextActive
            ]}>
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Trips List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredTrips.map((trip, index) => (
          <Animated.View
            key={trip.id}
            style={[
              styles.tripCard,
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
              style={styles.tripCardContent}
              onPress={() => {/* Navigate to trip details */}}
              activeOpacity={0.8}
            >
              <View style={styles.tripImageContainer}>
                <Text style={styles.tripImage}>{trip.image}</Text>
              </View>
              
              <View style={styles.tripDetails}>
                <View style={styles.tripHeader}>
                  <Text style={styles.tripDestination}>{trip.destination}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(trip.status)}</Text>
                  </View>
                </View>
                
                <Text style={styles.tripDates}>{trip.dates}</Text>
                <Text style={styles.tripDuration}>{trip.duration}</Text>
                
                {trip.rating && renderStars(trip.rating)}
                
                <View style={styles.activitiesContainer}>
                  {trip.activities.slice(0, 3).map((activity, idx) => (
                    <View key={idx} style={styles.activityTag}>
                      <Text style={styles.activityTagText}>{activity}</Text>
                    </View>
                  ))}
                  {trip.activities.length > 3 && (
                    <View style={styles.activityTag}>
                      <Text style={styles.activityTagText}>
                        +{trip.activities.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.tripActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                {trip.status === 'upcoming' && (
                  <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                    <Text style={[styles.actionButtonText, styles.editButtonText]}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
        
        {filteredTrips.length === 0 && (
          <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
            <Text style={styles.emptyStateIcon}>✈️</Text>
            <Text style={styles.emptyStateTitle}>No trips found</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'all' 
                ? "You haven't created any trips yet. Start planning your next adventure!"
                : `No ${filter} trips found. Try changing the filter.`
              }
            </Text>
            <TouchableOpacity 
              style={styles.createTripButton}
              onPress={() => navigation.navigate('CreateTrip')}
            >
              <Text style={styles.createTripButtonText}>Create New Trip</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View 
        style={[
          styles.fab,
          {
            opacity: fadeAnim,
            transform: [{
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              })
            }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => navigation.navigate('CreateTrip')}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background.default,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: palette.text.secondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: palette.background.paper,
  },
  filterTabActive: {
    backgroundColor: palette.primary.main,
  },
  filterTabText: {
    fontSize: 14,
    color: palette.text.secondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: palette.secondary.main,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  tripCard: {
    marginBottom: 16,
  },
  tripCardContent: {
    backgroundColor: palette.background.default,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: palette.secondary.dark,
  },
  tripImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tripImage: {
    fontSize: 32,
  },
  tripDetails: {
    flex: 1,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: palette.secondary.main,
    fontSize: 10,
    fontWeight: '600',
  },
  tripDates: {
    fontSize: 14,
    color: palette.text.secondary,
    marginBottom: 2,
  },
  tripDuration: {
    fontSize: 12,
    color: palette.text.disabled,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 12,
    marginRight: 2,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  activityTag: {
    backgroundColor: palette.background.paper,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.primary.light,
  },
  activityTagText: {
    fontSize: 10,
    color: palette.primary.main,
    fontWeight: '500',
  },
  tripActions: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    backgroundColor: palette.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.primary.main,
  },
  actionButtonText: {
    color: palette.secondary.main,
    fontSize: 12,
    fontWeight: '600',
  },
  editButtonText: {
    color: palette.primary.main,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: palette.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  createTripButton: {
    backgroundColor: palette.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createTripButtonText: {
    color: palette.secondary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    color: palette.secondary.main,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
