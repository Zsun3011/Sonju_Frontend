import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { onboardingStyles as s } from '../../style/Template';

export default function AddChildInfoScreen({ route, navigation }: any) {
  // 이전 화면에서 전달받은 데이터
  const { phone, name, verificationCode } = route.params || {};
  
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSignUp = () => {
    // 1. 비밀번호 입력 확인
    if (!password || !passwordConfirm) {
      Alert.alert('오류', '비밀번호를 입력해주세요');
      return;
    }

    // 2. 비밀번호 길이 확인 (최소 6자리)
    if (password.length < 6) {
      Alert.alert('오류', '비밀번호는 최소 6자리 이상이어야 합니다');
      return;
    }

    // 3. 비밀번호 일치 확인
    if (password !== passwordConfirm) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다');
      return;
    }

    // 4. 최종 회원가입 데이터
    const signUpData = {
      name: name,
      phone: phone,
      verificationCode: verificationCode,
      password: password
    };

    console.log('회원가입 데이터:', signUpData);

    // TODO: 백엔드 API 호출
    // try {
    //   await authAPI.signUp(signUpData);
    //   Alert.alert('성공', '회원가입이 완료되었습니다!', [
    //     { text: '확인', onPress: () => navigation.navigate('Login') }
    //   ]);
    // } catch (error) {
    //   Alert.alert('오류', '회원가입에 실패했습니다');
    // }

    // 임시: 회원가입 완료 후 로그인 화면으로
    Alert.alert('성공', '회원가입이 완료되었습니다!', [
      { text: '확인', onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <View style={s.container1}>
      <Text style={s.title}>비밀번호를 입력해주세요</Text>
      
      <TextInput
        style={s.input}
        placeholder="사용하실 비밀번호를 입력해주세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry  // 비밀번호 숨김 처리
        autoCapitalize="none"  // 자동 대문자 변환 방지
      />
      
      <TextInput
        style={s.input}
        placeholder="비밀번호 확인을 위해 재입력해주세요"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry  // 비밀번호 숨김 처리
        autoCapitalize="none"
      />

      <TouchableOpacity style={s.smallButton} onPress={handleSignUp}>
        <Text style={s.buttonText}>회원가입 완료</Text>
      </TouchableOpacity>
    </View>
  );
}
