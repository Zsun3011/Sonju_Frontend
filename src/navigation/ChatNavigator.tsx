import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AiChatPage from '../pages/AiChatPage/AiChatPage';
import VoiceChatPage from '../pages/AiChatPage/VoiceChatPage';
import PromptSettingPage from '../pages/AiChatPage/PromptSettingPage';
import ChatListPage from '../pages/AiChatPage/ChatListPage';

const Stack = createStackNavigator();

export default function ChatNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AiChat" component={AiChatPage} />
      <Stack.Screen name="VoiceChat" component={VoiceChatPage} />
      <Stack.Screen name="PromptSetting" component={PromptSettingPage} />
      <Stack.Screen name="ChatList" component={ChatListPage} />
    </Stack.Navigator>
  );
}