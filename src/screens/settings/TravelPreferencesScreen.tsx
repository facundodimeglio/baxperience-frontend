import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
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
    { id: 'places', title: 'Lugares' },
    { id: 'activities', title: 'Actividades' },
    { id: 'food', title: 'Gastronomía' },
    { id: 'accommodation', title: 'Alojamiento' },
    { id: 'transport', title: 'Transporte' },
  ]);
  
  const [currentCategory, setCurrentCategory] = useState('places');
  
  // Preferencias de viaje por categoría
  const [preferences, setPreferences] = useState<Record<string, PreferenceItem[]>>({
    places: [
      { id: 'museums', name: 'Museos', emoji: '🏛️', selected: true },
      { id: 'parks', name: 'Parques', emoji: '🌳', selected: true },
      { id: 'beaches', name: 'Playas', emoji: '🏖️', selected: false },
      { id: 'mountains', name: 'Montañas', emoji: '⛰️', selected: false },
      { id: 'historical', name: 'Sitios Históricos', emoji: '🏰', selected: true },
      { id: 'shopping', name: 'Shopping', emoji: '🛍️', selected: false },
    ],
    activities: [
      { id: 'hiking', name: 'Senderismo', emoji: '🥾', selected: false },
      { id: 'tours', name: 'Tours guiados', emoji: '🧭', selected: true },
      { id: 'nightlife', name: 'Vida nocturna', emoji: '🌃', selected: false },
      { id: 'sports', name: 'Deportes', emoji: '⚽', selected: false },
      { id: 'relaxation', name: 'Relajación', emoji: '🧘', selected: true },
      { id: 'adventures', name: 'Aventuras', emoji: '🚵‍♀️', selected: false },
    ],
    food: [
      { id: 'local', name: 'Cocina local', emoji: '🍲', selected: true },
      { id: 'fine-dining', name: 'Alta cocina', emoji: '🍽️', selected: false },
      { id: 'street-food', name: 'Comida callejera', emoji: '🌮', selected: true },
      { id: 'vegetarian', name: 'Vegetariano', emoji: '🥗', selected: false },
      { id: 'desserts', name: 'Postres', emoji: '🍰', selected: true },
      { id: 'coffee', name: 'Cafeterías', emoji: '☕', selected: true },
    ],
    accommodation: [
      { id: 'hotels', name: 'Hoteles', emoji: '🏨', selected: true },
      { id: 'hostels', name: 'Hostels', emoji: '🛏️', selected: false },
      { id: 'apartments', name: 'Apartamentos', emoji: '🏢', selected: true },
      { id: 'resorts', name: 'Resorts', emoji: '🌴', selected: false },
      { id: 'camping', name: 'Camping', emoji: '⛺', selected: false },
      { id: 'boutique', name: 'Boutique', emoji: '🏠', selected: false },
    ],
    transport: [
      { id: 'public', name: 'Transporte público', emoji: '🚌', selected: true },
      { id: 'walking', name: 'Caminar', emoji: '👣', selected: true },
      { id: 'bicycle', name: 'Bicicleta', emoji: '🚲', selected: false },
      { id: 'car-rental', name: 'Alquiler de autos', emoji: '🚗', selected: false },
      { id: 'taxi', name: 'Taxi/Uber', emoji: '🚕', selected: true },
      { id: 'tour-bus', name: 'Bus turístico', emoji: '🚐', selected: false },
    ],
  });

  // Configuración adicional
  const [settings, setSettings] = useState({
    notifyDiscounts: true,
    shareData: false,
    publicProfile: true,
    emailRecommendations: true,
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

  const toggleSetting = (settingId: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
  };

  const handleSave = () => {
    // Aquí se guardarían los cambios (llamada a API)
    Alert.alert(
      'Preferencias actualizadas',
      'Tus preferencias de viaje han sido actualizadas.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Restablecer preferencias',
      '¿Estás seguro de que deseas restablecer todas tus preferencias?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: () => {
            // Lógica para restablecer preferencias
            Alert.alert(
              'Preferencias restablecidas',
              'Todas tus preferencias han sido restablecidas a los valores predeterminados.'
            );
          },
        },
      ]
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
        <Text style={styles.headerTitle}>Preferencias de viaje</Text>
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

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configuración adicional</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notificaciones de descuentos</Text>
              <Text style={styles.settingDescription}>
                Recibe alertas sobre ofertas especiales en tus destinos favoritos
              </Text>
            </View>
            <Switch
              value={settings.notifyDiscounts}
              onValueChange={() => toggleSetting('notifyDiscounts')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.notifyDiscounts ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Compartir datos anónimos</Text>
              <Text style={styles.settingDescription}>
                Ayuda a mejorar las recomendaciones compartiendo datos anónimos de uso
              </Text>
            </View>
            <Switch
              value={settings.shareData}
              onValueChange={() => toggleSetting('shareData')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.shareData ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Perfil público</Text>
              <Text style={styles.settingDescription}>
                Permite que otros usuarios vean tus reseñas y recomendaciones
              </Text>
            </View>
            <Switch
              value={settings.publicProfile}
              onValueChange={() => toggleSetting('publicProfile')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.publicProfile ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Recomendaciones por email</Text>
              <Text style={styles.settingDescription}>
                Recibe sugerencias personalizadas en tu correo electrónico
              </Text>
            </View>
            <Switch
              value={settings.emailRecommendations}
              onValueChange={() => toggleSetting('emailRecommendations')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.emailRecommendations ? palette.primary.main : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Restablecer todas las preferencias</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title="Guardar preferencias"
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
  settingsSection: {
    padding: 20,
    backgroundColor: palette.background.paper,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: palette.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resetButtonText: {
    fontSize: 14,
    color: palette.error.main,
    fontWeight: '600',
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


