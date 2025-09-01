import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
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
import { authService } from '../../services/api/authService';
import { ApiException } from '../../services/api/client';
import { validateEmail } from '../../utils/validators/emailValidator';
import { useAuth } from '../../contexts/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();

  const handleLogin = async () => {
    // Validate input
    const emailValidation = validateEmail(email);
    const newErrors = {
      email: emailValidation.isValid ? '' : emailValidation.message || 'Please enter a valid email',
      password: password.trim() ? '' : 'Password is required',
    };

    setErrors(newErrors);

    // Check if validation passed
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Attempting login...');
      
      const response = await authService.login({
        email: String(email.trim().toLowerCase()),
        password: String(password),
      });

      console.log('✅ Login successful:', response.user);
      
      // Update authentication state
      login();
      
      Alert.alert(
        'Welcome Back!',
        `Hello ${response.user.nombre}! You have successfully logged in.`,
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigation will be handled automatically by auth state change
            },
          },
        ]
      );
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof ApiException) {
        switch (error.statusCode) {
          case 401:
            errorMessage = 'Invalid email or password. Please check your credentials.';
            break;
          case 400:
            errorMessage = 'Please enter valid email and password.';
            break;
          case 0:
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/baxperience-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <CustomInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearError('email');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError('password');
            }}
            secureTextEntry
            autoComplete="password"
            error={errors.password}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 80,
  },
  formContainer: {
    paddingHorizontal: 24,
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
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: palette.primary.main,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: palette.text.secondary,
    fontSize: 14,
  },
  registerLink: {
    color: palette.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
});