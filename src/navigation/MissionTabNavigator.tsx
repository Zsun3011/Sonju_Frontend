import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Pages
import HomePage from '../pages/HomePage/HomePage';
import ChatMainPage from '../pages/AiChatPage/ChatMain';
import DailyQuestPage from '../pages/DailyQuestPage/DailyQuestPage';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#02BFDC',
        tabBarInactiveTintColor: '#7A9CA5',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#B8E6EA',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatMainPage}
        options={{
          tabBarLabel: '채팅',
          tabBarIcon: ({ color, size }) => <Icon name="chatbubbles" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Mission"
        component={DailyQuestPage}
        options={{
          tabBarLabel: '미션',
          tabBarIcon: ({ color, size }) => <Icon name="trophy" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}