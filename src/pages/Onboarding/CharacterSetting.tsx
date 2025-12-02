// src/pages/Onboarding/CharacterSetting.tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../styles/Onboarding';
import { onboardingStyles } from '../../styles/Template';
import ScaledText from '../../components/ScaledText';
import { apiClient } from '../../api/config';

// Personality 타입 정의
enum Personality {
  FRIENDLY = 'FRIENDLY',
  ACTIVE = 'ACTIVE',
  PLEASANT = 'PLEASANT',
  RELIABLE = 'RELIABLE',
}

const PersonalityLabels = {
  [Personality.FRIENDLY]: '다정한',
  [Personality.ACTIVE]: '활발한',
  [Personality.PLEASANT]: '유쾌한',
  [Personality.RELIABLE]: '믿음직한',
};

export default function CharacterSetting({ route, navigation }: any) {
  const { sonjuName } = route.params || { sonjuName: '손주' };

  const [selectedPersonality, setSelectedPersonality] = useState<Personality>(Personality.FRIENDLY);
  const [loading, setLoading] = useState(false);

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

  const handleComplete = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // 1. accessToken 확인
      const token = await AsyncStorage.getItem('accessToken');
      console.log('🔍 [CharacterSetting] 현재 accessToken:', token ? '존재함' : '없음');

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

      // 2. AI 프로필 생성 데이터 준비 (personality를 소문자로 변환)
      const aiProfileData = {
        nickname: sonjuName,
        personality: selectedPersonality.toLowerCase(), // API는 소문자 요구
      };

      console.log('📤 [CharacterSetting] 전송할 데이터:', aiProfileData);

      // 3. 백엔드 API 호출 - AI 프로필 생성
      try {
        const response = await apiClient.post('/ai', aiProfileData);
        console.log('✅ [CharacterSetting] AI 프로필 생성 성공:', response.data);

        // 생성된 프로필 저장
        await AsyncStorage.setItem('aiProfile', JSON.stringify(response.data));

      } catch (apiError: any) {
        console.error('❌ [CharacterSetting] API 호출 에러:', apiError);
        console.error('📋 [CharacterSetting] 에러 상세:', {
          status: apiError.response?.status,
          data: apiError.response?.data,
          message: apiError.message
        });

        // 401: 인증 오류
        if (apiError.response?.status === 401) {
          Alert.alert('로그인 필요', '로그인 세션이 만료되었습니다.', [
            {
              text: '확인',
              onPress: async () => {
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('hasCompletedOnboarding');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              },
            },
          ]);
          return;
        }

        // 400 또는 이미 존재하는 프로필
        if (apiError.response?.status === 400 ||
            apiError.response?.data?.detail?.includes('이미 존재')) {
          console.log('ℹ️ [CharacterSetting] AI 프로필이 이미 존재 - 기존 프로필 조회');
          try {
            const existingProfile = await apiClient.get('/ai/me');
            await AsyncStorage.setItem('aiProfile', JSON.stringify(existingProfile.data));
            console.log('✅ [CharacterSetting] 기존 프로필 저장 완료');
          } catch (fetchError) {
            console.error('❌ [CharacterSetting] 기존 프로필 조회 실패:', fetchError);
          }
        }
        // 422: 유효성 검증 실패
        else if (apiError.response?.status === 422) {
          const errorDetail = apiError.response?.data?.detail;
          console.error('⚠️ [CharacterSetting] 유효성 검증 실패:', errorDetail);

          Alert.alert(
            '입력 오류',
            '입력한 정보가 올바르지 않습니다.\n다시 시도해주세요.',
            [{ text: '확인' }]
          );
          return;
        }
        // 기타 에러
        else {
          throw apiError;
        }
      }

      // 4. 온보딩 완료 플래그 저장
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      console.log('✅ [CharacterSetting] 온보딩 완료 플래그 저장');

      // 5. 저장 후 상태 확인
      const onboardingStatus = await AsyncStorage.getItem('hasCompletedOnboarding');
      const tokenCheck = await AsyncStorage.getItem('accessToken');
      const profileCheck = await AsyncStorage.getItem('aiProfile');

      console.log('🔍 [CharacterSetting] 저장 후 상태 확인:', {
        hasCompletedOnboarding: onboardingStatus,
        accessToken: tokenCheck ? '존재함' : '없음',
        aiProfile: profileCheck ? '존재함' : '없음'
      });

      console.log(`🎉 [CharacterSetting] ${sonjuName} 생성 완료!`);
      console.log('✅ [CharacterSetting] RootNavigator가 자동으로 Main 화면으로 전환합니다');

      // RootNavigator가 폴링을 통해 자동으로 화면 전환
      // Alert나 navigation.navigate 없이 자연스러운 전환

    } catch (error: any) {
      console.error('❌ [CharacterSetting] 예상치 못한 오류:', error);
      Alert.alert(
        '오류',
        error.message || 'AI 프로필 생성에 실패했습니다.\n잠시 후 다시 시도해주세요.',
        [{ text: '확인' }]
      );
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                      <ScaledText fontSize={10} style={{ color: '#FF6B6B', fontWeight: 'bold', marginLeft: 4 }}>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#FFF" />
                <ScaledText fontSize={18} style={[onboardingStyles.buttonText, { marginLeft: 8 }]}>
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