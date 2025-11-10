import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../types/chat';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.content}</Text>
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
        <Text style={styles.assistantText}>{message.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  assistantContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B8E6EA',
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderTopLeftRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  assistantText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D4550',
  },
});

export default ChatBubble;
