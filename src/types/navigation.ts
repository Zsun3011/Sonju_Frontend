// src/types/navigation.ts

export type ChatStackParamList = {
  ChatMain: undefined;
  ChatRoom: undefined;
  ChatList: undefined;
  PromptSettings: undefined;
  VoiceChat: undefined;
};

export type MissionStackParamList = {
  DailyQuest: undefined;
  MissionChat: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  // Chat Stack
  ChatMain: undefined;
  ChatRoom: undefined;
  ChatList: undefined;
  PromptSettings: undefined;
  VoiceChat: undefined;
  // Mission Stack
  DailyQuest: undefined;
  MissionChat: undefined;
  // Home
  Home: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}