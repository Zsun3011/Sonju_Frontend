// src/components/chat/ChatBubble.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScaledText from '../ScaledText';
import { Message } from '../../contexts/ChatContext';

interface ChatBubbleProps {
  message: Message;
  showTodoSuggestion?: boolean;
  todoTask?: string;
  todoDate?: string;
  todoTime?: string;
  onTodoAccept?: () => void;
  onTodoReject?: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  showTodoSuggestion = false,
  todoTask,
  todoDate,
  todoTime,
  onTodoAccept,
  onTodoReject,
}) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userBubble}>
          {/* 본문: 중간 20 */}
          <ScaledText style={styles.userText} fontSize={20}>
            {message.content}
          </ScaledText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.assistantContainer}>
      {/* TODO: 캐릭터 아바타 이미지 에셋 추가
      <Image
        source={require('../../assets/character-excited.png')}
        style={styles.avatar}
      />
      */}
      <View style={styles.avatarPlaceholder} />
      <View style={styles.assistantBubble}>
        {/* 본문: 중간 20 */}
        <ScaledText style={styles.assistantText} fontSize={20}>
          {message.content}
        </ScaledText>
      </View>
      
      {/* 타임스탬프 */}
      <ScaledText fontSize={12} style={[styles.timestamp, isUser ? styles.userTimestamp : styles.assistantTimestamp]}>
        {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
      </ScaledText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userBubble: {
    backgroundColor: '#02BFDC',
    borderRadius: 20,
    borderTopRightRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userText: {
    fontSize: 20, // ScaledText가 20을 기준으로 스케일 적용
    lineHeight: 28,
    color: '#FFFFFF',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A5BCC3',
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  assistantText: {
    fontSize: 20, // ScaledText가 20을 기준으로 스케일 적용
    lineHeight: 28,
    color: '#2D4550',
  },
  todoSuggestion: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8F8FA',
  },
  todoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  todoLabel: {
    color: '#7A9CA5',
    fontWeight: '500',
  },
  todoTask: {
    color: '#2D4550',
    fontWeight: '600',
    marginBottom: 4,
  },
  todoDateTime: {
    color: '#5B8A95',
    fontSize: 14,
  },
  timestamp: {
    marginTop: 4,
  },
  userTimestamp: {
    color: '#7A9CA5',
    textAlign: 'right',
  },
  assistantTimestamp: {
    color: '#7A9CA5',
    textAlign: 'left',
  },
});

export default ChatBubble;