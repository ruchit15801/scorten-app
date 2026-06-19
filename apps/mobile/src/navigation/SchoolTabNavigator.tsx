import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

// Screens
import { SchoolDashboardScreen } from '../screens/school/SchoolDashboardScreen';
import { CreateJobScreen } from '../screens/school/CreateJobScreen';
import { CandidateProfileScreen } from '../screens/school/CandidateProfileScreen';
import { SchoolProfileScreen } from '../screens/school/SchoolProfileScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function JobsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateJob" component={CreateJobScreen} />
    </Stack.Navigator>
  );
}

function CandidatesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CandidateProfile" component={CandidateProfileScreen} />
    </Stack.Navigator>
  );
}

export function SchoolTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon = '📊';
          if (route.name === 'Dashboard') icon = '📊';
          else if (route.name === 'Jobs') icon = '📝';
          else if (route.name === 'Candidates') icon = '👥';
          else if (route.name === 'Settings') icon = '⚙️';
          return <Text style={{ fontSize: size - 4, color }}>{icon}</Text>;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.tabBarBg,
          borderTopColor: COLORS.tabBarBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Dashboard" component={SchoolDashboardScreen} />
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="Candidates" component={CandidatesStack} />
      <Tab.Screen name="Settings" component={SchoolProfileScreen} />
    </Tab.Navigator>
  );
}
