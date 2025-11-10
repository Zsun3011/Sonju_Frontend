// src/navigation/RootNavigator.tsx
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import OnboardingNavigator from './OnboardingNavigator';
<<<<<<< HEAD
import MainNavigator from './MainNavigator';
=======
import MainTabNavigator from '../navigation/MainTabNavigator';

// Chat Pages
import ChatMainPage from '../pages/AiChatPage/ChatMain';
import ChatRoomPage from '../pages/AiChatPage/ChatRoom';
import VoiceChatPage from '../pages/AiChatPage/VoiceChat';
import PromptSettingsPage from '../pages/AiChatPage/PromptSettings';
import ChatListPage from '../pages/AiChatPage/ChatList';

// Mission Pages
import DailyQuestPage from '../pages/DailyQuestPage/DailyQuestPage';
import MissionChatPage from '../pages/DailyQuestPage/MissionChatPage';
>>>>>>> db993bc2795fa5f827ec51b3eeeac9df5cd3aff3

const Stack = createNativeStackNavigator();

// 🔧 디버깅 모드: true로 설정하면 온보딩 건너뛰고 바로 메인으로 이동
const DEBUG_MODE = true;

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // 디버깅 모드일 때는 로그인 상태 체크 건너뛰기
      if (DEBUG_MODE) {
        setIsLoggedIn(true);
        setIsLoading(false);
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');

      setIsLoggedIn(!!token && hasCompletedOnboarding === 'true');
    } catch (error) {
      console.error('로그인 상태 확인 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#02BFDC" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
<<<<<<< HEAD
        <Stack.Screen name="Main" component={MainNavigator} />
=======
        <>
          {/* Main Tab Navigator */}
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* Chat Stack */}
          <Stack.Screen name="ChatMain" component={ChatMainPage} />
          <Stack.Screen name="ChatRoom" component={ChatRoomPage} />
          <Stack.Screen name="VoiceChat" component={VoiceChatPage} />
          <Stack.Screen name="PromptSettings" component={PromptSettingsPage} />
          <Stack.Screen name="ChatList" component={ChatListPage} />

          {/* Mission Stack */}
          <Stack.Screen name="DailyQuest" component={DailyQuestPage} />
          <Stack.Screen name="MissionChat" component={MissionChatPage} />
        </>
>>>>>>> db993bc2795fa5f827ec51b3eeeac9df5cd3aff3
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      )}
    </Stack.Navigator>
  );
}