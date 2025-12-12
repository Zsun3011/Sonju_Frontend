import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import ScaledText from '../../components/ScaledText';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import PageHeader from '../../components/common/PageHeader';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import { useChat } from '../../contexts/ChatContext';
import { ChatStackParamList } from '../../types/navigation';
import { TodoMeta } from '../../services/chatService';

type ChatRoomNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatRoom'>;

const ChatRoom = () => {
  const navigation = useNavigation<ChatRoomNavigationProp>();
  const { currentChat, sendMessageToAI, currentTodoMeta, setCurrentTodoMeta } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [currentChat?.messages.length]);

  // Todo 메타 정보 처리
  useEffect(() => {
    if (currentTodoMeta) {
      handleTodoMeta(currentTodoMeta);
    }
  }, [currentTodoMeta]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      // 백엔드로 메시지 전송 및 AI 응답 받기
      const response = await sendMessageToAI(
        message,
        currentChat?.chat_list_num,
        false // TTS 비활성화
      );

      // Todo 메타 정보는 useEffect에서 처리됨
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert(
        '오류',
        '메시지를 전송하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        [{ text: '확인' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Todo 메타 정보에 따른 처리
   */
  const handleTodoMeta = (todoMeta: TodoMeta) => {
    const { has_todo, step, task, date, time } = todoMeta;

    switch (step) {
      case 'suggest':
        // AI가 할일 등록을 제안한 상태
        // UI에 "할일로 등록할까요?" 버튼 표시 (ChatBubble에서 처리)
        console.log('Todo suggested:', task);
        break;

      case 'ask_confirm':
        // AI가 확인을 요청한 상태 (예/아니오)
        console.log('Todo confirmation asked');
        break;

      case 'ask_date':
        // AI가 날짜/시간을 요청한 상태
        console.log('Todo date/time asked');
        break;

      case 'saved':
        // 할일 정보가 완전히 수집된 상태
        if (has_todo && task) {
          // TODO: /todos POST API 호출
          saveTodo(task, date, time);
        }
        break;

      case 'cancelled':
        // 사용자가 할일 등록을 취소한 상태
        console.log('Todo cancelled');
        setCurrentTodoMeta(null);
        break;

      case 'none':
      default:
        // 할일 관련 처리 없음
        setCurrentTodoMeta(null);
        break;
    }
  };

  /**
   * 할일 저장 (TODO: 실제 API 연동 필요)
   */
  const saveTodo = async (task: string, date?: string, time?: string) => {
    try {
      // TODO: /todos POST API 호출
      // 자연어 날짜/시간을 파싱하여 due_date/due_time 형식으로 변환
      console.log('Saving todo:', { task, date, time });

      Alert.alert('할일 등록', '할일이 성공적으로 등록되었습니다.', [{ text: '확인' }]);
      setCurrentTodoMeta(null);
    } catch (error) {
      console.error('Failed to save todo:', error);
      Alert.alert('오류', '할일 등록 중 오류가 발생했습니다.', [{ text: '확인' }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <PageHeader
          title="돌쇠"
          onBack={() => navigation.goBack()}
          safeArea={true}
          rightButton={
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => navigation.navigate('PromptSettings')} style={styles.iconButton}>
                <Icon name="star-outline" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ChatList')} style={styles.iconButton}>
                <Icon name="menu" size={24} color="#333" />
              </TouchableOpacity>
            </View>
          }
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* 캐릭터 헤더 */}
          <View style={styles.characterHeader}>
            <View style={styles.characterPlaceholder} />
          </View>

          {/* 메시지 목록 */}
          {currentChat?.messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {/* 로딩 인디케이터 */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ScaledText fontSize={14} style={styles.loadingText}>
                답변을 생성하고 있습니다...
              </ScaledText>
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
    backgroundColor: '#B8E9F5',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
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
    backgroundColor: '#A5BCC3',
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  loadingText: {
    color: '#7A9CA5',
    fontStyle: 'italic',
  },
});

export default ChatRoom;