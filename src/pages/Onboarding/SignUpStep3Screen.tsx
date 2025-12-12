import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUser, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { apiClient } from '../../api/config';

function verify(
  name: string,
  poolData: { UserPoolId: string; ClientId: string },
  code: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: name,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        const msg = err.message || '';
        console.error('인증번호 확인 실패:', msg);

        // 이미 인증된 계정이면 성공으로 간주
        if (msg.includes('Current status is CONFIRMED') || msg.includes('cannot be confirmed')) {
          console.log('이미 인증된 사용자 → 정상 처리로 간주');
          resolve(true);
          return;
        }

        reject(new Error(msg || '인증번호 확인 실패'));
        return;
      }

      console.log('인증번호 확인 성공:', result);
      resolve(true);
    });
  });
}

function resendVerificationCode(
  name: string,
  poolData: { UserPoolId: string; ClientId: string }
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: name,
      Pool: userPool,
    });

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        console.error('인증번호 재전송 실패:', err);
        reject(new Error(err.message || '인증번호 재전송 실패'));
        return;
      }

      console.log('인증번호 재전송 성공:', result);
      resolve(true);
    });
  });
}

interface UserInfo {
  cognito_id: string;
  name: string;
  gender: string;
  birthdate: string;
  phone_number: string;
  point: number;
}

function getUserInfo(
  name: string,
  password: string,
  poolData: { UserPoolId: string; ClientId: string }
): Promise<UserInfo> {
  return new Promise((resolve, reject) => {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: name,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        cognitoUser.getUserAttributes((attrErr, attributes) => {
          if (attrErr) {
            console.error('사용자 정보 가져오기 실패:', attrErr);
            reject(new Error(attrErr.message || '사용자 정보 가져오기 실패'));
            return;
          }

          const attrMap: any = {};
          attributes?.forEach(a => {
            attrMap[a.getName()] = a.getValue();
          });

          console.log('사용자 정보 가져오기 성공');
          resolve({
            cognito_id: attrMap.sub,
            name: attrMap.name,
            gender: attrMap.gender,
            birthdate: attrMap.birthdate,
            phone_number: attrMap.phone_number,
            point: 0
          });
        });
      },
      onFailure: (err) => {
        console.error('인증 실패:', err);
        reject(new Error(err.message || '인증 실패'));
      }
    });
  });
}

export default function SignUpStep3Screen({ route, navigation }: any) {
  const { phone, poolData, password } = route.params || {};
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await resendVerificationCode('+82' + phone.substring(1), poolData);
      Alert.alert('성공', '인증번호가 재전송되었습니다.\n전화번호를 확인해주세요.');
    } catch (err: any) {
      console.error('인증번호 재전송 실패:', err);
      Alert.alert('오류', err.message || '인증번호 재전송에 실패했습니다');
    } finally {
      setIsResending(false);
    }
  };

  const registerToBackend = async (userInfo: UserInfo) => {
    console.log('백엔드 회원가입 요청 시작...', userInfo);

    try {
      const response = await apiClient.post('/auth/signup', userInfo);
      console.log('백엔드 응답 상태:', response.status);
      console.log('백엔드 응답 데이터:', response.data);

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('백엔드 회원가입 실패:', error);

      if (error.response) {
        // 서버에서 응답을 받은 경우
        const status = error.response.status;
        const errorData = error.response.data;

        console.error('백엔드 회원가입 실패 - 상태:', status);
        console.error('백엔드 회원가입 실패 - 상세:', errorData);

        // 이미 등록된 전화번호인 경우
        if (status === 400 && errorData?.detail?.includes('이미 등록된 전화번호')) {
          return {
            success: false,
            isDuplicate: true,
            message: '이미 가입된 전화번호입니다.'
          };
        }

        return {
          success: false,
          message: `서버 오류가 발생했습니다.\n상태: ${status}\n상세: ${JSON.stringify(errorData)}`
        };
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error('서버 응답 없음:', error.request);
        return {
          success: false,
          message: '서버와 연결할 수 없습니다.\n네트워크 연결을 확인해주세요.'
        };
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('요청 설정 오류:', error.message);
        return {
          success: false,
          message: error.message || '알 수 없는 오류가 발생했습니다.'
        };
      }
    }
  };

  const handleNext = async () => {
    // 유효성 검사
    if (!code || code.length !== 6) {
      Alert.alert('오류', '인증번호 6자리를 입력해주세요');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. 인증번호 확인
      console.log('인증번호 확인 시작...');
      const verified = await verify('+82' + phone.substring(1), poolData, code);

      if (!verified) {
        Alert.alert('오류', '전화번호 인증에 실패했습니다');
        setCode('');
        return;
      }

      console.log('인증번호 확인 성공');

      // 2. Cognito에서 사용자 정보 가져오기
      console.log('사용자 정보 가져오기 시작...');
      const userInfo = await getUserInfo('+82' + phone.substring(1), password, poolData);
      console.log('Cognito 사용자 정보:', userInfo);

      // 3. 백엔드 서버에 회원가입 요청
      const result = await registerToBackend(userInfo);

      if (result.success) {
        console.log('회원가입 완료');
        Alert.alert('성공', '회원가입이 완료되었습니다!', [
          { text: '확인', onPress: () => navigation.navigate('Login') }
        ]);
      } else if (result.isDuplicate) {
        Alert.alert(
          '이미 가입된 계정',
          '이미 가입된 전화번호입니다.\n로그인 화면으로 이동하시겠습니까?',
          [
            { text: '취소', style: 'cancel' },
            { text: '로그인', onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        Alert.alert('회원가입 실패', result.message);
      }

    } catch (err: any) {
      console.error('회원가입 에러:', err);

      // Invalid code 에러 = 이미 인증 완료된 사용자일 가능성
      if (err.message && (
        err.message.includes('Invalid code') ||
        err.message.includes('InvalidParameterException') ||
        err.message.includes('ExpiredCodeException')
      )) {
        console.log('이미 인증된 사용자일 가능성 또는 만료된 코드 - 로그인 시도');

        try {
          // 이미 인증된 경우 로그인으로 사용자 정보 가져오기
          const userInfo = await getUserInfo('+82' + phone.substring(1), password, poolData);
          console.log('Cognito 사용자 정보:', userInfo);

          // 백엔드 서버에 회원가입 요청
          const result = await registerToBackend(userInfo);

          if (result.success) {
            console.log('회원가입 완료');
            Alert.alert('성공', '회원가입이 완료되었습니다!', [
              { text: '확인', onPress: () => navigation.navigate('Login') }
            ]);
          } else if (result.isDuplicate) {
            Alert.alert(
              '이미 가입된 계정',
              '이미 가입된 전화번호입니다.\n로그인 화면으로 이동하시겠습니까?',
              [
                { text: '취소', style: 'cancel' },
                { text: '로그인', onPress: () => navigation.navigate('Login') }
              ]
            );
          } else {
            Alert.alert('회원가입 실패', result.message);
          }

          return;
        } catch (retryErr: any) {
          console.error('재시도 실패:', retryErr);
          Alert.alert('오류', retryErr.message || '회원가입에 실패했습니다');
          return;
        }
      }

      // 인증번호 입력 초기화
      setCode('');

      // 인증번호 오류일 경우 재전송 옵션 제공
      if (err.message && (
        err.message.includes('인증번호') ||
        err.message.includes('Code mismatch') ||
        err.message.includes('CodeMismatchException')
      )) {
        Alert.alert(
          '인증 실패',
          '인증번호가 일치하지 않습니다.\n다시 입력하거나 인증번호를 재전송하세요.',
          [
            { text: '다시 입력', style: 'cancel' },
            { text: '재전송', onPress: handleResendCode }
          ]
        );
      } else {
        Alert.alert('오류', err.message || '오류가 발생했습니다');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>인증번호를 입력해주세요</Text>

      {phone && (
        <Text style={s.subtitle}>
          {phone}로 전송된 인증번호
        </Text>
      )}

      <TextInput
        style={s.input}
        placeholder="인증번호 6자리"
        value={code}
        onChangeText={(text) => setCode(text.slice(0, 6))}
        keyboardType="number-pad"
        maxLength={6}
        editable={!isSubmitting}
      />

      <TouchableOpacity
        style={s.button}
        onPress={handleNext}
        disabled={isSubmitting}
      >
        <Text style={s.buttonText}>
          {isSubmitting ? '처리 중...' : '다음으로'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.secondaryButton}
        onPress={handleResendCode}
        disabled={isResending || isSubmitting}
      >
        <Text style={s.secondaryButtonText}>
          {isResending ? '전송 중...' : '인증번호 재전송'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}