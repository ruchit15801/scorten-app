import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Auth Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { RoleSelectScreen } from '../screens/auth/RoleSelectScreen';
import {
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
} from '../screens/auth/OnboardingScreens';

// Main Navigators
import { TeacherTabNavigator } from './TeacherTabNavigator';
import { SchoolTabNavigator } from './SchoolTabNavigator';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FAF9FF' },
        }}
      >
        {!isAuthenticated ? (
          // ─── Auth Stack ───────────────────────────────────────────────────
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="OnboardingStep1" component={OnboardingStep1} />
            <Stack.Screen name="OnboardingStep2" component={OnboardingStep2} />
            <Stack.Screen name="OnboardingStep3" component={OnboardingStep3} />
          </>
        ) : user?.role === 'teacher' ? (
          // ─── Teacher App ──────────────────────────────────────────────────
          <Stack.Screen name="TeacherApp" component={TeacherTabNavigator} />
        ) : (
          // ─── School App ───────────────────────────────────────────────────
          <Stack.Screen name="SchoolApp" component={SchoolTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
