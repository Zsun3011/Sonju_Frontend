// src/pages/Onboarding/LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CognitoUser, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js';
import ScaledText from '../../components/ScaledText';
import { API_BASE_URL } from '../../api/config';
import { useAuth } from '../../contexts/AuthContext';

const poolData = {
  UserPoolId: 'ap-northeast-1_Frx61b697',
  ClientId: '4mse47h6vme901667vuqb185vo',
};

/**
 * Cognito 토큰 타입
 */
interface CognitoTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * Cognito 로그인하여 모든 토큰 받기
 */
function cognitoLogin(
  phoneNumber: string,
  password: string
): Promise<CognitoTokens> {
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
        // ⭐ 3개 토큰 모두 받기
        const idToken = result.getIdToken().getJwtToken();
        const accessToken = result.getAccessToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        
        console.log('✅ Cognito 로그인 성공');
        console.log('  - ID Token 길이:', idToken.length);
        console.log('  - Access Token 길이:', accessToken.length);
        console.log('  - Refresh Token 길이:', refreshToken.length);
        console.log('');
        console.log('📋 토큰 용도:');
        console.log('  - ID Token → /auth/login 검증용');
        console.log('  - Access Token → 모든 API 호출용');
        console.log('  - Refresh Token → 토큰 갱신용');
        
        resolve({
          idToken,
          accessToken,
          refreshToken
        });
      },
      onFailure: (err) => {
        console.error('❌ Cognito 로그인 실패:', err);
        reject(err);
      }
    });
  });
}

/**
 * 백엔드 로그인 검증 (ID Token 사용)
 */
async function verifyLoginWithBackend(idToken: string): Promise<void> {
  console.log('🔐 백엔드 로그인 검증');
  console.log('  - URL:', `${API_BASE_URL}/auth/login`);
  console.log('  - 사용 토큰: ID Token');
  console.log('');
  
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: idToken,
      }),
    }
  );

  console.log('📥 백엔드 응답 상태:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ 백엔드 로그인 검증 실패');
    console.error('  - 상태 코드:', response.status);
    console.error('  - 응답:', errorText);
    
    throw new Error(`로그인 검증 실패 (상태: ${response.status}): ${errorText}`);
  }

  const responseText = await response.text();
  console.log('📥 백엔드 응답:', responseText);
  console.log('✅ 백엔드 로그인 검증 완료');
}

const LoginScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshAuth } = useAuth();

  // 전화번호 포맷팅
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
  if (!phoneNumber || !password) {
    Alert.alert('오류', '전화번호와 비밀번호를 입력해주세요.');
    return;
  }

  if (phoneNumber.length !== 11 || !phoneNumber.startsWith('010')) {
    Alert.alert('오류', '올바른 전화번호를 입력해주세요\n(010으로 시작하는 11자리)');
    return;
  }

  try {
    setLoading(true);

    const formattedPhone = '+82' + phoneNumber.substring(1);

    const tokens = await cognitoLogin(formattedPhone, password);
    await verifyLoginWithBackend(tokens.idToken);
    
    await AsyncStorage.setItem('idToken', tokens.idToken);
    await AsyncStorage.setItem('accessToken', tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
    await AsyncStorage.setItem('userToken', tokens.accessToken);

    const aiProfile = await getAiProfile();

    if (aiProfile) {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      await AsyncStorage.setItem('aiProfile', JSON.stringify(aiProfile));
  
      console.log('✅ 로그인 정보 저장 완료');
      console.log(`🎉 환영합니다, ${aiProfile.nickname}!`);
  
      // ⭐ 0.5초 딜레이 후 새로고침
      setTimeout(async () => {
        await refreshAuth();
      }, 500);
      // ⭐ 자동으로 Main으로 전환됨 (Alert 없음)
      
    } else {
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      await AsyncStorage.removeItem('aiProfile');
      navigation.navigate('FontSizeSelector');
    }

  } catch (error: any) {
    console.error('❌ 로그인 에러:', error.message);
    
    let errorMessage = '로그인에 실패했습니다.';
    
    if (error.code === 'NotAuthorizedException') {
      errorMessage = '전화번호 또는 비밀번호가 일치하지 않습니다.';
    } else if (error.code === 'UserNotFoundException') {
      errorMessage = '등록되지 않은 전화번호입니다.';
    } else if (error.code === 'UserNotConfirmedException') {
      errorMessage = '전화번호 인증이 완료되지 않았습니다.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    Alert.alert('로그인 실패', errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFF' }}>
      <ScaledText fontSize={24} style={{ fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
        로그인
      </ScaledText>

      <ScaledText fontSize={14} style={{ color: '#666', marginBottom: 8 }}>
        전화번호
      </ScaledText>
      <TextInput
        placeholder="01012345678"
        value={phoneNumber}
        onChangeText={handlePhoneChange}
        keyboardType="number-pad"
        maxLength={11}
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 16,
        }}
      />

      <ScaledText fontSize={14} style={{ color: '#666', marginBottom: 8 }}>
        비밀번호
      </ScaledText>
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

