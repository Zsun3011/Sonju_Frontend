import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import { useChat } from '../../contexts/ChatContext';
import { ChatStackParamList } from '../../types/navigation';

type ChatRoomNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatRoom'>;

const ChatRoom = () => {
  const navigation = useNavigation<ChatRoomNavigationProp>();
  const { currentChat, addMessage } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);

    // 사용자 메시지 추가
    addMessage({ role: 'user', content: message });

    // 스크롤을 맨 아래로
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // TODO: ChatGPT API 호출
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content:
          '알겠습니다. 오늘의 주요 뉴스를 정리해드리면 다음과 같습니다.\n\n1. 이스라엘과 하마스 간 전쟁이 공식적으로 종료되었습니다. 생존 인질 전원 석방과 함께 대규모 포로 교환이 이루어졌다고 양측이 발표했습니다.\n\n2. 미국과 중국 간 무역 긴장이 완화되는 조짐을 보이고 있습니다. 특히 선박 운임 및 수출 통제 관련 협의가 진행 중입니다.',
      });
      setIsLoading(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Header
        title="돌쇠"
        showBack={true}
        onStar={() => navigation.navigate('PromptSettings')}
        onMenu={() => navigation.navigate('ChatList')}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {/* TODO: 캐릭터 이미지 에셋 추가 */}
        <View style={styles.characterHeader}>
          <View style={styles.characterPlaceholder} />
        </View>

        {currentChat?.messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <View style={styles.loadingContainer}>
            {/* TODO: 로딩 인디케이터 추가 */}
          </View>
        )}
      </ScrollView>

      <ChatInput
        onSend={handleSendMessage}
        onVoiceClick={() => navigation.navigate('VoiceChat')}
        onAttachClick={() => {
          // TODO: 파일 첨부 기능
        }}
        disabled={isLoading}
      />
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9F2F5',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  characterHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  characterPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#B8E6EA',
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default ChatRoom;