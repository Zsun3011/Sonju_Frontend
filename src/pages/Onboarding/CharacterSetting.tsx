// src/pages/Onboarding/CharacterSetting.tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../styles/Onboarding';
import { onboardingStyles } from '../../styles/Template';
import ScaledText from '../../components/ScaledText';
import { Personality, PersonalityLabels } from '../../types/ai';
import { aiProfileAPI } from '../../services/aiProfile';

export default function CharacterSetting({ route, navigation }: any) {
  const { sonjuName } = route.params || { sonjuName: '손주' };

  const [selectedPersonality, setSelectedPersonality] = useState<Personality>(Personality.FRIENDLY);
  const [loading, setLoading] = useState(false);

  const personalityOptions: Array<{
    value: Personality;
    label: string;
    description: string;
  }> = [
    {
      value: Personality.FRIENDLY,
      label: PersonalityLabels[Personality.FRIENDLY],
      description: '따뜻하고 친근한 대화',
    },
    {
      value: Personality.ACTIVE,
      label: PersonalityLabels[Personality.ACTIVE],
      description: '에너지 넘치는 대화',
    },
    {
      value: Personality.PLEASANT,
      label: PersonalityLabels[Personality.PLEASANT],
      description: '유쾌하고 재미있는 대화',
    },
    {
      value: Personality.RELIABLE,
      label: PersonalityLabels[Personality.RELIABLE],
      description: '믿음직한 대화',
    },
  ];

  const handleComplete = async () => {
    try {
      setLoading(true);

      // AI 프로필 생성
      await aiProfileAPI.createAiProfile({
        nickname: sonjuName,
        personality: selectedPersonality,
      });

      console.log('✅ AI 프로필 생성 성공:', {
        nickname: sonjuName,
        personality: selectedPersonality,
      });

      // 온보딩 완료 플래그 저장
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

      Alert.alert(
        '완료',
        `${sonjuName} 캐릭터가 생성되었습니다!`,
        [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('Main');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ 캐릭터 생성 오류:', error);
      Alert.alert('오류', error.message || '캐릭터 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingVertical: 90 }}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <ScaledText fontSize={32} style={styles.title}>
            이제 {sonjuName}의 성격을{'\n'}정해주세요!
          </ScaledText>
          <Image
            source={require('../../../assets/images/sonjusmile.png')}
            style={styles.sonju}
            resizeMode="contain"
          />
        </View>

        {/* 성격 선택 */}
        <View style={styles.characterSection}>
          <ScaledText fontSize={20} style={styles.sectionTitle}>
            성격
          </ScaledText>
          <View style={styles.optionsContainer}>
            {personalityOptions.map((option) => {
              const isSelected = selectedPersonality === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedPersonality(option.value)}
                >
                  <ScaledText
                    fontSize={16}
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </ScaledText>
                  <ScaledText
                    fontSize={12}
                    style={[
                      styles.optionDescription,
                      isSelected && styles.optionDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </ScaledText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 완료 버튼 */}
        <View style={{ paddingHorizontal: 20, marginTop: 40 }}>
          <TouchableOpacity
            style={[
              onboardingStyles.button,
              loading && { backgroundColor: '#CED4DA' },
            ]}
            onPress={handleComplete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <ScaledText fontSize={18} style={onboardingStyles.buttonText}>
                완료
              </ScaledText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}