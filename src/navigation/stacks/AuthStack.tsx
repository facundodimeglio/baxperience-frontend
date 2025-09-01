import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../../screens/auth/SplashScreen';
import { LoginScreen } from '../../screens/auth/LoginScreen';
import { RegisterScreen } from '../../screens/auth/RegisterScreen';
import { RegisterVerificationScreen } from '../../screens/auth/RegisterVerificationScreen';
import { CompleteProfileScreen } from '../../screens/auth/CompleteProfileScreen';
import { TravelPreferencesScreen } from '../../screens/auth/TravelPreferencesScreen';
import { ForgotPasswordScreen } from '../../screens/auth/ForgotPasswordScreen';
import { CodeVerificationScreen } from '../../screens/auth/CodeVerificationScreen';
import { ResetPasswordScreen } from '../../screens/auth/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="RegisterVerification" component={RegisterVerificationScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      <Stack.Screen name="TravelPreferences" component={TravelPreferencesScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="CodeVerification" component={CodeVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};