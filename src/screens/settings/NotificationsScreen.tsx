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

interface NotificationOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  // Categorías de notificaciones
  const [categories] = useState([
    {
      id: 'travel',
      title: 'Viajes',
      options: [
        {
          id: 'trip-reminders',
          title: 'Recordatorios de viaje',
          description: 'Notificaciones sobre próximos viajes y actividades',
          enabled: true,
        },
        {
          id: 'booking-confirmations',
          title: 'Confirmaciones de reservas',
          description: 'Recibe confirmaciones de tus reservas de viaje',
          enabled: true,
        },
        {
          id: 'itinerary-changes',
          title: 'Cambios en el itinerario',
          description: 'Alertas sobre modificaciones en tu itinerario',
          enabled: true,
        },
        {
          id: 'travel-tips',
          title: 'Consejos de viaje',
          description: 'Recomendaciones útiles para tus destinos',
          enabled: false,
        },
      ],
    },
    {
      id: 'deals',
      title: 'Ofertas',
      options: [
        {
          id: 'price-alerts',
          title: 'Alertas de precios',
          description: 'Notificaciones cuando bajen los precios de tus destinos favoritos',
          enabled: true,
        },
        {
          id: 'special-deals',
          title: 'Ofertas especiales',
          description: 'Promociones exclusivas y descuentos',
          enabled: true,
        },
        {
          id: 'seasonal-offers',
          title: 'Ofertas de temporada',
          description: 'Descuentos por temporada baja',
          enabled: false,
        },
      ],
    },
    {
      id: 'account',
      title: 'Cuenta',
      options: [
        {
          id: 'security-alerts',
          title: 'Alertas de seguridad',
          description: 'Notificaciones sobre acciones importantes en tu cuenta',
          enabled: true,
        },
        {
          id: 'account-updates',
          title: 'Actualizaciones de cuenta',
          description: 'Cambios en tu perfil, preferencias o configuración',
          enabled: true,
        },
        {
          id: 'payment-notifications',
          title: 'Notificaciones de pago',
          description: 'Confirmaciones de pagos y facturas',
          enabled: true,
        },
      ],
    },
    {
      id: 'marketing',
      title: 'Marketing',
      options: [
        {
          id: 'newsletters',
          title: 'Boletines informativos',
          description: 'Noticias sobre viajes y actualizaciones de BAXperience',
          enabled: false,
        },
        {
          id: 'personalized-content',
          title: 'Contenido personalizado',
          description: 'Recomendaciones basadas en tus intereses',
          enabled: true,
        },
        {
          id: 'surveys',
          title: 'Encuestas y feedback',
          description: 'Invitaciones para compartir tu opinión',
          enabled: false,
        },
      ],
    },
  ]);

  // Configuración general
  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const toggleOption = (categoryId: string, optionId: string) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        const updatedOptions = category.options.map(option => {
          if (option.id === optionId) {
            return { ...option, enabled: !option.enabled };
          }
          return option;
        });
        return { ...category, options: updatedOptions };
      }
      return category;
    });
    // En un entorno real, actualizaríamos el estado aquí
    // setCategories(updatedCategories);
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
      'Configuración guardada',
      'Las preferencias de notificación han sido actualizadas.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const turnOffAll = () => {
    Alert.alert(
      'Desactivar todas las notificaciones',
      '¿Estás seguro de que deseas desactivar todas las notificaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar',
          style: 'destructive',
          onPress: () => {
            // Lógica para desactivar todas las notificaciones
            Alert.alert(
              'Notificaciones desactivadas',
              'Todas las notificaciones han sido desactivadas.'
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
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.generalSettings}>
          <Text style={styles.sectionTitle}>Configuración general</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notificaciones push</Text>
              <Text style={styles.settingDescription}>
                Recibe notificaciones en tu dispositivo
              </Text>
            </View>
            <Switch
              value={settings.pushEnabled}
              onValueChange={() => toggleSetting('pushEnabled')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.pushEnabled ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notificaciones por email</Text>
              <Text style={styles.settingDescription}>
                Recibe actualizaciones en tu correo electrónico
              </Text>
            </View>
            <Switch
              value={settings.emailEnabled}
              onValueChange={() => toggleSetting('emailEnabled')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.emailEnabled ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notificaciones por SMS</Text>
              <Text style={styles.settingDescription}>
                Recibe alertas importantes por mensaje de texto
              </Text>
            </View>
            <Switch
              value={settings.smsEnabled}
              onValueChange={() => toggleSetting('smsEnabled')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.smsEnabled ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sonido</Text>
              <Text style={styles.settingDescription}>
                Reproducir sonido con las notificaciones
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={() => toggleSetting('soundEnabled')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.soundEnabled ? palette.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Vibración</Text>
              <Text style={styles.settingDescription}>
                Vibrar con las notificaciones
              </Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={() => toggleSetting('vibrationEnabled')}
              trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
              thumbColor={settings.vibrationEnabled ? palette.primary.main : '#f4f3f4'}
            />
          </View>
        </View>

        {categories.map(category => (
          <View key={category.id} style={styles.categorySection}>
            <Text style={styles.sectionTitle}>{category.title}</Text>

            {category.options.map(option => (
              <View key={option.id} style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>{option.title}</Text>
                  <Text style={styles.notificationDescription}>
                    {option.description}
                  </Text>
                </View>
                <Switch
                  value={option.enabled}
                  onValueChange={() => toggleOption(category.id, option.id)}
                  trackColor={{ false: '#e0e0e0', true: palette.primary.light }}
                  thumbColor={option.enabled ? palette.primary.main : '#f4f3f4'}
                />
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity
          style={styles.turnOffButton}
          onPress={turnOffAll}
        >
          <Text style={styles.turnOffButtonText}>Desactivar todas las notificaciones</Text>
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
  generalSettings: {
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
  categorySection: {
    padding: 20,
    backgroundColor: palette.background.paper,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: palette.text.primary,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  turnOffButton: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  turnOffButtonText: {
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

export default NotificationsScreen;
