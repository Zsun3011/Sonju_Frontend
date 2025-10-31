import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useChat } from '../../store/ChatContext';
import ChatBubble from '../../components/chat/ChatBubble';
import { chatStyles as s } from '../../styles/ChatStyles';

export default function AiChatPage({ navigation }: any) {
  const { currentChat, sendMessage, loading, createNewChat } = useChat();
  const [inputText, setInputText] = useState('');

  const suggestedQuestions = [
    '오늘의 뉴스 요약',
    '오늘 날씨 어때?',
  ];

  const handleSend = async () => {
    if (inputText.trim()) {
      await sendMessage(inputText);
      setInputText('');
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    await sendMessage(question);
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* 헤더 */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>돌쇠</Text>
        <View style={s.headerRight}>
          <TouchableOpacity onPress={() => {/* 즐겨찾기 토글 */}}>
            <Text>⭐</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PromptSetting')}>
            <Text>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 채팅 영역 */}
      {!currentChat || currentChat.messages.length === 0 ? (
        <View style={s.emptyState}>
          <Text style={s.emptyTitle}>무엇이든 물어보세요.</Text>
          
          <Text style={s.suggestedTitle}>추천 질문</Text>
          <View style={s.suggestedContainer}>
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={s.suggestedButton}
                onPress={() => handleSuggestedQuestion(question)}
              >
                <Text style={s.suggestedText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={currentChat.messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={s.messageList}
        />
      )}

      {/* 입력 영역 */}
      <View style={s.inputContainer}>
        <TouchableOpacity style={s.addButton}>
          <Text style={s.addButtonText}>+</Text>
        </TouchableOpacity>
        
        <TextInput
          style={s.input}
          placeholder="저에게 어떻게 말할까요?"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        
        <TouchableOpacity
          style={s.sendButton}
          onPress={() => navigation.navigate('VoiceChat')}
        >
          <Text style={s.sendButtonText}>🎤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}