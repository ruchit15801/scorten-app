import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Teacher Screens
import { HomeScreen } from '../screens/teacher/HomeScreen';
import { JobsScreen } from '../screens/teacher/JobsScreen';
import { JobDetailScreen } from '../screens/teacher/JobDetailScreen';
import { ApplicationsScreen } from '../screens/teacher/ApplicationsScreen';
import { ApplicationDetailScreen } from '../screens/teacher/ApplicationDetailScreen';
import { ProfileScreen } from '../screens/teacher/ProfileScreen';
import { EditProfileScreen } from '../screens/teacher/EditProfileScreen';
import { MessagesScreen } from '../screens/shared/MessagesScreen';
import { ChatScreen } from '../screens/shared/ChatScreen';
import { GigsScreen } from '../screens/teacher/GigsScreen';
import { CreateGigScreen } from '../screens/teacher/CreateGigScreen';
import { AIInterviewScreen } from '../screens/teacher/AIInterviewScreen';
import { SkillTestsScreen } from '../screens/teacher/SkillTestsScreen';
import { CoursesScreen } from '../screens/teacher/CoursesScreen';
import { ResumeBuilderScreen } from '../screens/teacher/ResumeBuilderScreen';
import { PortfolioScreen } from '../screens/teacher/PortfolioScreen';

import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function JobsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsList" component={JobsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} />
    </Stack.Navigator>
  );
}

function ApplicationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ApplicationsList" component={ApplicationsScreen} />
      <Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} />
      <Stack.Screen name="AIInterview" component={AIInterviewScreen} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesList" component={MessagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ResumeBuilder" component={ResumeBuilderScreen} />
      <Stack.Screen name="Portfolio" component={PortfolioScreen} />
      <Stack.Screen name="Gigs" component={GigsScreen} />
      <Stack.Screen name="CreateGig" component={CreateGigScreen} />
      <Stack.Screen name="SkillTests" component={SkillTestsScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
    </Stack.Navigator>
  );
}

export function TeacherTabNavigator() {
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
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Home: ['home', 'home-outline'],
            Jobs: ['briefcase', 'briefcase-outline'],
            Applications: ['document-text', 'document-text-outline'],
            Messages: ['chatbubbles', 'chatbubbles-outline'],
            Profile: ['person', 'person-outline'],
          };
          const [active, inactive] = icons[route.name] || ['apps', 'apps-outline'];
          return <Icon name={focused ? active : inactive} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="Applications" component={ApplicationsStack} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
