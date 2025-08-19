import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { palette } from '../../theme/colors/palette';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '../../utils/validators/emailValidator';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate all fields
    const nameValid = validateName(formData.fullName);
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);
    const confirmPasswordValid = validatePasswordConfirmation(formData.password, formData.confirmPassword);

    const newErrors = {
      fullName: nameValid.isValid ? '' : nameValid.message || '',
      email: emailValid.isValid ? '' : emailValid.message || '',
      password: passwordValid.isValid ? '' : passwordValid.message || '',
      confirmPassword: confirmPasswordValid.isValid ? '' : confirmPasswordValid.message || '',
    };

    setErrors(newErrors);

    // Check if all validations passed
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call to send verification code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to email verification screen with registration data
      navigation.navigate('RegisterVerification', { 
        email: formData.email,
        registrationData: formData
      });
      
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateName = (name: string): { isValid: boolean; message?: string } => {
    if (!name.trim()) {
      return { isValid: false, message: 'Full name is required' };
    }
    if (name.trim().length < 2) {
      return { isValid: false, message: 'Full name must be at least 2 characters' };
    }
    return { isValid: true };
  };

  const updateFormData = (key: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Clear error when user starts typing
    if (errors[key as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'Weak', color: palette.error.main };
      case 2:
      case 3:
        return { text: 'Medium', color: '#FF9800' };
      case 4:
      case 5:
        return { text: 'Strong', color: palette.success.main };
      default:
        return { text: '', color: palette.text.disabled };
    }
  };

  const strengthInfo = getStrengthText(getPasswordStrength(formData.password));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started with Baxperience</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={updateFormData('fullName')}
            autoComplete="name"
            error={errors.fullName}
          />

          <CustomInput
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={updateFormData('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />

          <CustomInput
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={updateFormData('password')}
            secureTextEntry
            autoComplete="password-new"
            error={errors.password}
          />
          
          {formData.password.length > 0 && (
            <View style={styles.strengthContainer}>
              <Text style={styles.strengthLabel}>Password strength: </Text>
              <Text style={[styles.strengthText, { color: strengthInfo.color }]}>
                {strengthInfo.text}
              </Text>
            </View>
          )}

          <CustomInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={updateFormData('confirmPassword')}
            secureTextEntry
            autoComplete="password-new"
            error={errors.confirmPassword}
          />

          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
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
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    color: palette.primary.main,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: palette.primary.main,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: palette.text.secondary,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  strengthContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 12,
    color: palette.text.secondary,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: palette.text.secondary,
    fontSize: 14,
  },
  loginLink: {
    color: palette.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 24,
    paddingHorizontal: 12,
  },
  termsText: {
    fontSize: 12,
    color: palette.text.disabled,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: palette.primary.main,
    fontWeight: '500',
  },
});