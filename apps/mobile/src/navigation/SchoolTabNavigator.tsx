import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Icon } from '../components/Icon';

// Screens
import { SchoolDashboardScreen } from '../screens/school/SchoolDashboardScreen';
import { SchoolJobsScreen } from '../screens/school/SchoolJobsScreen';
import { CreateJobScreen } from '../screens/school/CreateJobScreen';
import { JobApplicationsScreen } from '../screens/school/JobApplicationsScreen';
import { HiringPipelineScreen } from '../screens/school/HiringPipelineScreen';
import { CandidateSearchScreen } from '../screens/school/CandidateSearchScreen';
import { CandidateProfileScreen } from '../screens/school/CandidateProfileScreen';
import { TeacherSearchScreen } from '../screens/school/TeacherSearchScreen';
import { SchoolMessagesScreen } from '../screens/school/SchoolMessagesScreen';
import { AIInterviewManageScreen } from '../screens/school/AIInterviewManageScreen';
import { SchoolProfileScreen } from '../screens/school/SchoolProfileScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: any = {
  Dashboard: { active: 'grid', inactive: 'grid-outline' },
  Jobs: { active: 'briefcase', inactive: 'briefcase-outline' },
  Candidates: { active: 'people', inactive: 'people-outline' },
  Messages: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Settings: { active: 'person', inactive: 'person-outline' },
};

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={SchoolDashboardScreen} />
      <Stack.Screen name="HiringPipeline" component={HiringPipelineScreen} />
    </Stack.Navigator>
  );
}

function JobsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SchoolJobs" component={SchoolJobsScreen} />
      <Stack.Screen name="CreateJob" component={CreateJobScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="JobApplications" component={JobApplicationsScreen} />
      <Stack.Screen name="AIInterviewManage" component={AIInterviewManageScreen} />
    </Stack.Navigator>
  );
}

function CandidatesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CandidateSearch" component={CandidateSearchScreen} />
      <Stack.Screen name="TeacherSearch" component={TeacherSearchScreen} />
      <Stack.Screen name="CandidateProfile" component={CandidateProfileScreen} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SchoolMessages" component={SchoolMessagesScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SchoolProfileMain" component={SchoolProfileScreen} />
    </Stack.Navigator>
  );
}

export function SchoolTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }) => {
          const cfg = TAB_ICONS[route.name];
          const iconName = focused ? cfg?.active : cfg?.inactive;
          return (
            <View style={{ alignItems: 'center' }}>
              <Icon name={iconName || 'grid-outline'} size={24} color={color} />
              {focused && (
                <View style={{
                  width: 4, height: 4, borderRadius: 2,
                  backgroundColor: COLORS.primary, marginTop: 3,
                }} />
              )}
            </View>
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0EDFF',
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 12,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: 2,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="Candidates" component={CandidatesStack} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Settings" component={ProfileStack} />
    </Tab.Navigator>
  );
}
