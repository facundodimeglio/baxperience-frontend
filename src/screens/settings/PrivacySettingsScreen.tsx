import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { palette } from '../../theme/colors/palette';
import { CustomButton } from '../../components/common/CustomButton';

interface PrivacySettingsScreenProps {
  navigation: any;
}

export const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({ navigation }) => {
  // Configuraciones de privacidad
  const [settings, setSettings] = useState({
    // Visibilidad de perfil
    publicProfile: true,
    showLocation: false,
    showTrips: true,
    showReviews: true,
    
    // Datos personales
    shareAnalytics: true,
    personalizedContent: true,
    locationTracking: false,
    searchHistory: true,
    
    // Marketing
    emailMarketing: false,
    partnerOffers: false,
    allowRecommendations: true,
  });

  const toggleSetting = (settingId: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
  };

  const handleSave = () => {
    // Aquí se guardarían los cambios (llamada a API)
    Alert.alert(
      'Configuración guardada',
      'Las preferencias de privacidad han sido actualizadas.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Eliminar datos personales',
      'Esta acción eliminará tus datos de navegación, búsquedas y preferencias. No afecta a tu cuenta ni a tus viajes guardados. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Datos eliminados',
              'Tus datos personales han sido eliminados correctamente.'
            );
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción es irreversible y eliminará tu cuenta y todos tus datos permanentemente. ¿Estás seguro de que quieres continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmar eliminación',
              'Por favor, escribe "ELIMINAR" para confirmar la eliminación de tu cuenta.',
              [
                { text: 'Cancelar' },
                {
                  text: 'Confirmar',
                  style: 'destructive',
                  onPress: () => navigation.navigate('Auth'),
                }
              ]
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
        <Text style={styles.headerTitle}>Privacidad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de Visibilidad de Perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibilidad de perfil</Text>
          <Text style={styles.sectionDescription}>
            Controla qué información es visible para otros usuarios
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Perfil público</Text>
              <Text style={styles.settingDescription}>
                Permite que otros usuarios vean tu perfil
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
              <Text style={styles.settingTitle}>Mostrar ubicación</Text>
              <Text style={styles.settingDescription}>
                Compartir tu ubicación actual con otros usuarios
              </Text>
            </View>
            <Switch
              value={settings.showLocation}
              onValueChange={() => toggleSetting('showLocation')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.showLocation ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Mostrar viajes</Text>
              <Text style={styles.settingDescription}>
                Permitir que otros vean tus viajes pasados y futuros
              </Text>
            </View>
            <Switch
              value={settings.showTrips}
              onValueChange={() => toggleSetting('showTrips')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.showTrips ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Mostrar reseñas</Text>
              <Text style={styles.settingDescription}>
                Permitir que otros vean tus reseñas y calificaciones
              </Text>
            </View>
            <Switch
              value={settings.showReviews}
              onValueChange={() => toggleSetting('showReviews')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.showReviews ? palette.primary.main : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Sección de Datos Personales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos personales</Text>
          <Text style={styles.sectionDescription}>
            Gestiona cómo se utilizan tus datos para mejorar la aplicación
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Compartir datos analíticos</Text>
              <Text style={styles.settingDescription}>
                Enviar datos de uso anónimos para mejorar la aplicación
              </Text>
            </View>
            <Switch
              value={settings.shareAnalytics}
              onValueChange={() => toggleSetting('shareAnalytics')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.shareAnalytics ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Contenido personalizado</Text>
              <Text style={styles.settingDescription}>
                Recibir contenido basado en tus intereses y actividad
              </Text>
            </View>
            <Switch
              value={settings.personalizedContent}
              onValueChange={() => toggleSetting('personalizedContent')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.personalizedContent ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Seguimiento de ubicación</Text>
              <Text style={styles.settingDescription}>
                Permitir rastreo de ubicación en segundo plano
              </Text>
            </View>
            <Switch
              value={settings.locationTracking}
              onValueChange={() => toggleSetting('locationTracking')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.locationTracking ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Historial de búsqueda</Text>
              <Text style={styles.settingDescription}>
                Guardar historial para mejorar las recomendaciones
              </Text>
            </View>
            <Switch
              value={settings.searchHistory}
              onValueChange={() => toggleSetting('searchHistory')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.searchHistory ? palette.primary.main : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Sección de Marketing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketing</Text>
          <Text style={styles.sectionDescription}>
            Controla cómo recibir comunicaciones de marketing
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Emails de marketing</Text>
              <Text style={styles.settingDescription}>
                Recibir ofertas especiales y novedades por email
              </Text>
            </View>
            <Switch
              value={settings.emailMarketing}
              onValueChange={() => toggleSetting('emailMarketing')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.emailMarketing ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Ofertas de socios</Text>
              <Text style={styles.settingDescription}>
                Recibir promociones de marcas asociadas
              </Text>
            </View>
            <Switch
              value={settings.partnerOffers}
              onValueChange={() => toggleSetting('partnerOffers')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.partnerOffers ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Recomendaciones</Text>
              <Text style={styles.settingDescription}>
                Recibir sugerencias de viajes personalizadas
              </Text>
            </View>
            <Switch
              value={settings.allowRecommendations}
              onValueChange={() => toggleSetting('allowRecommendations')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.allowRecommendations ? palette.primary.main : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Sección de gestión de datos */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Gestión de datos</Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteData}
          >
            <Text style={styles.dangerButtonText}>Eliminar mis datos personales</Text>
          </TouchableOpacity>

          <Text style={styles.dangerDescription}>
            Elimina tu historial de navegación, búsquedas y datos de uso. Tus viajes y cuenta no se verán afectados.
          </Text>

          <TouchableOpacity
            style={[styles.dangerButton, styles.deleteAccountButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerButtonText}>Eliminar mi cuenta</Text>
          </TouchableOpacity>

          <Text style={styles.dangerDescription}>
            Esta acción es irreversible y eliminará permanentemente tu cuenta y todos tus datos asociados.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.privacyPolicyButton}
          onPress={() => Alert.alert('Política de privacidad', 'Aquí se mostraría la política de privacidad completa.')}
        >
          <Text style={styles.privacyPolicyText}>Ver política de privacidad</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title="Guardar cambios"
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    padding: 20,
    backgroundColor: palette.background.paper,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: palette.text.secondary,
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
  dangerSection: {
    padding: 20,
    marginBottom: 15,
  },
  dangerButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: palette.error.main,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  deleteAccountButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    marginTop: 20,
  },
  dangerButtonText: {
    color: palette.error.main,
    fontSize: 16,
    fontWeight: '600',
  },
  dangerDescription: {
    fontSize: 12,
    color: palette.text.secondary,
    marginBottom: 8,
  },
  privacyPolicyButton: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  privacyPolicyText: {
    fontSize: 14,
    color: palette.primary.main,
    fontWeight: '600',
    textDecorationLine: 'underline',
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

export default PrivacySettingsScreen;








