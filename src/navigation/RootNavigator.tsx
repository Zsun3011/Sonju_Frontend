import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, AppState, AppStateStatus, DeviceEventEmitter } from 'react-native';

import OnboardingNavigator from './OnboardingNavigator';
import MainTabNavigator from './MainTabNavigator';

// Chat Pages
import ChatMainPage from '../pages/AiChatPage/ChatMain';
import ChatRoomPage from '../pages/AiChatPage/ChatRoom';
import VoiceChatPage from '../pages/AiChatPage/VoiceChat';
import PromptSettingsPage from '../pages/AiChatPage/PromptSettings';
import ChatListPage from '../pages/AiChatPage/ChatList';

// Mission Pages
import DailyQuestPage from '../pages/DailyQuestPage/DailyQuestPage';
import MissionChatPage from '../pages/DailyQuestPage/MissionChatPage';

// Shop Pages
import ItemShopPage from '../pages/ItemShopPage/ItemShopPage';

// Home Pages
import SettingsPage from '../pages/HomePage/SettingsPage';
import NotificationPage from '../pages/HomePage/NotificationPage';
import HealthPage from '../pages/HealthPage/HealthPage';
import MedicationSettings from '../pages/HealthPage/MedicationSettings';
import HealthDiaryEntry from '../pages/HealthPage/HealthDiaryEntry';
import HealthDiaryList from '../pages/HealthPage/HealthDiaryList';
import ManualMedicationEntry from '../pages/HealthPage/ManualMedicationEntry';
import PrescriptionOCR from '../pages/HealthPage/PrescriptionOCR';
import MedicationResultConfirm from '../pages/HealthPage/MedicationResultConfirm';

const Stack = createNativeStackNavigator();

// 디버깅용, true: 메인화면으로 바로 접속
const DEBUG_MODE = false;

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
        checkLoginStatus();

        // AsyncStorage 변경 감지를 위한 interval 설정
        const interval = setInterval(() => {
          checkLoginStatus();
        }, 200); // 200ms마다 체크

        return () => clearInterval(interval);
      }, []); // 의존성 배열 비움


    const checkLoginStatus = async () => {
      try {
        if (DEBUG_MODE) {
          setIsLoggedIn(true);
          setIsLoading(false);
          return;
        }

        // accessToken과 온보딩 완료 여부로 로그인 상태 판단
        const token = await AsyncStorage.getItem('accessToken');
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');

        const newLoginState = !!token && hasCompletedOnboarding === 'true';

        // 항상 상태 업데이트 (React가 자동으로 동일한 값은 무시함)
        setIsLoggedIn(newLoginState);

        console.log(`🔍 [RootNavigator] 상태 체크 - 토큰: ${!!token}, 온보딩: ${hasCompletedOnboarding}, 로그인: ${newLoginState}`);
      } catch (error) {
        console.error('❌ [RootNavigator] 로그인 상태 확인 실패:', error);
      } finally {
        if (isLoading) {
          setIsLoading(false);
        }
      }
    };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#02BFDC" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          {/* Main Tab Navigator - 최상위 */}
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* Home Stack - 홈에서 접근하는 페이지들 */}
          <Stack.Screen
            name="Settings"
            component={SettingsPage}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Notification"
            component={NotificationPage}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Health Stack - 건강 관련 페이지들 */}
          <Stack.Screen
            name="Health"
            component={HealthPage}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="MedicationSettings"
            component={MedicationSettings}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="HealthDiaryEntry"
            component={HealthDiaryEntry}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="HealthDiaryList"
            component={HealthDiaryList}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ManualMedicationEntry"
            component={ManualMedicationEntry}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="PrescriptionOCR"
            component={PrescriptionOCR}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="MedicationResultConfirm"
            component={MedicationResultConfirm}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Chat Stack */}
          <Stack.Screen
            name="ChatMain"
            component={ChatMainPage}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ChatRoom"
            component={ChatRoomPage}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="VoiceChat"
            component={VoiceChatPage}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="PromptSettings"
            component={PromptSettingsPage}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ChatList"
            component={ChatListPage}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Mission Stack */}
          <Stack.Screen
            name="DailyQuest"
            component={DailyQuestPage}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="MissionChat"
            component={MissionChatPage}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Shop Stack */}
          <Stack.Screen
            name="Shop"
            component={ItemShopPage}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      )}
    </Stack.Navigator>
  );
}