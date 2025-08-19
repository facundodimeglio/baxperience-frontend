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
import { validatePassword, validatePasswordConfirmation } from '../../utils/validators/emailValidator';

interface ResetPasswordScreenProps {
  navigation: any;
  route: any;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { email, code } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message || '');
      return;
    }
    
    // Validate password confirmation
    const confirmPasswordValidation = validatePasswordConfirmation(password, confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      setConfirmPasswordError(confirmPasswordValidation.message || '');
      return;
    }
    
    setPasswordError('');
    setConfirmPasswordError('');
    setLoading(true);
    
    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Your password has been reset successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (confirmPasswordError) {
      setConfirmPasswordError('');
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

  const strengthInfo = getStrengthText(getPasswordStrength(password));

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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Create a new secure password for your account
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            error={passwordError}
          />
          
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <Text style={styles.strengthLabel}>Password strength: </Text>
              <Text style={[styles.strengthText, { color: strengthInfo.color }]}>
                {strengthInfo.text}
              </Text>
            </View>
          )}

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <Text style={[
              styles.requirement, 
              password.length >= 8 ? styles.requirementMet : styles.requirementUnmet
            ]}>
              • At least 8 characters
            </Text>
            <Text style={[
              styles.requirement, 
              /[a-z]/.test(password) ? styles.requirementMet : styles.requirementUnmet
            ]}>
              • One lowercase letter
            </Text>
            <Text style={[
              styles.requirement, 
              /[A-Z]/.test(password) ? styles.requirementMet : styles.requirementUnmet
            ]}>
              • One uppercase letter
            </Text>
            <Text style={[
              styles.requirement, 
              /[0-9]/.test(password) ? styles.requirementMet : styles.requirementUnmet
            ]}>
              • One number
            </Text>
          </View>

          <CustomInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry={!showConfirmPassword}
            error={confirmPasswordError}
          />

          <CustomButton
            title="Reset Password"
            onPress={handleResetPassword}
            loading={loading}
            style={styles.resetButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
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
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: palette.primary.main,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: palette.text.secondary,
    lineHeight: 24,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  strengthContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16,
  },
  strengthLabel: {
    fontSize: 14,
    color: palette.text.secondary,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  passwordRequirements: {
    backgroundColor: palette.background.paper,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text.primary,
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    marginBottom: 4,
  },
  requirementMet: {
    color: palette.success.main,
  },
  requirementUnmet: {
    color: palette.text.disabled,
  },
  resetButton: {
    marginTop: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
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
});
