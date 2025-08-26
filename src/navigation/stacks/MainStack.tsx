import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from '../tabs/MainTabs';
import { CreateTripScreen } from '../../screens/main/CreateTripScreen';
import { ItineraryGenerationScreen } from '../../screens/main/ItineraryGenerationScreen';
import { GeneratedItineraryScreen } from '../../screens/main/GeneratedItineraryScreen';
import { POIDetailScreen } from '../../screens/main/POIDetailScreen';
import NearbyExperiencesScreen from '../../screens/main/NearbyExperiencesScreen';
import SelectedExperiencesScreen from '../../screens/main/SelectedExperiencesScreen';

// Importación de pantallas de configuración
import { EditProfileScreen } from '../../screens/settings/EditProfileScreen';
import { ChangePhotoScreen } from '../../screens/settings/ChangePhotoScreen';
import { ChangePasswordScreen } from '../../screens/settings/ChangePasswordScreen';
import { TravelPreferencesScreen } from '../../screens/settings/TravelPreferencesScreen';
import { NotificationsScreen } from '../../screens/settings/NotificationsScreen';
import { PrivacySettingsScreen } from '../../screens/settings/PrivacySettingsScreen';
import { HelpSupportScreen } from '../../screens/settings/HelpSupportScreen';
import { AboutScreen } from '../../screens/settings/AboutScreen';

const Stack = createNativeStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CreateTrip" component={CreateTripScreen} />
      <Stack.Screen 
        name="ItineraryGeneration" 
        component={ItineraryGenerationScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false, // Prevent going back during generation
        }}
      />
      <Stack.Screen 
        name="GeneratedItinerary" 
        component={GeneratedItineraryScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="POIDetail" 
        component={POIDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="NearbyExperiences" 
        component={NearbyExperiencesScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="SelectedExperiences" 
        component={SelectedExperiencesScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />

      {/* Pantallas de configuración */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="ChangePhoto" 
        component={ChangePhotoScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="TravelPreferences" 
        component={TravelPreferencesScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="PrivacySettings" 
        component={PrivacySettingsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="HelpSupport" 
        component={HelpSupportScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};
