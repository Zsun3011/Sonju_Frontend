import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styles } from '../../styles/Onboarding';
import { onboardingStyles } from '../../styles/Template';
import ScaledText from '../../components/ScaledText';

interface CharacterTraits {
  personality: string;
  speech: string;
  emotions: string;
  interests: string[];
}

export default function CharacterSetting({ route, navigation }: any) {
  const { sonjuName } = route.params || { sonjuName: '손주' };

  const traitOptions = {
    personality: ['다정한', '활발한', '경청하는', '유머러스한'],
    speech: ['존댓말', '귀여운', '부드러운'],
    emotions: ['적당히', '평일한', '농담조금'],
    interests: ['뉴스', '요리', '운동', '취미추천'],
  };

  // 기본값: 각 카테고리의 첫 번째 항목 선택
  const [selectedTraits, setSelectedTraits] = useState<CharacterTraits>({
    personality: traitOptions.personality[0],
    speech: traitOptions.speech[0],
    emotions: traitOptions.emotions[0],
    interests: [], // 관심사는 빈 배열로 시작
  });

  // 단일 선택 (성격, 말투, 감정표현)
  const selectSingleTrait = (category: 'personality' | 'speech' | 'emotions', trait: string) => {
    setSelectedTraits(prev => ({
      ...prev,
      [category]: trait,
    }));
  };

  // 다중 선택 (관심사만)
  const toggleInterest = (interest: string) => {
    setSelectedTraits(prev => {
      const currentInterests = prev.interests;
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter(i => i !== interest),
        };
      } else {
        return {
          ...prev,
          interests: [...currentInterests, interest],
        };
      }
    });
  };

  const handleComplete = async () => {
    try {
      // 백엔드로 전송할 데이터
      const characterData = {
        name: sonjuName,
        personality: selectedTraits.personality,
        speech: selectedTraits.speech,
        emotions: selectedTraits.emotions,
        interests: selectedTraits.interests,
      };

      console.log('전송할 데이터:', characterData);

      Alert.alert('완료', '손주 캐릭터가 생성되었습니다!');
    } catch (error) {
      console.error('캐릭터 생성 오류:', error);
      Alert.alert('오류', '캐릭터 생성에 실패했습니다.');
    }
  };

    // 성격, 말투, 감정표현은 단일 선택
  const renderSingleSelectSection = (
    title: string,
    category: 'personality' | 'speech' | 'emotions',
    options: string[]
  ) => (
    <View style={styles.characterSection}>
      <ScaledText fontSize={20} style={styles.sectionTitle}>
        {title}
      </ScaledText>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedTraits[category] === option;
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
              ]}
              onPress={() => selectSingleTrait(category, option)}
            >
              <ScaledText
                fontSize={16}
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option}
              </ScaledText>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.divider} />
    </View>
  );

    //관심사는 복수 선택 가능
  const renderMultiSelectSection = (
    title: string,
    options: string[]
  ) => (
    <View style={styles.characterSection}>
      <ScaledText fontSize={20} style={styles.sectionTitle}>
        {title}
      </ScaledText>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedTraits.interests.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
              ]}
              onPress={() => toggleInterest(option)}
            >
              <ScaledText
                fontSize={16}
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option}
              </ScaledText>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingVertical: 90 }}>
        <View style={{ alignItems: 'center', marginBottom: 30}}>
          <ScaledText fontSize={32} style={styles.title}>
            이제 {sonjuName}의 성격을{'\n'}정해주세요!
          </ScaledText>
          <Image
            source={require('../../../assets/images/sonjusmile.png')}
            style={styles.sonju}
            resizeMode="contain"
          />
        </View>

        {renderSingleSelectSection('성격', 'personality', traitOptions.personality)}
        {renderSingleSelectSection('말투', 'speech', traitOptions.speech)}
        {renderSingleSelectSection('감정표현', 'emotions', traitOptions.emotions)}
        {renderMultiSelectSection('관심사', traitOptions.interests)}

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <TouchableOpacity
            style={onboardingStyles.button}
            onPress={handleComplete}
          >
            <ScaledText fontSize={18} style={onboardingStyles.buttonText}>
              완료
            </ScaledText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}