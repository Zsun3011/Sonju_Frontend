import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Message } from '../../types/chat';
import ScaledText from '../../components/ScaledText';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
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
    fontSize: 20, // ScaledText가 20을 기준으로 스케일 적용
    lineHeight: 28,
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
    backgroundColor: '#A5BCC3',
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
    fontSize: 20, // ScaledText가 20을 기준으로 스케일 적용
    lineHeight: 28,
    color: '#2D4550',
  },
});

export default ChatBubble;
