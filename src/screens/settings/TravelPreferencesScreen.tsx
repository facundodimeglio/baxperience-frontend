import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { palette } from '../../theme/colors/palette';
import { CustomButton } from '../../components/common/CustomButton';

interface PreferenceItem {
  id: string;
  name: string;
  emoji: string;
  selected: boolean;
}

interface TravelPreferencesScreenProps {
  navigation: any;
}

export const TravelPreferencesScreen: React.FC<TravelPreferencesScreenProps> = ({ navigation }) => {
  // Categorías de preferencias
  const [categories] = useState([
    { id: 'places', title: 'Places' },
    { id: 'transport', title: 'Transport' },
  ]);
  
  const [currentCategory, setCurrentCategory] = useState('places');
  
  // Preferencias de viaje por categoría
  const [preferences, setPreferences] = useState<Record<string, PreferenceItem[]>>({
    places: [
      { id: 'museos', name: 'Museums', emoji: '🏛️', selected: true },
      { id: 'gastronomia', name: 'Gastronomy', emoji: '🍽️', selected: true },
      { id: 'monumentos', name: 'Monuments', emoji: '🗿', selected: true },
      { id: 'lugares_historicos', name: 'Historic Places', emoji: '🏰', selected: true },
      { id: 'entretenimiento', name: 'Entertainment', emoji: '🎭', selected: false },
      { id: 'eventos', name: 'Events', emoji: '🎪', selected: false },
    ],
    transport: [
      { id: 'public', name: 'Public Transport', emoji: '🚌', selected: true },
      { id: 'walking', name: 'Walking', emoji: '👣', selected: true },
      { id: 'bicycle', name: 'Bicycle', emoji: '🚲', selected: false },
      { id: 'car-rental', name: 'Car Rental', emoji: '🚗', selected: false },
      { id: 'taxi', name: 'Taxi/Uber', emoji: '🚕', selected: true },
      { id: 'tour-bus', name: 'Tour Bus', emoji: '🚐', selected: false },
    ],
  });

  const togglePreference = (categoryId: string, preferenceId: string) => {
    setPreferences(prev => {
      const category = [...prev[categoryId]];
      const index = category.findIndex(item => item.id === preferenceId);
      
      if (index !== -1) {
        category[index] = { ...category[index], selected: !category[index].selected };
      }
      
      return { ...prev, [categoryId]: category };
    });
  };

  const handleSave = () => {
    // Aquí se guardarían los cambios (llamada a API)
    Alert.alert(
      'Preferences Updated',
      'Your travel preferences have been updated.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Travel Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.tab,
                currentCategory === category.id && styles.activeTab,
              ]}
              onPress={() => setCurrentCategory(category.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  currentCategory === category.id && styles.activeTabText,
                ]}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.preferencesContainer}>
          {preferences[currentCategory].map(preference => (
            <TouchableOpacity
              key={preference.id}
              style={[
                styles.preferenceItem,
                preference.selected && styles.selectedPreferenceItem,
              ]}
              onPress={() => togglePreference(currentCategory, preference.id)}
              activeOpacity={0.7}
            >
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceEmoji}>{preference.emoji}</Text>
                <Text style={styles.preferenceName}>{preference.name}</Text>
              </View>
              <View
                style={[
                  styles.checkmark,
                  preference.selected && styles.activeCheckmark,
                ]}
              >
                {preference.selected && (
                  <Text style={styles.checkmarkText}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title="Save Preferences"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
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
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.secondary.main,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    fontSize: 22,
    color: palette.secondary.main,
  },
  tabsContainer: {
    backgroundColor: palette.primary.main,
  },
  tabs: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: palette.secondary.main,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activeTabText: {
    color: palette.primary.main,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  preferencesContainer: {
    padding: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedPreferenceItem: {
    borderColor: palette.primary.main,
    backgroundColor: palette.primary.light + '20',
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  preferenceName: {
    fontSize: 16,
    color: palette.text.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCheckmark: {
    backgroundColor: palette.primary.main,
    borderColor: palette.primary.main,
  },
  checkmarkText: {
    color: palette.secondary.main,
    fontWeight: 'bold',
    fontSize: 14,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 10,
  },
  saveButton: {
    backgroundColor: palette.primary.main,
  },
});

export default TravelPreferencesScreen;







