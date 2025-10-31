import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useChat } from '../../store/ChatContext';
import { PromptSettings } from '../../types/chat';
import { chatStyles as s } from '../../styles/ChatStyles';

export default function PromptSettingPage({ navigation }: any) {
  const { promptSettings, updatePromptSettings } = useChat();
  const [settings, setSettings] = useState<PromptSettings>(promptSettings);

  const handleSave = () => {
    updatePromptSettings(settings);
    navigation.goBack();
  };

  const toggleInterest = (interest: string) => {
    setSettings(prev => {
      const interests = prev.interests.includes(interest as any)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest as any];
      return { ...prev, interests };
    });
  };

  return (<ScrollView style={s.settingContainer}>
      {/* 헤더 */}
      <View style={s.settingHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={s.settingTitle}>프롬프트 설정</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={s.saveButton}>저장</Text>
        </TouchableOpacity>
      </View>

      {/* 성격 */}
      <View style={s.settingSection}>
        <Text style={s.sectionTitle}>성격</Text>
        <View style={s.optionGrid}>
          {['다정한', '활발한', '경청하는', '유머러스한'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                s.optionButton,
                settings.personality === option && s.optionButtonActive
              ]}
              onPress={() => setSettings(prev => ({ ...prev, personality: option as any }))}
            >
              <Text style={[
                s.optionText,
                settings.personality === option && s.optionTextActive
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 말투 */}
      <View style={s.settingSection}>
        <Text style={s.sectionTitle}>말투</Text>
        <View style={s.optionGrid}>
          {['존댓말', '귀여운', '부드러운'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                s.optionButton,
                settings.tone === option && s.optionButtonActive
              ]}
              onPress={() => setSettings(prev => ({ ...prev, tone: option as any }))}
            >
              <Text style={[
                s.optionText,
                settings.tone === option && s.optionTextActive
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 감정표현 */}
      <View style={s.settingSection}>
        <Text style={s.sectionTitle}>감정표현</Text>
        <View style={s.optionGrid}>
          {['적당히', '평범한', '농담조금', '풍부하게'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                s.optionButton,
                settings.emotionalExpression === option && s.optionButtonActive
              ]}
              onPress={() => setSettings(prev => ({ ...prev, emotionalExpression: option as any }))}
            >
              <Text style={[
                s.optionText,
                settings.emotionalExpression === option && s.optionTextActive
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 관심사 (다중 선택) */}
      <View style={s.settingSection}>
        <Text style={s.sectionTitle}>관심사</Text>
        <View style={s.optionGrid}>
          {['뉴스', '요리', '운동', '취미추천'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                s.optionButton,
                settings.interests.includes(option as any) && s.optionButtonActive
              ]}
              onPress={() => toggleInterest(option)}
            >
              {settings.interests.includes(option as any) && (
                <Text style={s.checkmark}>✓</Text>
              )}
              <Text style={[
                s.optionText,
                settings.interests.includes(option as any) && s.optionTextActive
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}