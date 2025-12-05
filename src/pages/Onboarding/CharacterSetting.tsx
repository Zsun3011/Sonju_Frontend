// src/pages/Onboarding/CharacterSetting.tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../styles/Onboarding';
import { onboardingStyles } from '../../styles/Template';
import ScaledText from '../../components/ScaledText';
import { Personality, PersonalityLabels } from '../../types/ai';
import { aiProfileAPI } from '../../services/aiProfile';
import { apiClient } from '@/api/config';
import { useAuth } from '../../contexts/AuthContext'; 

export default function CharacterSetting({ route, navigation }: any) {
  const { sonjuName } = route.params || { sonjuName: '손주' };

  const [selectedPersonality, setSelectedPersonality] = useState<Personality>(Personality.FRIENDLY);
  const [loading, setLoading] = useState(false);
    const { refreshAuth } = useAuth(); 

  const personalityOptions: Array<{
    value: Personality;
    label: string;
    description: string;
    isPremium?: boolean;
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
      isPremium: true,
    },
    {
      value: Personality.RELIABLE,
      label: PersonalityLabels[Personality.RELIABLE],
      description: '믿음직한 대화',
      isPremium: true,
    },
  ];

  // src/pages/Onboarding/CharacterSetting.tsx

const handleComplete = async () => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem('userToken');
    
    if (!token) {
      Alert.alert('로그인 필요', '로그인 정보가 없습니다.\n다시 로그인해주세요.', [
        {
          text: '확인',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]);
      return;
    }

    const createdProfile = await aiProfileAPI.createAiProfile({
      nickname: sonjuName,
      personality: selectedPersonality,
    });

    console.log('✅ AI 프로필 생성 완료:', createdProfile);

    const aiProfileData = {
      nickname: sonjuName,
      personality: selectedPersonality,
    };
    
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    await AsyncStorage.setItem('aiProfile', JSON.stringify(aiProfileData));

    console.log(`🎉 완료! ${sonjuName}이(가) 생성되었습니다!`);

    // ⭐ Alert 없이 바로 새로고침
    await refreshAuth();

    // ⭐ HomePage로 이동
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });

  } catch (error: any) {
    console.error('❌ AI 프로필 생성 에러:', error);
    
    if (error.message?.includes('로그인')) {
      Alert.alert('로그인 필요', '로그인 세션이 만료되었습니다.', [
        {
          text: '확인',
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]);
    } else if (error.message?.includes('이미 존재')) {
      Alert.alert('알림', 'AI 프로필이 이미 존재합니다.\n기존 프로필로 진행합니다.', [
        {
          text: '확인',
          onPress: async () => {
            try {
              const response = await apiClient.get('/ai/me');
              const existingProfile = response.data;

              await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
              await AsyncStorage.setItem('aiProfile', JSON.stringify(existingProfile));

              await refreshAuth();

              // ⭐ HomePage로 이동
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              });
            } catch (fetchError) {
              console.error('기존 프로필 조회 실패:', fetchError);
            }
          }
        }
      ]);
    } else {
      Alert.alert('오류', error.message || 'AI 프로필 생성에 실패했습니다.');
    }
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
              const isDisabled = option.isPremium;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                    isDisabled && { opacity: 0.4, backgroundColor: '#F0F0F0' },
                  ]}
                  onPress={() => !isDisabled && setSelectedPersonality(option.value)}
                  disabled={loading || isDisabled}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <ScaledText
                      fontSize={16}
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        isDisabled && { color: '#999' },
                      ]}
                    >
                      {option.label}
                    </ScaledText>
                    {isDisabled && (
                      <ScaledText fontSize={10} style={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                        프리미엄
                      </ScaledText>
                    )}
                  </View>
                  <ScaledText
                    fontSize={12}
                    style={[
                      styles.optionDescription,
                      isSelected && styles.optionDescriptionSelected,
                      isDisabled && { color: '#AAA' },
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color="#FFF" />
                <ScaledText fontSize={18} style={onboardingStyles.buttonText}>
                  생성 중...
                </ScaledText>
              </View>
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