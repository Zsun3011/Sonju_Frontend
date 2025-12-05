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

// Home Pages (추가)
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

//디버깅용, true: 메인화면으로 바로 접속
const DEBUG_MODE = false;

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    // ⭐ 로그인 성공 이벤트 리스너 추가
    const loginSuccessListener = DeviceEventEmitter.addListener(
      'LOGIN_SUCCESS',
      () => {
        console.log('🎉 로그인 성공 이벤트 수신 - 상태 재확인');
        checkLoginStatus();
      }
    );
    
    return () => {
      appStateSubscription?.remove();
      loginSuccessListener.remove(); // ⭐ 정리
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      console.log('📱 앱이 활성화됨 - 로그인 상태 재확인');
      checkLoginStatus();
    }
  };

  const checkLoginStatus = async () => {
    try {
      if (DEBUG_MODE) {
        setIsLoggedIn(true);
        setIsLoading(false);
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');

      console.log('🔍 로그인 상태 확인:', { 
        hasToken: !!token, 
        hasCompletedOnboarding 
      });

      const newLoginState = !!token && hasCompletedOnboarding === 'true';

      if (newLoginState !== isLoggedIn) {
        console.log('✅ 로그인 상태 변경:', isLoggedIn, '→', newLoginState);
        setIsLoggedIn(newLoginState);
      }
    } catch (error) {
      console.error('❌ 로그인 상태 확인 실패:', error);
      setIsLoggedIn(false);
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