import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { palette } from '../../theme/colors/palette';

interface AboutScreenProps {
  navigation: any;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const appVersion = '1.0.0';
  
  const teamMembers = [
    { name: 'María González', role: 'Fundadora y CEO' },
    { name: 'Carlos Rodríguez', role: 'CTO' },
    { name: 'Lucía Fernández', role: 'Directora de Producto' },
    { name: 'Martín López', role: 'Líder de UX/UI' },
    { name: 'Ana Martínez', role: 'Directora de Marketing' },
  ];

  const handleOpenWebsite = () => {
    Linking.openURL('https://www.baxperience.com').catch(err => {
      Alert.alert('Error', 'No se pudo abrir el sitio web');
    });
  };

  const handleOpenPrivacyPolicy = () => {
    Linking.openURL('https://www.baxperience.com/privacy').catch(err => {
      Alert.alert('Error', 'No se pudo abrir la política de privacidad');
    });
  };

  const handleOpenTermsConditions = () => {
    Linking.openURL('https://www.baxperience.com/terms').catch(err => {
      Alert.alert('Error', 'No se pudo abrir los términos y condiciones');
    });
  };

  const handleOpenSocialMedia = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'instagram':
        url = 'https://www.instagram.com/baxperience';
        break;
      case 'twitter':
        url = 'https://www.twitter.com/baxperience';
        break;
      case 'facebook':
        url = 'https://www.facebook.com/baxperience';
        break;
      default:
        url = 'https://www.baxperience.com';
    }
    
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', `No se pudo abrir ${platform}`);
    });
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
        <Text style={styles.headerTitle}>Acerca de</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>BAX</Text>
          </View>
          <Text style={styles.appName}>BAXperience</Text>
          <Text style={styles.appTagline}>Tu asistente de viaje con IA</Text>
          <Text style={styles.versionText}>Versión {appVersion}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestra misión</Text>
          <Text style={styles.paragraph}>
            BAXperience tiene como misión transformar la manera en que las personas planifican
            y disfrutan sus viajes. Utilizamos inteligencia artificial avanzada para ofrecer
            recomendaciones personalizadas, itinerarios a medida y experiencias únicas que se
            adaptan perfectamente a los gustos y preferencias de cada viajero.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestro equipo</Text>
          <View style={styles.teamList}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tecnologías</Text>
          <Text style={styles.paragraph}>
            Nuestra plataforma está desarrollada con las tecnologías más modernas,
            incluyendo React Native para una experiencia móvil fluida, algoritmos
            de inteligencia artificial para recomendaciones personalizadas, y una
            arquitectura escalable basada en la nube para ofrecer un servicio rápido
            y confiable a nivel global.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Redes sociales</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleOpenSocialMedia('instagram')}
            >
              <Text style={styles.socialIcon}>📸</Text>
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleOpenSocialMedia('twitter')}
            >
              <Text style={styles.socialIcon}>🐦</Text>
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleOpenSocialMedia('facebook')}
            >
              <Text style={styles.socialIcon}>👍</Text>
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.linksSection}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleOpenWebsite}
          >
            <Text style={styles.linkText}>Visitar sitio web</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleOpenPrivacyPolicy}
          >
            <Text style={styles.linkText}>Política de privacidad</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleOpenTermsConditions}
          >
            <Text style={styles.linkText}>Términos y condiciones</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            © 2024 BAXperience. Todos los derechos reservados.
          </Text>
        </View>
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
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: palette.secondary.main,
    fontSize: 32,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: palette.text.secondary,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    color: palette.text.disabled,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.text.secondary,
  },
  teamList: {
    marginTop: 10,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: palette.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: palette.primary.main,
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: palette.text.primary,
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  socialButton: {
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  socialText: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  linksSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  linkButton: {
    paddingVertical: 12,
    width: '80%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  linkText: {
    fontSize: 16,
    color: palette.primary.main,
    fontWeight: '500',
  },
  copyrightSection: {
    padding: 20,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: palette.text.disabled,
  },
});

export default AboutScreen;
