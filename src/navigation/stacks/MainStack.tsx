import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from '../tabs/MainTabs';
import { CreateTripScreen } from '../../screens/main/CreateTripScreen';
import { ItineraryGenerationScreen } from '../../screens/main/ItineraryGenerationScreen';
import { GeneratedItineraryScreen } from '../../screens/main/GeneratedItineraryScreen';
import { POIDetailScreen } from '../../screens/main/POIDetailScreen';

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
    </Stack.Navigator>
  );
};
