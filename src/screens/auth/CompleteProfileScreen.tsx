import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from 'react-native';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { CustomDatePicker } from '../../components/common/CustomDatePicker';
import { palette } from '../../theme/colors/palette';

interface CompleteProfileScreenProps {
  navigation: any;
  route: any;
}

export const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { email, registrationData } = route.params;
  
  const [profileData, setProfileData] = useState({
    username: '',
    nombre: registrationData?.fullName?.split(' ')[0] || '',
    apellido: registrationData?.fullName?.split(' ').slice(1).join(' ') || '',
    fecha_nacimiento: null as Date | null,
    genero: '',
    telefono: '',
    pais_origen: '',
    ciudad_origen: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    genero: '',
    telefono: '',
    pais_origen: '',
    ciudad_origen: '',
  });

  const [loading, setLoading] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Prefer not to say', value: 'prefer-not-to-say' },
  ];

  const countryOptions = [
    { label: 'Argentina', value: 'argentina' },
    { label: 'Brazil', value: 'brazil' },
    { label: 'Chile', value: 'chile' },
    { label: 'Colombia', value: 'colombia' },
    { label: 'Mexico', value: 'mexico' },
    { label: 'Peru', value: 'peru' },
    { label: 'Uruguay', value: 'uruguay' },
    { label: 'United States', value: 'united-states' },
    { label: 'Canada', value: 'canada' },
    { label: 'Spain', value: 'spain' },
    { label: 'Other', value: 'other' },
  ];

  const validateForm = () => {
    const newErrors = {
      username: !profileData.username ? 'Username is required' : '',
      nombre: !profileData.nombre ? 'First name is required' : '',
      apellido: !profileData.apellido ? 'Last name is required' : '',
      fecha_nacimiento: !profileData.fecha_nacimiento ? 'Date of birth is required' : '',
      genero: !profileData.genero ? 'Gender is required' : '',
      telefono: !profileData.telefono ? 'Phone number is required' : 
                 !/^\+?[\d\s-()]+$/.test(profileData.telefono) ? 'Invalid phone number format' : '',
      pais_origen: !profileData.pais_origen ? 'Country is required' : '',
      ciudad_origen: !profileData.ciudad_origen ? 'City is required' : '',
    };

    // Additional username validation
    if (profileData.username) {
      if (profileData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(profileData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      }
    }

    // Age validation
    if (profileData.fecha_nacimiento) {
      const age = new Date().getFullYear() - profileData.fecha_nacimiento.getFullYear();
      if (age < 13) {
        newErrors.fecha_nacimiento = 'You must be at least 13 years old';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleCompleteProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call to complete registration with profile data
      const completeRegistrationData = {
        ...registrationData,
        ...profileData,
        email,
        fecha_nacimiento: profileData.fecha_nacimiento?.toISOString().split('T')[0],
      };
      
      console.log('Complete Registration Data:', completeRegistrationData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to travel preferences screen
      navigation.navigate('TravelPreferences', { 
        email, 
        registrationData,
        profileData: {
          ...profileData,
          fecha_nacimiento: profileData.fecha_nacimiento?.toISOString().split('T')[0],
        }
      });
      
    } catch (error) {
      Alert.alert('Error', 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = (key: string) => (value: string | Date) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
    
    // Clear error when user starts typing
    if (errors[key as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.progressText}>Step 2 of 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Help us personalize your Baxperience by sharing a bit more about yourself
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔖 Account Details</Text>
            
            <CustomInput
              label="Username"
              placeholder="Choose a unique username"
              value={profileData.username}
              onChangeText={updateProfileData('username')}
              autoCapitalize="none"
              error={errors.username}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Personal Information</Text>
            
            <View style={styles.row}>
              <CustomInput
                label="First Name"
                placeholder="Your first name"
                value={profileData.nombre}
                onChangeText={updateProfileData('nombre')}
                containerStyle={styles.halfWidth}
                error={errors.nombre}
              />
              
              <CustomInput
                label="Last Name"
                placeholder="Your last name"
                value={profileData.apellido}
                onChangeText={updateProfileData('apellido')}
                containerStyle={styles.halfWidth}
                error={errors.apellido}
              />
            </View>

            <CustomDatePicker
              label="Date of Birth"
              placeholder="Select your date of birth"
              selectedDate={profileData.fecha_nacimiento}
              onDateSelect={updateProfileData('fecha_nacimiento')}
              error={errors.fecha_nacimiento}
              mode="birthdate"
            />
            
            {profileData.fecha_nacimiento && (
              <Text style={styles.ageText}>
                Age: {calculateAge(profileData.fecha_nacimiento)} years old
              </Text>
            )}

            <CustomDropdown
              label="Gender"
              placeholder="Select your gender"
              options={genderOptions}
              selectedValue={profileData.genero}
              onSelect={updateProfileData('genero')}
              error={errors.genero}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Location & Contact</Text>
            
            <CustomInput
              label="Phone Number"
              placeholder="+1 234 567 8900"
              value={profileData.telefono}
              onChangeText={updateProfileData('telefono')}
              keyboardType="phone-pad"
              error={errors.telefono}
            />

            <CustomDropdown
              label="Country of Origin"
              placeholder="Select your country"
              options={countryOptions}
              selectedValue={profileData.pais_origen}
              onSelect={updateProfileData('pais_origen')}
              error={errors.pais_origen}
            />

            <CustomInput
              label="City of Origin"
              placeholder="Enter your city"
              value={profileData.ciudad_origen}
              onChangeText={updateProfileData('ciudad_origen')}
              error={errors.ciudad_origen}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🔒 Privacy & Personalization</Text>
            <Text style={styles.infoText}>
              This information helps us create personalized recommendations and connect you with relevant experiences. Your data is secure and will never be shared without your consent.
            </Text>
          </View>

          <CustomButton
            title="Continue to Preferences"
            onPress={handleCompleteProfile}
            loading={loading}
            style={styles.completeButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  progressText: {
    fontSize: 12,
    color: palette.text.disabled,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: palette.secondary.dark,
    borderRadius: 2,
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: palette.primary.main,
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: palette.primary.main,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: palette.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  ageText: {
    fontSize: 12,
    color: palette.text.secondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: palette.background.paper,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary.main,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: palette.text.secondary,
    lineHeight: 18,
  },
  completeButton: {
    marginTop: 16,
  },
});
