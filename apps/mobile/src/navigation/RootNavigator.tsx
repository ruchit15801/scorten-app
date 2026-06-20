import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Auth Screens
import { SplashScreen }        from '../screens/auth/SplashScreen';
import { WelcomeScreen }       from '../screens/auth/WelcomeScreen';
import { LoginScreen }         from '../screens/auth/LoginScreen';
import { RegisterScreen }      from '../screens/auth/RegisterScreen';
import { OTPScreen }           from '../screens/auth/OTPScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { RoleSelectScreen }    from '../screens/auth/RoleSelectScreen';
import {
  OnboardingStep1, OnboardingStep2, OnboardingStep3,
  OnboardingStep4, OnboardingStep5, OnboardingStep6,
  ProfileScoreRevealScreen,
} from '../screens/auth/OnboardingScreens';
import { RegistrationSuccessScreen } from '../screens/auth/RegistrationSuccessScreen';

// Main Navigators
import { TeacherTabNavigator } from './TeacherTabNavigator';
import { SchoolTabNavigator }  from './SchoolTabNavigator';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { isAuthenticated, user, pendingSuccessScreen, lastRegisteredSCortenId } =
    useSelector((state: RootState) => state.auth);

  const isTeacher = user?.role === 'teacher';
  const isSchool  = user?.role === 'school';

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FAF9FF' },
        }}
      >
        {/* ── SCHOOL REGISTRATION SUCCESS ──────────────────────────────────────
            Shown when a school just registered. isAuthenticated is still false;
            we wait until the user taps "Go to Dashboard" (which dispatches
            clearSuccessScreen → isAuthenticated = true → routes to SchoolApp).
        */}
        {pendingSuccessScreen && user?.role === 'school' ? (
          <Stack.Screen
            name="RegistrationSuccess"
            component={RegistrationSuccessScreen}
            options={{ animation: 'fade_from_bottom' }}
          />

        ) : !isAuthenticated ? (
          // ─── Auth Stack ────────────────────────────────────────────────────
          <>
            <Stack.Screen name="Splash"             component={SplashScreen}           />
            <Stack.Screen name="Welcome"            component={WelcomeScreen}          />
            <Stack.Screen name="RoleSelect"         component={RoleSelectScreen}       />
            <Stack.Screen name="Login"              component={LoginScreen}            />
            <Stack.Screen name="Register"           component={RegisterScreen}         />
            <Stack.Screen name="OTP"                component={OTPScreen}              />
            <Stack.Screen name="ForgotPassword"     component={ForgotPasswordScreen}   />
            <Stack.Screen name="OnboardingStep1"    component={OnboardingStep1}        />
            <Stack.Screen name="OnboardingStep2"    component={OnboardingStep2}        />
            <Stack.Screen name="OnboardingStep3"    component={OnboardingStep3}        />
            <Stack.Screen name="OnboardingStep4"    component={OnboardingStep4}        />
            <Stack.Screen name="OnboardingStep5"    component={OnboardingStep5}        />
            <Stack.Screen name="OnboardingStep6"    component={OnboardingStep6}        />
            <Stack.Screen name="ProfileScoreReveal" component={ProfileScoreRevealScreen} />
          </>

        ) : isTeacher ? (
          // ─── Teacher App ───────────────────────────────────────────────────
          <Stack.Screen
            name="TeacherApp"
            component={TeacherTabNavigator}
            options={{ animation: 'fade' }}
          />

        ) : isSchool ? (
          // ─── School App ────────────────────────────────────────────────────
          <Stack.Screen
            name="SchoolApp"
            component={SchoolTabNavigator}
            options={{ animation: 'fade' }}
          />

        ) : (
          // ─── Fallback: unknown role → force re-login ───────────────────────
          <>
            <Stack.Screen name="Splash"  component={SplashScreen}  />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login"   component={LoginScreen}   />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
