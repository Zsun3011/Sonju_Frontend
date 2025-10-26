import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';

export default function SignUpStep2Screen({ route, navigation }: any) {
  // Step1에서 전달받은 데이터
  const { phone, name } = route.params || {};
  
  const [code, setCode] = useState('');

  const handleNext = () => {
    // 유효성 검사
    if (!code || code.length !== 6) {
      Alert.alert('오류', '인증번호 6자리를 입력해주세요');
      return;
    }

    // TODO: 여기서 백엔드에 인증번호 검증 API 호출
    // await authAPI.verifyCode(phone, code);

    // 다음 화면으로 데이터 전달
    navigation.navigate('AddChildInfo', {
      phone: phone,
      name: name,
      verificationCode: code
    });
  };

  return (
    <View style={s.container1}>
      <Text style={s.title}>인증번호를 입력해주세요</Text>
      {phone && (
        <Text style={s.maintext}>{phone}로 전송된 인증번호</Text>
      )}
      <TextInput
        style={s.input}
        keyboardType="number-pad"
        placeholder="123456"
        value={code}
        onChangeText={(text) => setCode(text.slice(0, 6))}  // 6자리 제한
        maxLength={6}
      />
      <TouchableOpacity style={s.smallButton} onPress={handleNext}>
        <Text style={s.buttonText}>다음으로</Text>
      </TouchableOpacity>
    </View>
  );
}