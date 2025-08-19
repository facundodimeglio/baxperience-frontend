import React, { useState, useEffect } from 'react';
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
import { CodeInput } from '../../components/common/CodeInput';
import { CustomButton } from '../../components/common/CustomButton';
import { palette } from '../../theme/colors/palette';
import { validateCode } from '../../utils/validators/emailValidator';

interface CodeVerificationScreenProps {
  navigation: any;
  route: any;
}

export const CodeVerificationScreen: React.FC<CodeVerificationScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeComplete = async (completedCode: string) => {
    setCode(completedCode);
    
    // Auto-verify when code is complete
    setTimeout(() => {
      handleVerifyCode(completedCode);
    }, 500);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (codeError) {
      setCodeError('');
    }
  };

  const handleVerifyCode = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || code;
    
    // Validate code
    const codeValidation = validateCode(finalCode);
    if (!codeValidation.isValid) {
      setCodeError(codeValidation.message || '');
      return;
    }
    
    setCodeError('');
    setLoading(true);
    
    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to reset password screen
      navigation.navigate('ResetPassword', { email, code: finalCode });
      
    } catch (error) {
      setCodeError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    
    try {
      // Simulate API call to resend code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCountdown(60);
      setCanResend(false);
      setCode(''); // Clear current code
      setCodeError(''); // Clear any errors
      Alert.alert('Success', 'Verification code has been resent to your email.');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
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
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to{'\n'}
            <Text style={styles.emailText}>{maskEmail(email)}</Text>
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.codeLabel}>Enter Verification Code</Text>
          
          <CodeInput
            length={6}
            onComplete={handleCodeComplete}
            onCodeChange={handleCodeChange}
            error={codeError}
            autoFocus={true}
          />

          {code.length === 6 && (
            <CustomButton
              title="Verify Code"
              onPress={() => handleVerifyCode()}
              loading={loading}
              style={styles.verifyButton}
            />
          )}

          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity onPress={handleResendCode} disabled={resendLoading}>
                <Text style={styles.resendText}>
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.countdownText}>
                Resend code in {countdown}s
              </Text>
            )}
          </View>

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Didn't receive the code? Check your spam folder or try resending.
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
    paddingBottom: 40,
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
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: palette.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  emailText: {
    fontWeight: '600',
    color: palette.primary.main,
  },
  formContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: 32,
    width: '80%',
  },
  resendContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  resendText: {
    color: palette.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  countdownText: {
    color: palette.text.secondary,
    fontSize: 14,
  },
  helpContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  helpText: {
    fontSize: 12,
    color: palette.text.disabled,
    textAlign: 'center',
    lineHeight: 18,
  },
});