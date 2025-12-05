// src/App.tsx
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { FontSizeProvider } from './contexts/FontSizeContext';
import { ChatProvider } from './contexts/ChatContext';
import { PointProvider } from './contexts/PointContext';
import { MissionProvider } from './contexts/MissionContext';
import { AuthProvider } from './contexts/AuthContext';
import { debugToken } from './utils/debugToken';

debugToken(); // 콘솔 확인

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <FontSizeProvider>
        <AuthProvider>
          <ChatProvider>
            <PointProvider>
              <MissionProvider>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
              </MissionProvider>
            </PointProvider>
          </ChatProvider>
        </AuthProvider>
      </FontSizeProvider>
    </SafeAreaProvider>
  );
}