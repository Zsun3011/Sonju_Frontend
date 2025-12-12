// src/screens/PromptSettings.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View,  
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import ScaledText from '../../components/ScaledText';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import PageHeader from '../../components/common/PageHeader';
import { useChat } from '../../contexts/ChatContext';
import { Personality } from '../../types/ai';
import { promptConfigs } from '../../utils/promptHelper';
import { ChatStackParamList } from '../../types/navigation';
import { aiProfileAPI } from '../../services/aiProfile';
import ScaledText from '../../components/ScaledText';

type PromptSettingsNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'PromptSettings'>;

const PromptSettings = () => {
  const navigation = useNavigation<PromptSettingsNavigationProp>();
  const { currentPrompt, setCurrentPrompt } = useChat();

  const [selectedPrompt, setSelectedPrompt] = useState<Personality>(currentPrompt);
  const [loading, setLoading] = useState(false);
  const [aiNickname, setAiNickname] = useState<string>('손주');

  /**
   * AI 프로필 불러오기
   */
  useEffect(() => {
    const fetchAiProfile = async () => {
      try {
        const profile = await aiProfileAPI.getAiProfile();
        setAiNickname(profile.nickname);
        setSelectedPrompt(profile.personality);
        setCurrentPrompt(profile.personality);
      } catch (error) {
        console.error('AI 프로필 로드 실패:', error);
      }
    };

    fetchAiProfile();
  }, []);

  const handleSelectPrompt = (promptType: Personality) => {
    setSelectedPrompt(promptType);
  };

  // handleSave 함수 수정
const handleSave = async () => {
  try {
    setLoading(true);

    // 백엔드에 성격 업데이트 (PUT /ai/preferences)
    await aiProfileAPI.updatePreferences(selectedPrompt);

    // 로컬 상태 업데이트
    setCurrentPrompt(selectedPrompt);

    Alert.alert('저장 완료', `${aiNickname}의 성격이 변경되었습니다.`, [
      {
        text: '확인',
        onPress: () => navigation.goBack(),
      },
    ]);
  } catch (error: any) {
    console.error('프롬프트 저장 실패:', error);
    Alert.alert('오류', error.message || '성격 변경에 실패했습니다.');
  } finally {
    setLoading(false);
  }
};

  const promptTypes: Personality[] = [
    Personality.FRIENDLY,
    Personality.ACTIVE,
    Personality.PLEASANT,
    Personality.RELIABLE,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          {/* 큰 글씨 24 */}
          <ScaledText style={styles.headerTitle} fontSize={24}>
            프롬프트 설정
          </ScaledText>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            {/* 중간 글씨 20 */}
            <ScaledText style={styles.saveButtonText} fontSize={20}>
              저장
            </ScaledText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* 캐릭터 이미지 */}
          <View style={styles.characterContainer}>
            <View style={styles.characterPlaceholder}>
              <Icon name="person" size={80} color="#02BFDC" />
            </View>
            <ScaledText fontSize={20} style={styles.characterName}>{aiNickname}</ScaledText>
          </View>

          <ScaledText fontSize={18} style={styles.description}>
            프롬프트를 고르면{'\n'}
            {aiNickname}의 목소리를 들을 수 있어요.
          </ScaledText>

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
                  {/* 작은 글씨 18 */}
                    <View style={styles.promptItemContent}>
                    <ScaledText
                    style={[styles.promptLabel, isSelected && styles.promptLabelSelected]}
                    fontSize={18}
                  >
                        {config.label}
                      </ScaledText>
                      <Text style={[styles.promptDescription, isSelected && styles.promptDescriptionSelected]}>
                      {config.description}
                    </ScaledText>
                  </View>
                  {isSelected && (
                    <Icon name="checkmark-circle" size={24} color="#02BFDC" />
                  )}
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
    backgroundColor: '#B8E9F5',
  },
  saveButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#B8E9F5',
    borderBottomWidth: 1,
    borderBottomColor: '#B8E6EA',
  },
  backButton: {
    padding: 8,
    width: 80,
  },
  headerTitle: {
    fontSize: 18, // ScaledText가 24 기준으로 스케일 적용
    fontWeight: '600',
    color: '#2D4550',
  },
  saveButton: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  saveButtonText: {
    fontSize: 16, // ScaledText가 20 기준으로 스케일 적용
    color: '#02BFDC',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  characterContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  characterPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#A5BCC3',
  },
  description: {
    fontSize: 18, // ScaledText가 20 기준으로 스케일 적용
    fontWeight: '500',
    color: '#2D4550',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  promptList: {
    paddingHorizontal: 32,
    gap: 16,
    paddingBottom: 32,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promptItemSelected: {
    backgroundColor: '#E8F7FA',
    borderColor: '#02BFDC',
  },
  promptItemContent: {
    flex: 1,
  },
  promptLabel: {
    fontSize: 18, // ScaledText가 18 기준으로 스케일 적용(작게)
    fontWeight: '500',
    color: '#2D4550',
    marginBottom: 4,
  },
  promptLabelSelected: {
    color: '#02BFDC',
    fontWeight: '600',
  },
  promptDescription: {
    color: '#6C757D',
  },
  promptDescriptionSelected: {
    color: '#02BFDC',
  },
});

export default PromptSettings;