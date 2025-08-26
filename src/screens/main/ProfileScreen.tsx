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
import { palette } from '../../theme/colors/palette';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const userStats = [
    { label: 'Trips Created', value: '12', icon: '✈️' },
    { label: 'Cities Visited', value: '8', icon: '🏙️' },
    { label: 'Countries', value: '3', icon: '🌍' },
    { label: 'Days Traveled', value: '24', icon: '📅' },
  ];

  const preferences = [
    'Arte', 'Gastronomía', 'Museos', 'Naturaleza'
  ];

  const menuItems = [
    { id: 'edit-profile', title: 'Edit Profile', icon: '✏️', onPress: () => navigation.navigate('EditProfile') },
    { id: 'preferences', title: 'Travel Preferences', icon: '🎯', onPress: () => navigation.navigate('TravelPreferences') },
    { id: 'notifications', title: 'Notifications', icon: '🔔', onPress: () => navigation.navigate('Notifications') },
    { id: 'privacy', title: 'Privacy Settings', icon: '🔒', onPress: () => navigation.navigate('PrivacySettings') },
    { id: 'help', title: 'Help & Support', icon: '❓', onPress: () => navigation.navigate('HelpSupport') },
    { id: 'about', title: 'About Baxperience', icon: 'ℹ️', onPress: () => navigation.navigate('About') },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          // Handle logout logic here
          navigation.navigate('Auth');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.primary.main} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('ChangePhoto')}
          >
            <Text style={styles.avatarText}>JD</Text>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
            <Text style={styles.userLocation}>📍 Buenos Aires, Argentina</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Travel Stats</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <Animated.View
                key={stat.label}
                style={[
                  styles.statCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Travel Preferences</Text>
          <View style={styles.preferencesContainer}>
            {preferences.map((preference, index) => (
              <View key={preference} style={styles.preferenceTag}>
                <Text style={styles.preferenceTagText}>{preference}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.editPreferencesButton}
            onPress={() => navigation.navigate('TravelPreferences')}
          >
            <Text style={styles.editPreferencesText}>Edit Preferences</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Menu Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                <Text style={styles.menuItemArrow}>›</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Logout Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App Info */}
        <Animated.View style={[styles.appInfo, { opacity: fadeAnim }]}>
          <Text style={styles.appInfoText}>Baxperience v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with ❤️ for travelers</Text>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.secondary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: palette.primary.main,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.secondary.main,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: palette.secondary.main,
    opacity: 0.8,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: palette.secondary.main,
    opacity: 0.7,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
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
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  preferenceTag: {
    backgroundColor: palette.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  preferenceTagText: {
    color: palette.secondary.main,
    fontSize: 12,
    fontWeight: '500',
  },
  editPreferencesButton: {
    alignSelf: 'flex-start',
  },
  editPreferencesText: {
    color: palette.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.background.paper,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    color: palette.text.primary,
  },
  menuItemArrow: {
    fontSize: 20,
    color: palette.text.disabled,
  },
  logoutButton: {
    backgroundColor: palette.error.main,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: palette.secondary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: palette.text.disabled,
    marginBottom: 4,
  },
});
