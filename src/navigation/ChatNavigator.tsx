import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatMainPage from '../pages/AiChatPage/ChatMain';
import ChatRoomPage from '../pages/AiChatPage/ChatRoom';
import VoiceChatPage from '../pages/AiChatPage/VoiceChat';
import PromptSettingsPage from '../pages/AiChatPage/PromptSettings';
import ChatListPage from '../pages/AiChatPage/ChatList';

const Stack = createNativeStackNavigator();

function ChatNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatMain" component={ChatMainPage} />
      <Stack.Screen name="ChatRoom" component={ChatRoomPage} />
      <Stack.Screen name="VoiceChat" component={VoiceChatPage} />
      <Stack.Screen name="PromptSettings" component={PromptSettingsPage} />
      <Stack.Screen name="ChatList" component={ChatListPage} />
    </Stack.Navigator>
  );
}

export default ChatNavigator;