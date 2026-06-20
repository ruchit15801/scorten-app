import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { Icon } from '../components/Icon';

// Screens
import { HomeScreen } from '../screens/teacher/HomeScreen';
import { JobsScreen } from '../screens/teacher/JobsScreen';
import { JobDetailScreen } from '../screens/teacher/JobDetailScreen';
import { JobFiltersScreen } from '../screens/teacher/JobFiltersScreen';
import { ApplicationsScreen } from '../screens/teacher/ApplicationsScreen';
import { ApplicationDetailScreen } from '../screens/teacher/ApplicationDetailScreen';
import { AIInterviewScreen } from '../screens/teacher/AIInterviewScreen';
import { TeacherProfileScreen } from '../screens/teacher/TeacherProfileScreen';
import { EditProfileScreen } from '../screens/teacher/EditProfileScreen';
import { ResumeTemplatesScreen } from '../screens/teacher/ResumeTemplatesScreen';
import { ResumeBuilderScreen } from '../screens/teacher/ResumeBuilderScreen';
import { ResumePreviewScreen } from '../screens/teacher/ResumePreviewScreen';
import { AssessmentsListScreen, AssessmentIntroScreen, AssessmentQuizScreen, AssessmentResultScreen } from '../screens/teacher/SkillAssessments';
import { PortfolioScreen } from '../screens/teacher/PortfolioScreen';
import { GigsScreen } from '../screens/teacher/GigsScreen';
import { CreateGigScreen } from '../screens/teacher/CreateGigScreen';
import { CoursesScreen } from '../screens/teacher/CoursesScreen';
import { MessagesScreen } from '../screens/shared/MessagesScreen';
import { ChatScreen } from '../screens/shared/ChatScreen';
import { SkillTestsScreen } from '../screens/teacher/SkillTestsScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: any = {
  Home: { active: 'home', inactive: 'home-outline' },
  Jobs: { active: 'briefcase', inactive: 'briefcase-outline' },
  Applications: { active: 'document-text', inactive: 'document-text-outline' },
  Messages: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function JobsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsList" component={JobsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} />
      <Stack.Screen name="JobFilters" component={JobFiltersScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

function AppsStack() {
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
      <Stack.Screen name="ProfileMain" component={TeacherProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ResumeTemplates" component={ResumeTemplatesScreen} />
      <Stack.Screen name="ResumeBuilder" component={ResumeBuilderScreen} />
      <Stack.Screen name="ResumePreview" component={ResumePreviewScreen} />
      <Stack.Screen name="AssessmentsList" component={AssessmentsListScreen} />
      <Stack.Screen name="AssessmentIntro" component={AssessmentIntroScreen} />
      <Stack.Screen name="AssessmentQuiz" component={AssessmentQuizScreen} />
      <Stack.Screen name="AssessmentResult" component={AssessmentResultScreen} />
      <Stack.Screen name="SkillTests" component={SkillTestsScreen} />
      <Stack.Screen name="Portfolio" component={PortfolioScreen} />
      <Stack.Screen name="Gigs" component={GigsScreen} />
      <Stack.Screen name="CreateGig" component={CreateGigScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
    </Stack.Navigator>
  );
}

export function TeacherTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }) => {
          const cfg = TAB_ICONS[route.name];
          const iconName = focused ? cfg?.active : cfg?.inactive;
          return (
            <View style={{ alignItems: 'center' }}>
              <Icon name={iconName || 'home-outline'} size={24} color={color} />
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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="Applications" component={AppsStack} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
