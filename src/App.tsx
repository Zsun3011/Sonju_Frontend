// src/App.tsx
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingNavigator from './navigation/OnboardingNavigator';
import { FontSizeProvider } from './contexts/FontSizeContext';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <FontSizeProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer>
            <OnboardingNavigator />
          </NavigationContainer>
      </FontSizeProvider>
    </SafeAreaProvider>
  );
}