import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { palette } from '../../theme/colors/palette';
import { CustomButton } from '../../components/common/CustomButton';

interface ChangePhotoScreenProps {
  navigation: any;
}

export const ChangePhotoScreen: React.FC<ChangePhotoScreenProps> = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const photoOptions = [
    { id: 'avatar1', emoji: '👨‍💼', label: 'Profesional' },
    { id: 'avatar2', emoji: '👩‍💼', label: 'Ejecutiva' },
    { id: 'avatar3', emoji: '🧔', label: 'Explorador' },
    { id: 'avatar4', emoji: '👱‍♀️', label: 'Viajera' },
    { id: 'avatar5', emoji: '🧑‍🦱', label: 'Casual' },
    { id: 'avatar6', emoji: '👩‍🦰', label: 'Aventurera' },
    { id: 'avatar7', emoji: '🧑‍🎓', label: 'Estudiante' },
    { id: 'avatar8', emoji: '👩‍🎓', label: 'Graduada' },
    { id: 'avatar9', emoji: '🧙‍♂️', label: 'Místico' },
    { id: 'avatar10', emoji: '👩‍🚀', label: 'Astronauta' },
    { id: 'avatar11', emoji: '👨‍🎨', label: 'Artista' },
    { id: 'avatar12', emoji: '👩‍🍳', label: 'Chef' },
  ];

  const handleSelectAvatar = (id: string) => {
    setSelectedOption(id);
  };

  const handleTakePhoto = () => {
    Alert.alert(
      'Funcionalidad no disponible',
      'La captura de fotos estará disponible próximamente.',
      [{ text: 'OK' }]
    );
  };

  const handleChooseFromGallery = () => {
    Alert.alert(
      'Funcionalidad no disponible',
      'La selección de fotos de la galería estará disponible próximamente.',
      [{ text: 'OK' }]
    );
  };

  const handleSave = () => {
    if (selectedOption) {
      Alert.alert(
        'Foto actualizada',
        'Tu foto de perfil ha sido actualizada correctamente.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert(
        'Selecciona una opción',
        'Por favor, selecciona un avatar o sube una foto para continuar.',
        [{ text: 'OK' }]
      );
    }
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
        <Text style={styles.headerTitle}>Cambiar foto</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.currentPhotoSection}>
          <View style={styles.currentPhotoContainer}>
            <Text style={styles.currentPhotoText}>JD</Text>
          </View>
          <Text style={styles.currentPhotoLabel}>Foto actual</Text>
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Opciones de foto</Text>
          
          <View style={styles.photoOptions}>
            <TouchableOpacity 
              style={styles.photoOption}
              onPress={handleTakePhoto}
            >
              <View style={styles.photoOptionIcon}>
                <Text style={styles.photoOptionIconText}>📷</Text>
              </View>
              <Text style={styles.photoOptionText}>Tomar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.photoOption}
              onPress={handleChooseFromGallery}
            >
              <View style={styles.photoOptionIcon}>
                <Text style={styles.photoOptionIconText}>🖼️</Text>
              </View>
              <Text style={styles.photoOptionText}>Elegir de galería</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.avatarsSection}>
          <Text style={styles.sectionTitle}>Avatares predefinidos</Text>
          <View style={styles.avatarsGrid}>
            {photoOptions.map((option) => (
              <TouchableOpacity 
                key={option.id}
                style={[
                  styles.avatarOption,
                  selectedOption === option.id && styles.selectedAvatarOption
                ]}
                onPress={() => handleSelectAvatar(option.id)}
              >
                <Text style={styles.avatarEmoji}>{option.emoji}</Text>
                <Text style={styles.avatarLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  currentPhotoSection: {
    alignItems: 'center',
    paddingVertical: 25,
  },
  currentPhotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: palette.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPhotoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: palette.secondary.main,
  },
  currentPhotoLabel: {
    fontSize: 14,
    color: palette.text.secondary,
  },
  optionsSection: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 16,
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoOption: {
    width: '48%',
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  photoOptionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoOptionIconText: {
    fontSize: 30,
  },
  photoOptionText: {
    fontSize: 14,
    color: palette.text.primary,
    fontWeight: '500',
  },
  avatarsSection: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: '30%',
    backgroundColor: palette.background.paper,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarOption: {
    borderColor: palette.primary.main,
    backgroundColor: palette.primary.light + '20',
  },
  avatarEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  avatarLabel: {
    fontSize: 12,
    color: palette.text.primary,
    textAlign: 'center',
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

export default ChangePhotoScreen;


