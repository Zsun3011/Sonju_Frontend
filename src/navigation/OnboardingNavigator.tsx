import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../pages/Onboarding/WelcomeScreen';
import SignUpStep1Screen from '../pages/Onboarding/SignUpStep1Screen';
import SignUpStep2Screen from '../pages/Onboarding/SignUpStep2Screen';
import AddChildInfoScreen from '../pages/Onboarding/AddChildInfoScreen';
import LoginScreen from '../pages/Onboarding/LoginScreen';

const Stack = createNativeStackNavigator();

function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUpStep1" component={SignUpStep1Screen} />
      <Stack.Screen name="SignUpStep2" component={SignUpStep2Screen} />
      <Stack.Screen name="AddChildInfo" component={AddChildInfoScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default OnboardingNavigator;
