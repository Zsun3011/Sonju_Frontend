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

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <ScaledText fontSize={16} style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
        </ScaledText>
        
        {/* Todo 제안 표시 (AI 메시지에만) */}
        {!isUser && showTodoSuggestion && todoTask && (
          <View style={styles.todoSuggestion}>
            <View style={styles.todoHeader}>
              <ScaledText fontSize={14} style={styles.todoLabel}>할일로 등록할까요?</ScaledText>
            </View>
            <ScaledText fontSize={16} style={styles.todoTask}>{todoTask}</ScaledText>
            {(todoDate || todoTime) && (
              <ScaledText fontSize={14} style={styles.todoDateTime}>
                {todoDate && todoDate}
                {todoDate && todoTime && ' '}
                {todoTime && todoTime}
              </ScaledText>
            )}
          </View>
        )}
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
  userContainer: {
    alignItems: 'flex-end',
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
  userBubble: {
    backgroundColor: '#02BFDC',
    borderBottomRightRadius: 4,
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
  text: {
    lineHeight: 24,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
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