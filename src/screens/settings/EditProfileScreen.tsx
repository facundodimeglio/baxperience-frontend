import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { palette } from '../../theme/colors/palette';
import { CustomButton } from '../../components/common/CustomButton';

interface EditProfileScreenProps {
  navigation: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com', // No editable
    location: 'Buenos Aires, Argentina',
    phoneNumber: '+54 11 1234 5678',
    birthDate: '1985-05-15',
  });

  const handleInputChange = (field: string, value: string) => {
    setUserProfile({
      ...userProfile,
      [field]: value,
    });
  };

  const handleSave = () => {
    // Aquí se implementaría la lógica para guardar los cambios en el perfil
    // Por ejemplo, una llamada a API
    Alert.alert(
      'Perfil actualizado',
      'Los cambios en tu perfil han sido guardados correctamente.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handlePhotoChange = () => {
    navigation.navigate('ChangePhoto');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.photoSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handlePhotoChange}
            >
              <Text style={styles.changePhotoText}>Cambiar foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={userProfile.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="Tu nombre"
                placeholderTextColor={palette.text.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput
                style={styles.input}
                value={userProfile.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Tu apellido"
                placeholderTextColor={palette.text.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userProfile.email}
                editable={false}
                placeholder="Tu correo electrónico"
                placeholderTextColor={palette.text.disabled}
              />
              <Text style={styles.helperText}>El email no se puede editar</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ubicación</Text>
              <TextInput
                style={styles.input}
                value={userProfile.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="Tu ubicación"
                placeholderTextColor={palette.text.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={userProfile.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                placeholder="Tu número de teléfono"
                placeholderTextColor={palette.text.disabled}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha de nacimiento</Text>
              <TextInput
                style={styles.input}
                value={userProfile.birthDate}
                onChangeText={(value) => handleInputChange('birthDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={palette.text.disabled}
              />
            </View>

            <View style={styles.additionalOptions}>
              <TouchableOpacity 
                style={styles.passwordOption}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                <Text style={styles.passwordOptionText}>Cambiar contraseña</Text>
              </TouchableOpacity>
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
    </KeyboardAvoidingView>
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
  photoSection: {
    alignItems: 'center',
    paddingVertical: 25,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: palette.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: palette.secondary.main,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    color: palette.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  formSection: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: palette.text.secondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.text.primary,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: palette.text.disabled,
  },
  helperText: {
    fontSize: 12,
    color: palette.text.disabled,
    marginTop: 4,
    marginLeft: 2,
  },
  additionalOptions: {
    marginTop: 15,
    marginBottom: 25,
  },
  passwordOption: {
    paddingVertical: 12,
  },
  passwordOptionText: {
    color: palette.primary.main,
    fontSize: 16,
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

export default EditProfileScreen;







