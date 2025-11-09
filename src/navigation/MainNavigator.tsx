// src/navigation/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from '../components/MainTabNavigator';
import SettingsPage from '../pages/HomePage/SettingsPage';
import NotificationPage from '../pages/HomePage/NotificationPage';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 메인 탭 네비게이터 (홈, 할일, 채팅, 미션) */}
      <Stack.Screen
        name="MainTab"
        component={MainTabNavigator}
      />

      {/* 홈에서만 접근 가능한 페이지들 - 탭바 숨김 */}
      <Stack.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          animation: 'slide_from_right',
          presentation: 'card', // 전체 화면으로 표시
        }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationPage}
        options={{
          animation: 'slide_from_right',
          presentation: 'card', // 전체 화면으로 표시
        }}
      />
    </Stack.Navigator>
  );
}