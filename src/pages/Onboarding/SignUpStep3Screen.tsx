import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { authAPI } from '../../api/auth';

export default function SignUpStep3Screen({ route, navigation }: any) {
  const { name, gender, birthDate, phone, password } = route.params || {};

  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('오류', '인증번호 6자리를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      // Cognito 인증번호 확인
      const response = await authAPI.confirmSignUp({
        phone,
        verificationCode,
      });

      if (response.success) {
        Alert.alert('성공', '회원가입이 완료되었습니다!', [
          {
            text: '확인',
            onPress: () => navigation.navigate('SignUpSuccess'),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('오류', error.message || '인증번호가 올바르지 않습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await authAPI.resendVerificationCode({ phone });
      Alert.alert('성공', '인증번호가 재발송되었습니다');
    } catch (error: any) {
      Alert.alert('오류', error.message || '인증번호 재발송에 실패했습니다');
    }
  };

  return (
    <View style={s.container1}>
      <Text style={s.title}>인증번호를{'\n'}입력해주세요</Text>

      {phone && (
        <Text style={s.subtitle}>{phone}로 전송된 인증번호를 입력하세요</Text>
      )}

      <TextInput
        style={s.input}
        keyboardType="number-pad"
        placeholder="인증번호 6자리"
        value={verificationCode}
        onChangeText={(text) => setVerificationCode(text.slice(0, 6))}
        maxLength={6}
        editable={!loading}
      />

      <TouchableOpacity style={s.button} onPress={handleVerify} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.buttonText}>회원가입 완료</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={s.resendButton} onPress={handleResendCode}>
        <Text style={s.resendButtonText}>인증번호 재발송</Text>
      </TouchableOpacity>
    </View>
  );
}