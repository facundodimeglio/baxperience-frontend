import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreen } from '../../screens/main/HomeScreen';
import { TripHistoryScreen } from '../../screens/main/TripHistoryScreen';
import { ProfileScreen } from '../../screens/main/ProfileScreen';
import { palette } from '../../theme/colors/palette';

const Tab = createBottomTabNavigator();

interface TabIconProps {
  focused: boolean;
  icon: string;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, icon, label }) => {
  return (
    <View style={styles.tabIcon}>
      <Text style={[
        styles.tabIconText,
        focused && styles.tabIconTextFocused
      ]}>
        {icon}
      </Text>
      <Text style={[
        styles.tabLabel,
        focused && styles.tabLabelFocused
      ]}>
        {label}
      </Text>
    </View>
  );
};

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: palette.primary.main,
        tabBarInactiveTintColor: palette.text.disabled,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🏠" label="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="TripHistory"
        component={TripHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📋" label="Trips" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="👤" label="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: palette.background.default,
    borderTopWidth: 1,
    borderTopColor: palette.secondary.dark,
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabIconTextFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 12,
    color: palette.text.disabled,
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: palette.primary.main,
    fontWeight: '600',
  },
});
