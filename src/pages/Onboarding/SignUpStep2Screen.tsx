import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { authAPI } from '../../api/auth';

export default function SignUpStep2Screen({ route, navigation }: any) {
  const { name, gender, birthDate, phone } = route.params || {};

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    // 비밀번호 유효성 검사
    if (!password || !passwordConfirm) {
      Alert.alert('오류', '비밀번호를 입력해주세요');
      return;
    }

    if (password.length < 8) {
      Alert.alert('오류', '비밀번호는 최소 8자리 이상이어야 합니다');
      return;
    }

    // 비밀번호 강도 검사 (Cognito 요구사항)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      Alert.alert(
        '오류',
        '비밀번호는 대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해야 합니다'
      );
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다');
      return;
    }

    // Cognito 회원가입 요청 및 인증번호 발송
    setLoading(true);
    try {
      const response = await authAPI.signUpWithCognito({
        name,
        gender,
        birthDate,
        phone,
        password,
      });

      if (response.success) {
        Alert.alert('성공', '인증번호가 발송되었습니다', [
          {
            text: '확인',
            onPress: () =>
              navigation.navigate('SignUpStep3', {
                name,
                gender,
                birthDate,
                phone,
                password,
              }),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('오류', error.message || '회원가입 요청에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container1}>
      <Text style={s.title}>비밀번호를{'\n'}설정해주세요</Text>

      <Text style={s.passwordGuide}>
        • 8자리 이상{'\n'}
        • 대문자, 소문자, 숫자, 특수문자 포함
      </Text>

      <TextInput
        style={s.input}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={s.input}
        placeholder="비밀번호를 다시 입력하세요"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
      />

      <TouchableOpacity style={s.button} onPress={handleNext} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.buttonText}>인증번호 받기</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}