import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, } from 'amazon-cognito-identity-js'


const myPoolData = {
    UserPoolId: 'ap-northeast-1_Frx61b697',
    ClientId: '4mse47h6vme901667vuqb185vo',
};

function logIn(name, password, poolData) {
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
                // 작업 필요
                console.log(result);
                return resolve(true);
            },
            onFailure: (err) => {
                console.error(err);
                return reject(false);
            },
            newPasswordRequired: () => {
                console.error("newPasswordRequired");
                return reject(false);
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
      // TODO: 백엔드 API 호출
      const signed  = await logIn('+82' + phone.substring(1), password, myPoolData);
      if (!signed) {
        Alert.alert('에러', '로그인에 실패했습니다');
        console.err("에러");
        return;
      }
      // 임시: 로그인 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
      
      console.log('로그인 성공:', { phone });
      
      // SignUpSuccess 화면으로 이동
      navigation.navigate('SignUpSuccess');
      
    } catch (error: any) {
      console.error('로그인 실패:', error);
      Alert.alert('로그인 실패', '전화번호 또는 비밀번호가 일치하지 않습니다');
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