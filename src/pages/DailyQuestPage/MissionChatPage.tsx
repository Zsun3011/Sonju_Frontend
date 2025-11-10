import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/common/Header';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import { useMission } from '../../contexts/MissionContext';
import { Message } from '../../types/chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MissionStyles } from '../../styles/MissionStyles';
type MissionChatNavigationProp = NativeStackNavigationProp<any>;

const MissionChatPage = () => {
  const navigation = useNavigation<MissionChatNavigationProp>();
  const { currentMission, completeMission } = useMission();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 미션 질문을 처음에 표시
  useEffect(() => {
    if (currentMission && messages.length === 0) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `"${currentMission.question}"라고 질문해보세요!`,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [currentMission]);

  const handleSendMessage = async (message: string) => {
    if (!currentMission) return;

    setIsLoading(true);

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // 미션 질문과 유사한지 간단히 체크
    const isCorrect = message.toLowerCase().includes(currentMission.question.toLowerCase().slice(0, 5));

    // TODO: ChatGPT API 호출
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          '알겠습니다. 오늘의 주요 뉴스를 정리해드리면 다음과 같습니다.\n\n1. 이스라엘과 하마스 간 전쟁이 공식적으로 종료되었습니다. 생존 인원 전원 석방과 함께 대규모 포로 교환이 이루어졌다고 양측이 발표했습니다.\n\n2. 미국과 중국 간 무역 긴장이 완화되는 조짐을 보이고 있습니다. 특히 선박 운임 및 수출 투자 관련 협의가 진행되고 있습니다.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      // 미션 완료 처리
      if (isCorrect && !currentMission.completed) {
        setTimeout(() => {
          completeMission(currentMission.id);
          Alert.alert(
            '🎉 미션 완료!',
            `축하합니다!\n"${currentMission.title}" 미션을 완료하여\n${currentMission.points} 포인트를 획득했습니다.`,
            [
              {
                text: '확인',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }, 500);
      }
    }, 1000);
  };

  if (!currentMission) {
    navigation.navigate('DailyQuest');
    return null;
  }

  return (
    <SafeAreaView style={MissionStyles.chatContainer}>
      <View style={MissionStyles.chatContainer}>
      <Header
        title="돌쇠"
        showBack={true}
        onStar={() => navigation.navigate('PromptSettings')}
        onMenu={() => navigation.navigate('ChatList')}
      />

      <ScrollView
        ref={scrollViewRef}
        style={MissionStyles.messagesContainer}
        contentContainerStyle={MissionStyles.messagesContent}
      >
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <View style={MissionStyles.loadingContainer}>
            {/* TODO: 로딩 인디케이터 */}
          </View>
        )}
      </ScrollView>

      <ChatInput
        onSend={handleSendMessage}
        onVoiceClick={() => navigation.navigate('VoiceChat')}
        disabled={isLoading}
      />
    </View>
    </SafeAreaView>
  );
};

export default MissionChatPage;