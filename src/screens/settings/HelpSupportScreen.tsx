import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { palette } from '../../theme/colors/palette';
import { CustomButton } from '../../components/common/CustomButton';

interface HelpSupportScreenProps {
  navigation: any;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ navigation }) => {
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [activeTab, setActiveTab] = useState('faq');

  // FAQs de ejemplo
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: '¿Cómo crear un itinerario personalizado?',
      answer: 'Para crear un itinerario personalizado, ve a la pantalla principal y toca "Crear nuevo viaje". Selecciona tu destino, fechas de viaje y preferencias. Nuestra IA generará un itinerario adaptado a tus gustos.',
      expanded: false,
    },
    {
      id: '2',
      question: '¿Puedo modificar un itinerario generado?',
      answer: 'Sí, puedes modificar cualquier itinerario generado. Simplemente abre el itinerario y selecciona "Editar". Podrás añadir, eliminar o reordenar actividades según tus preferencias.',
      expanded: false,
    },
    {
      id: '3',
      question: '¿Cómo guardar lugares para visitar después?',
      answer: 'Para guardar lugares que quieras visitar más tarde, simplemente toca el icono de corazón junto a cualquier atracción o experiencia. Puedes acceder a tus lugares guardados en la sección "Favoritos" de tu perfil.',
      expanded: false,
    },
    {
      id: '4',
      question: '¿Cómo cambiar mis preferencias de viaje?',
      answer: 'Para cambiar tus preferencias de viaje, ve a tu perfil y selecciona "Preferencias de viaje". Allí podrás actualizar tus intereses, presupuesto y estilo de viaje para recibir recomendaciones más precisas.',
      expanded: false,
    },
    {
      id: '5',
      question: '¿La aplicación funciona sin conexión a Internet?',
      answer: 'Algunas funciones básicas están disponibles sin conexión, como ver itinerarios guardados previamente. Sin embargo, para crear nuevos itinerarios, buscar lugares o recibir recomendaciones personalizadas, necesitas conexión a Internet.',
      expanded: false,
    },
    {
      id: '6',
      question: '¿Cómo eliminar mi cuenta?',
      answer: 'Para eliminar tu cuenta, ve a Configuración > Privacidad > Gestión de datos. Al final de la pantalla encontrarás la opción "Eliminar mi cuenta". Ten en cuenta que esta acción es irreversible y perderás todos tus datos.',
      expanded: false,
    },
  ]);

  const toggleFAQ = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ));
  };

  const handleSendMessage = () => {
    if (!messageSubject.trim() || !messageBody.trim()) {
      Alert.alert(
        'Campos incompletos',
        'Por favor completa tanto el asunto como el mensaje.'
      );
      return;
    }

    // Aquí iría la lógica para enviar el mensaje (API, etc.)
    Alert.alert(
      'Mensaje enviado',
      'Gracias por contactarnos. Te responderemos a la brevedad.',
      [{ text: 'OK', onPress: () => {
        setMessageSubject('');
        setMessageBody('');
      }}]
    );
  };

  const handleCall = () => {
    const phoneNumber = '+541123456789';
    
    Linking.openURL(`tel:${phoneNumber}`).catch(err => {
      Alert.alert('Error', 'No se pudo realizar la llamada.');
      console.error('Error al intentar llamar:', err);
    });
  };

  const handleEmail = () => {
    const email = 'soporte@baxperience.com';
    
    Linking.openURL(`mailto:${email}?subject=Soporte%20BAXperience`).catch(err => {
      Alert.alert('Error', 'No se pudo abrir el cliente de correo.');
      console.error('Error al intentar enviar email:', err);
    });
  };

  const handleChat = () => {
    Alert.alert(
      'Chat en vivo',
      'El chat en vivo estará disponible próximamente. Por favor, utiliza otras opciones de contacto por el momento.'
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
        <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'faq' && styles.activeTab]}
          onPress={() => setActiveTab('faq')}
        >
          <Text style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>
            FAQs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
          onPress={() => setActiveTab('contact')}
        >
          <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>
            Contacto
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'faq' ? (
          <View style={styles.faqContainer}>
            <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
            {faqs.map(faq => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Text style={styles.faqExpandIcon}>
                    {faq.expanded ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                {faq.expanded && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}

            <View style={styles.supportSection}>
              <Text style={styles.sectionTitle}>¿No encontraste lo que buscabas?</Text>
              <Text style={styles.supportText}>
                Contáctanos a través de nuestros canales de atención y te ayudaremos con tus dudas.
              </Text>
              <TouchableOpacity 
                style={styles.contactUsButton}
                onPress={() => setActiveTab('contact')}
              >
                <Text style={styles.contactUsButtonText}>Contáctanos</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.contactContainer}>
            <Text style={styles.sectionTitle}>Opciones de contacto</Text>
            
            <View style={styles.contactOptions}>
              <TouchableOpacity 
                style={styles.contactOption}
                onPress={handleCall}
              >
                <View style={styles.contactOptionIcon}>
                  <Text style={styles.contactOptionIconText}>📞</Text>
                </View>
                <Text style={styles.contactOptionText}>Llamar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactOption}
                onPress={handleEmail}
              >
                <View style={styles.contactOptionIcon}>
                  <Text style={styles.contactOptionIconText}>✉️</Text>
                </View>
                <Text style={styles.contactOptionText}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactOption}
                onPress={handleChat}
              >
                <View style={styles.contactOptionIcon}>
                  <Text style={styles.contactOptionIconText}>💬</Text>
                </View>
                <Text style={styles.contactOptionText}>Chat</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.contactFormTitle}>Formulario de contacto</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Asunto</Text>
              <TextInput
                style={styles.formInput}
                value={messageSubject}
                onChangeText={setMessageSubject}
                placeholder="Escribe el asunto de tu consulta"
                placeholderTextColor={palette.text.disabled}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Mensaje</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={messageBody}
                onChangeText={setMessageBody}
                placeholder="Describe detalladamente tu consulta o problema"
                placeholderTextColor={palette.text.disabled}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <CustomButton
              title="Enviar mensaje"
              onPress={handleSendMessage}
              style={styles.sendButton}
            />

            <View style={styles.additionalInfo}>
              <Text style={styles.additionalInfoTitle}>Información adicional</Text>
              <Text style={styles.additionalInfoText}>
                • Horario de atención: Lunes a viernes de 9:00 a 18:00{'\n'}
                • Tiempo de respuesta: 24-48 horas hábiles{'\n'}
                • Email: soporte@baxperience.com{'\n'}
                • Teléfono: +54 11 2345-6789
              </Text>
            </View>
          </View>
        )}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: palette.primary.main,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: palette.secondary.main,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: palette.primary.main,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  faqContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: palette.text.primary,
    flex: 1,
    paddingRight: 16,
  },
  faqExpandIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.primary.main,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.text.secondary,
  },
  supportSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  supportText: {
    fontSize: 14,
    color: palette.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactUsButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: palette.primary.main,
    borderRadius: 8,
  },
  contactUsButtonText: {
    color: palette.secondary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  contactContainer: {
    padding: 20,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  contactOption: {
    alignItems: 'center',
    width: '30%',
  },
  contactOptionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactOptionIconText: {
    fontSize: 24,
  },
  contactOptionText: {
    fontSize: 14,
    color: palette.text.primary,
    fontWeight: '500',
  },
  contactFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    color: palette.text.secondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  formInput: {
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.text.primary,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: palette.primary.main,
    marginBottom: 24,
  },
  additionalInfo: {
    backgroundColor: palette.background.paper,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  additionalInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 8,
  },
  additionalInfoText: {
    fontSize: 14,
    color: palette.text.secondary,
    lineHeight: 22,
  },
});

export default HelpSupportScreen;


