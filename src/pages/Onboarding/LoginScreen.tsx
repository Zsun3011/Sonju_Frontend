import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 전화번호 포맷팅 함수 (숫자만 추출)
  const formatPhone = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    return numbers.slice(0, 11);
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setPhone(formatted);
  };

  const handleLogin = async () => {
    // 유효성 검사
    if (!phone || !password) {
      Alert.alert('오류', '전화번호와 비밀번호를 입력해주세요');
      return;
    }

    // 전화번호 형식 검사
    if (phone.length !== 11 || !phone.startsWith('010')) {
      Alert.alert('오류', '올바른 전화번호를 입력해주세요\n(010으로 시작하는 11자리)');
      return;
    }

    // 비밀번호 길이 확인
    if (password.length < 6) {
      Alert.alert('오류', '비밀번호는 최소 6자리 이상입니다');
      return;
    }
  };

  return (
    <View style={s.container1}>
      <Text style={s.title}>로그인</Text>
      
      <TextInput
        style={s.input}
        placeholder="01012345678"
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="number-pad"
        maxLength={11}
        editable={!loading}
      />
      
      <TextInput
        style={s.input}
        placeholder="비밀번호를 입력하세요"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={s.smallButton} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.buttonText}>로그인</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}