import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';

// School Screens
import { SchoolDashboardScreen } from '../screens/school/SchoolDashboardScreen';
import { SchoolJobsScreen } from '../screens/school/SchoolJobsScreen';
import { CreateJobScreen } from '../screens/school/CreateJobScreen';
import { JobApplicationsScreen } from '../screens/school/JobApplicationsScreen';
import { CandidateProfileScreen } from '../screens/school/CandidateProfileScreen';
import { HiringPipelineScreen } from '../screens/school/HiringPipelineScreen';
import { SchoolMessagesScreen } from '../screens/school/SchoolMessagesScreen';
import { ChatScreen } from '../screens/shared/ChatScreen';
import { SchoolProfileScreen } from '../screens/school/SchoolProfileScreen';
import { TeacherSearchScreen } from '../screens/school/TeacherSearchScreen';
import { AIInterviewManageScreen } from '../screens/school/AIInterviewManageScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={SchoolDashboardScreen} />
      <Stack.Screen name="HiringPipeline" component={HiringPipelineScreen} />
    </Stack.Navigator>
  );
}

function JobsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyJobs" component={SchoolJobsScreen} />
      <Stack.Screen name="CreateJob" component={CreateJobScreen} />
      <Stack.Screen name="JobApplications" component={JobApplicationsScreen} />
      <Stack.Screen name="CandidateProfile" component={CandidateProfileScreen} />
      <Stack.Screen name="AIInterviewManage" component={AIInterviewManageScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherSearch" component={TeacherSearchScreen} />
      <Stack.Screen name="CandidateProfileView" component={CandidateProfileScreen} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SchoolMessages" component={SchoolMessagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export function SchoolTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, [string, string]> = {
            Dashboard: ['grid', 'grid-outline'],
            Jobs: ['briefcase', 'briefcase-outline'],
            Search: ['search', 'search-outline'],
            Messages: ['chatbubbles', 'chatbubbles-outline'],
            SchoolProfile: ['business', 'business-outline'],
          };
          const [active, inactive] = icons[route.name] || ['apps', 'apps-outline'];
          return <Icon name={focused ? active : inactive} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="SchoolProfile" component={SchoolProfileScreen} />
    </Tab.Navigator>
  );
}
