// src/pages/Onboarding/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { apiClient } from '../../api/config';

const myPoolData = {
  UserPoolId: 'ap-northeast-1_Frx61b697',
  ClientId: '4mse47h6vme901667vuqb185vo',
};

function logIn(
  name: string,
  password: string,
  poolData: { UserPoolId: string; ClientId: string }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: phoneNumber,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: phoneNumber,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        console.log('Cognito 로그인 성공');
        resolve(accessToken);
      },
      onFailure: (err) => {
        console.error('❌ Cognito 로그인 실패:', err);
        reject(err);
      }
    });
  });
}

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshAuth } = useAuth();

  const formatPhone = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    return numbers.slice(0, 11);
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setPhoneNumber(formatted);
  };

  // src/pages/Onboarding/LoginScreen.tsx

/**
 * AI 프로필 조회
 */
async function getAiProfile() {
  console.log('👤 AI 프로필 조회...');
  
  const accessToken = await AsyncStorage.getItem('accessToken');
  
  const response = await fetch(
    `${API_BASE_URL}/ai/me`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 404) {
    // AI 프로필 없음
    console.log('⚠️ AI 프로필 없음');
    return null;
  }

  if (!response.ok) {
    throw new Error('AI 프로필 조회 실패');
  }

  const data = await response.json();
  console.log('✅ AI 프로필:', data);
  
  return data;
}

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('오류', '전화번호와 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      // 1. Cognito 로그인 → accessToken 받기
      const accessToken = await logIn('+82' + phone.substring(1), password, myPoolData);
      console.log('✅ [LoginScreen] Cognito 로그인 성공');

      // 2. 즉시 axios 헤더에 토큰 설정
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      console.log('✅ [LoginScreen] API 클라이언트 헤더 설정 완료');

      // 3. AsyncStorage에 토큰 저장
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('userPhone', phone);
      console.log('✅ [LoginScreen] AsyncStorage에 토큰 저장 완료');

      // 4. AI 프로필 확인
      try {
        console.log('🔍 [LoginScreen] AI 프로필 조회 시작');
        const aiProfileResponse = await apiClient.get('/ai/me');

        console.log('✅ [LoginScreen] AI 프로필 존재:', aiProfileResponse.data);

        // AI 프로필이 있으면 저장하고 메인으로
        await AsyncStorage.setItem('aiProfile', JSON.stringify(aiProfileResponse.data));
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

        console.log('✅ [LoginScreen] 온보딩 완료 처리 - 메인으로 이동');
        Alert.alert('로그인 성공', '환영합니다!');

        // RootNavigator가 자동으로 Main으로 전환

      } catch (aiProfileError: any) {
        console.log('ℹ️ [LoginScreen] AI 프로필 없음 또는 조회 실패');

        if (aiProfileError.response?.status === 404) {
          // AI 프로필이 없는 경우 → 온보딩으로
          console.log('➡️ [LoginScreen] AI 프로필 미생성 - 온보딩으로 이동');
          navigation.navigate('SignUpSuccess');
        } else {
          // 기타 에러
          console.error('❌ [LoginScreen] AI 프로필 조회 에러:', aiProfileError);

          // 에러가 있어도 온보딩으로 보냄
          Alert.alert('알림', 'AI 프로필을 설정해주세요.', [
            {
              text: '확인',
              onPress: () => navigation.navigate('SignUpSuccess')
            }
          ]);
        }
      }

    } catch (error: any) {
      console.error('❌ [LoginScreen] 로그인 실패:', error);

      // 로그인 실패 시 토큰 정리
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userPhone');
      delete apiClient.defaults.headers.common.Authorization;

      Alert.alert('로그인 실패', '전화번호 또는 비밀번호가 일치하지 않습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container1}>
      <Text style={s.title}>로그인</Text>

      <TextInput
        placeholder="01012345678"
        value={phoneNumber}
        onChangeText={handlePhoneChange}
        keyboardType="number-pad"
        maxLength={11}
        editable={!loading}
      />

      <TextInput
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 8,
          padding: 12,
          marginBottom: 24,
          fontSize: 16,
        }}
      />

      <TouchableOpacity
        style={s.smallButton}
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#CED4DA' : '#02BFDC',
          borderRadius: 8,
          padding: 16,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <ScaledText fontSize={16} style={{ color: '#FFF', fontWeight: '600' }}>
            로그인
          </ScaledText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          console.log('✅ 회원가입 화면으로 이동');
          navigation.navigate('SignUpStep1');
        }}
        disabled={loading}
        style={{
          marginTop: 16,
          alignItems: 'center',
          padding: 12,
        }}
      >
        <ScaledText fontSize={14} style={{ color: '#02BFDC' }}>
          회원가입하기
        </ScaledText>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

