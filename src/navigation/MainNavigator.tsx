import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeNavigator from './HomeNavigator';
import ChatNavigator from './ChatNavigator';
import AnalysisNavigator from './AnalysisNavigator';
import TodoNavigator from './TodoNavigator';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#02BFDC',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="🏠" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatNavigator}
        options={{
          tabBarLabel: '채팅',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="💬" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AnalysisTab"
        component={AnalysisNavigator}
        options={{
          tabBarLabel: '분석',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="📊" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TodoTab"
        component={TodoNavigator}
        options={{
          tabBarLabel: '할 일',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="✓" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 탭 아이콘 컴포넌트
function TabIcon({ name, color }: { name: string; color: string }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, { color }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
});