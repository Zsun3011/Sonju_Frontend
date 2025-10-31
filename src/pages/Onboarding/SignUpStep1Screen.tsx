import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';

export default function SignUpStep1Screen({ navigation }: any) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');

  // 전화번호 포맷팅
  const formatPhone = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    return numbers.slice(0, 11);
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setPhone(formatted);
  };

  // 생년월일 포맷팅 (YYYYMMDD)
  const formatBirthDate = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    return numbers.slice(0, 8);
  };

  const handleBirthDateChange = (text: string) => {
    const formatted = formatBirthDate(text);
    setBirthDate(formatted);
  };

  const handleNext = () => {
    // 유효성 검사
    if (!name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요');
      return;
    }

    if (!gender) {
      Alert.alert('오류', '성별을 선택해주세요');
      return;
    }

    if (birthDate.length !== 8) {
      Alert.alert('오류', '생년월일을 8자리로 입력해주세요\n예: 19900101');
      return;
    }

    // 생년월일 유효성 검사
    const year = parseInt(birthDate.slice(0, 4));
    const month = parseInt(birthDate.slice(4, 6));
    const day = parseInt(birthDate.slice(6, 8));

    if (year < 1900 || year > new Date().getFullYear()) {
      Alert.alert('오류', '올바른 연도를 입력해주세요');
      return;
    }

    if (month < 1 || month > 12) {
      Alert.alert('오류', '올바른 월을 입력해주세요');
      return;
    }

    if (day < 1 || day > 31) {
      Alert.alert('오류', '올바른 일을 입력해주세요');
      return;
    }

    if (phone.length !== 11 || !phone.startsWith('010')) {
      Alert.alert('오류', '올바른 전화번호를 입력해주세요\n(010으로 시작하는 11자리)');
      return;
    }

    // 다음 단계로 데이터 전달
    navigation.navigate('SignUpStep2', {
      name: name.trim(),
      gender,
      birthDate,
      phone,
    });
  };

  return (
    <ScrollView contentContainerStyle={s.scrollContainer}>
      <View style={s.container1}>
        <Text style={s.title}>회원 정보를{'\n'}입력해주세요</Text>

        {/* 이름 */}
        <TextInput
          style={s.input}
          placeholder="이름을 입력하세요"
          value={name}
          onChangeText={setName}
          maxLength={20}
        />

        {/* 성별 선택 */}
        <View style={s.genderContainer}>
          <TouchableOpacity
            style={[s.genderButton, gender === 'male' && s.genderButtonActive]}
            onPress={() => setGender('male')}
          >
            <Text style={[s.genderText, gender === 'male' && s.genderTextActive]}>
              남성
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.genderButton, gender === 'female' && s.genderButtonActive]}
            onPress={() => setGender('female')}
          >
            <Text style={[s.genderText, gender === 'female' && s.genderTextActive]}>
              여성
            </Text>
          </TouchableOpacity>
        </View>

        {/* 생년월일 */}
        <TextInput
          style={s.input}
          keyboardType="number-pad"
          placeholder="생년월일 (예: 19900101)"
          value={birthDate}
          onChangeText={handleBirthDateChange}
          maxLength={8}
        />

        {/* 전화번호 */}
        <TextInput
          style={s.input}
          keyboardType="number-pad"
          placeholder="전화번호 (예: 01012345678)"
          value={phone}
          onChangeText={handlePhoneChange}
          maxLength={11}
        />

        <TouchableOpacity style={s.button} onPress={handleNext}>
          <Text style={s.buttonText}>다음으로</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}