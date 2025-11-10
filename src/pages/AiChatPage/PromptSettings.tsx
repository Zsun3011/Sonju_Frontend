import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useChat } from '../../contexts/ChatContext';
import { PromptType } from '../../types/chat';
import { promptConfigs } from '../../utils/promptHelper';
import { ChatStackParamList } from '../../types/navigation';

type PromptSettingsNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'PromptSettings'>;

const PromptSettings = () => {
  const navigation = useNavigation<PromptSettingsNavigationProp>();
  const { currentPrompt, setCurrentPrompt } = useChat();

  // 임시로 선택된 프롬프트를 저장하는 상태
  const [selectedPrompt, setSelectedPrompt] = useState<PromptType>(currentPrompt);

  const handleSelectPrompt = (promptType: PromptType) => {
    // 임시 상태만 업데이트 (실제 저장은 하지 않음)
    setSelectedPrompt(promptType);
  };

  const handleSave = () => {
    // 저장 버튼을 눌렀을 때만 실제로 프롬프트를 저장
    setCurrentPrompt(selectedPrompt);
    navigation.goBack();
  };

  const promptTypes: PromptType[] = ['gentle', 'reliable', 'cheerful', 'smart'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프롬프트 설정</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* TODO: 캐릭터 이미지 에셋 추가 */}
        <View style={styles.characterContainer}>
          <View style={styles.characterPlaceholder} />
        </View>

        <Text style={styles.description}>
          프롬프트를 고르면{'\n'}손주의 목소리를 들을 수 있어요.
        </Text>

        <View style={styles.promptList}>
          {promptTypes.map((type) => {
            const config = promptConfigs[type];
            const isSelected = selectedPrompt === type;

            return (
              <TouchableOpacity
                key={type}
                style={[styles.promptItem, isSelected && styles.promptItemSelected]}
                onPress={() => handleSelectPrompt(type)}
                activeOpacity={0.7}
              >
                <Text style={[styles.promptLabel, isSelected && styles.promptLabelSelected]}>
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9F2F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#D9F2F5',
    borderBottomWidth: 1,
    borderBottomColor: '#B8E6EA',
  },
  backButton: {
    padding: 8,
    width: 80,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D4550',
  },
  saveButton: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#02BFDC',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  characterContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  characterPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#B8E6EA',
  },
  description: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2D4550',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  promptList: {
    paddingHorizontal: 32,
    gap: 16,
  },
  promptItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#B8E6EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  promptItemSelected: {
    backgroundColor: '#E8F7FA',
    borderColor: '#02BFDC',
  },
  promptLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2D4550',
    textAlign: 'center',
  },
  promptLabelSelected: {
    color: '#02BFDC',
    fontWeight: '600',
  },
});

export default PromptSettings;
