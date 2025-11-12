import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import SuggestedQuestion from '../../components/chat/SuggestedQuestion';
import ChatInput from '../../components/chat/ChatInput';
import { useChat } from '../../contexts/ChatContext';
import { ChatStackParamList } from '../../types/navigation';
import { ChatStyles} from '../../styles/ChatStyles';
import ScaledText from '../../components/ScaledText';

type ChatMainNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatMain'>;

const ChatMain = () => {
  const navigation = useNavigation<ChatMainNavigationProp>();
  const { addMessage } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = ['오늘 뉴스 요약', '오늘 날씨 어때?'];

  const handleSendMessage = (message: string) => {
    setIsLoading(true);
    addMessage({ role: 'user', content: message });

    // TODO: ChatGPT API 호출
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: '안녕하세요! 무엇을 도와드릴까요?',
      });
      setIsLoading(false);
      navigation.navigate('ChatRoom');
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="돌쇠"
        showBack={true}
        onStar={() => navigation.navigate('PromptSettings')}
        onMenu={() => navigation.navigate('ChatList')}
      />

      <View style={ChatStyles.mainContent}>
        <View style={ChatStyles.characterContainer}>
          <View style={styles.glow} />
          <Image
            source={require('../../../assets/images/icons/SonjuHeadIcon.png')}
            style={ChatStyles.characterSmall}
            resizeMode="contain"
          />
        </View>

        {/* 큰 글씨 24 */}
        <ScaledText style={styles.title} fontSize={24}>
          무엇이든 물어보세요.
        </ScaledText>

        <View style={styles.suggestionsContainer}>
          {/* 작은 글씨 18 */}
          <ScaledText style={styles.suggestionsTitle} fontSize={18}>
            추천 질문
          </ScaledText>
          <View style={styles.suggestionsGrid}>
            {suggestedQuestions.map((question, index) => (
              <View key={index} style={styles.suggestionItem}>
                <SuggestedQuestion question={question} onClick={handleQuestionClick} />
              </View>
            ))}
          </View>
        </View>
      </View>

      <ChatInput
        onSend={handleSendMessage}
        onVoiceClick={() => navigation.navigate('VoiceChat')}
        disabled={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 128,
  },
  characterContainer: {
    width: 256,
    height: 256,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(2, 191, 220, 0.2)',
    borderRadius: 128,
    opacity: 0.6,
  },
  character: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24, // ScaledText가 무시하고 24 기준으로 스케일 적용
    fontWeight: '600',
    color: '#2D4550',
    marginBottom: 32,
  },
  suggestionsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  suggestionsTitle: {
    fontSize: 14, // ScaledText가 무시하고 18 기준으로 스케일 적용
    color: '#7A9CA5',
    marginBottom: 16,
    textAlign: 'center',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionItem: {
    flexBasis: '48%',
  },
});

export default ChatMain;
