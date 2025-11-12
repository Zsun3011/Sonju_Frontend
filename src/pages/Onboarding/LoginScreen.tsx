import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, } from 'amazon-cognito-identity-js'


const myPoolData = {
    UserPoolId: 'ap-northeast-1_Frx61b697',
    ClientId: '4mse47h6vme901667vuqb185vo',
};

function logIn(
  name: string,
  password: string,
  poolData: { UserPoolId: string; ClientId: string }
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const userPool = new CognitoUserPool(poolData);

    const authDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: name,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('Cognito 로그인 성공:', result);
        resolve(true);
      },
      onFailure: (err) => {
        console.error('Cognito 로그인 실패:', err);
        reject(new Error(err.message || '로그인 실패'));
      },
      newPasswordRequired: () => {
        console.error('새 비밀번호가 필요합니다');
        reject(new Error('새 비밀번호 설정이 필요합니다'));
      },
    });
  });
}




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

    // 로그인 처리
    setLoading(true);
    try {
      // 1. Cognito 로그인
      await logIn('+82' + phone.substring(1), password, myPoolData);
      console.log('Cognito 로그인 성공:', { phone });

      // 2. 백엔드에서 사용자 프로필 확인 (손주 정보 설정 여부 확인)
      const profileResponse = await fetch(`http://ec2-15-165-129-83.ap-northeast-2.compute.amazonaws.com:8002/user/profile?phone=${encodeURIComponent('+82' + phone.substring(1))}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!profileResponse.ok) {
        throw new Error('프로필 조회 실패');
      }

      const userProfile = await profileResponse.json();
      console.log('사용자 프로필:', userProfile);

      // 3. 손주 정보 설정 여부에 따라 분기
      if (userProfile.hasSonjuInfo || userProfile.has_sonju_info) {
        // 손주 정보가 이미 설정된 경우 - 메인 화면으로
        // AsyncStorage에 로그인 정보 저장
        await AsyncStorage.setItem('userToken', 'logged_in');
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        await AsyncStorage.setItem('userPhone', phone);

        // RootNavigator가 자동으로 감지해서 Main 화면으로 전환됩니다
        Alert.alert('로그인 성공', '환영합니다!');
      } else {
        // 손주 정보가 없는 경우 - 설정 단계로
        await AsyncStorage.setItem('userToken', 'logged_in');
        await AsyncStorage.setItem('userPhone', phone);
        navigation.navigate('SignUpSuccess');
      }

    } catch (error: any) {
      console.error('로그인 실패:', error);

      // 에러 메시지 분기 처리
      if (error.message === '프로필 조회 실패') {
        // 프로필 조회 실패 시에도 일단 손주 정보 설정 단계로
        Alert.alert('알림', '처음 로그인하시는군요! 손주 정보를 설정해주세요.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('SignUpSuccess')
          }
        ]);
      } else {
        Alert.alert('로그인 실패', '전화번호 또는 비밀번호가 일치하지 않습니다');
      }
    } finally {
      setLoading(false);
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