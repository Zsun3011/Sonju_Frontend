// src/pages/Onboarding/SignUpStep3Screen.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUser, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js';
import ScaledText from '../../components/ScaledText';
import { API_BASE_URL } from '../../api/config';

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

        if (msg.includes('Current status is CONFIRMED') || msg.includes('cannot be confirmed')) {
          console.log('✅ 이미 인증된 사용자 → 정상 처리로 간주');
          resolve(true);
          return;
        }

        reject(new Error(msg || '인증번호 확인 실패'));
        return;
      }

      console.log('✅ 인증번호 확인 성공:', result);
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
            console.log('✅ 인증번호 재전송 성공:', result);
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
                    attributes?.forEach(a => { attrMap[a.getName()] = a.getValue(); });

                    console.log('✅ 사용자 정보 가져오기 성공');
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
                console.error('Cognito 인증 실패:', err);
                reject(new Error(err.message || '인증 실패'));
            }
        });
    });
}

export default function SignUpStep3Screen({ route, navigation }: any) {
    const { name, phone, poolData, password } = route.params || {};
    const [code, setCode] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            await resendVerificationCode('+82' + phone.substring(1), poolData);
            Alert.alert('성공', '인증번호가 재전송되었습니다.\n전화번호를 확인해주세요.');
        } catch (err: any) {
            console.error('❌ 인증번호 재전송 실패:', err);
            Alert.alert('오류', err.message || '인증번호 재전송에 실패했습니다');
        } finally {
            setIsResending(false);
        }
    };

    const handleNext = async () => {
        if (!code || code.length !== 6) {
            Alert.alert('오류', '인증번호 6자리를 입력해주세요');
            return;
        }

        setIsProcessing(true);

        try {
            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 회원가입 프로세스 시작');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📱 전화번호:', phone);
            console.log('👤 이름:', name);
            console.log('');

            // 1. 인증번호 확인
            console.log('1️⃣ 인증번호 확인 중...');
            const verified = await verify('+82' + phone.substring(1), poolData, code);
            if (!verified) {
                Alert.alert('오류', '전화번호 인증에 실패했습니다');
                setCode('');
                setIsProcessing(false);
                return;
            }
            console.log('✅ 인증번호 확인 완료\n');

            // 2. Cognito에서 사용자 정보 가져오기
            console.log('2️⃣ Cognito 사용자 정보 가져오는 중...');
            const userInfo = await getUserInfo('+82' + phone.substring(1), password, poolData);
            console.log('✅ Cognito 사용자 정보 조회 완료');
            console.log('   - Cognito ID:', userInfo.cognito_id);
            console.log('   - 이름:', userInfo.name);
            console.log('   - 전화번호:', userInfo.phone_number);
            console.log('   - 성별:', userInfo.gender);
            console.log('   - 생년월일:', userInfo.birthdate);
            console.log('');

            // 3. 백엔드 서버에 회원가입 요청
            console.log('3️⃣ 백엔드 회원가입 요청 중...');
            console.log('   - URL:', `${API_BASE_URL}/auth/signup`);
            console.log('   - 전체 URL:', API_BASE_URL);
            console.log('   - 전송 데이터:', JSON.stringify(userInfo, null, 2));

            const signupResponse = await fetch(
                `${API_BASE_URL}/auth/signup`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userInfo),
                    }
                );

            console.log('📥 백엔드 응답 상태:', signupResponse.status);
            console.log('📥 백엔드 응답 헤더:', JSON.stringify(Object.fromEntries(signupResponse.headers.entries())));

            if (!signupResponse.ok) {
                let errorObject: any = null;
                let errorText = '';
    
                try {
                    errorText = await signupResponse.text();
                    console.log('📥 백엔드 응답 본문 (텍스트):', errorText);
        
                    errorObject = JSON.parse(errorText);
                    console.error('❌ 백엔드 회원가입 실패 (JSON):', errorObject);
                } catch (parseErr) {
                    console.error('❌ 백엔드 회원가입 실패 (TEXT):', errorText);
                    console.error('❌ JSON 파싱 실패:', parseErr);
                }

                // 404 에러 처리 추가
                if (signupResponse.status === 404) {
                    Alert.alert(
                        '오류',
                        'API 엔드포인트를 찾을 수 없습니다.\n개발자에게 문의하세요.\n\n경로: /auth/signup'
                    );
                    setIsProcessing(false);
                    return;
                }

                // 이미 등록된 전화번호인 경우
                if (signupResponse.status === 400 && 
                    (errorObject?.detail?.includes('이미 등록된') || errorText.includes('이미 등록된'))) {
                    console.log('⚠️ 이미 가입된 사용자 - 로그인 화면으로 안내\n');
                    
                    Alert.alert(
                        '이미 가입된 계정',
                        '이미 가입된 전화번호입니다.\n로그인 화면으로 이동하시겠습니까?',
                        [
                            { text: '취소', style: 'cancel' },
                            { 
                                text: '로그인', 
                                onPress: () => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    });
                                }
                            }
                        ]
                    );
                    setIsProcessing(false);
                    return;
                }

                Alert.alert(
                    '회원가입 실패', 
                    `서버 오류가 발생했습니다.\n상태: ${signupResponse.status}\n${errorText.substring(0, 100)}`
                );
                setIsProcessing(false);
                return;
            }

            console.log('✅ 백엔드 회원가입 완료\n');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🎉 회원가입 프로세스 완료!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');

            // 4. 회원가입 완료 알림 - SignUpSuccess로 이동
            setIsProcessing(false);
            Alert.alert(
                '회원가입 완료! 🎉',
                '회원가입이 완료되었습니다!',
                [
                    {
                        text: '확인',
                        onPress: () => {
                            navigation.navigate('Login');
                        },
                    },
                ]
            );

        } catch (err: any) {
            console.log('');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('❌ 회원가입 에러 발생');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('에러 메시지:', err.message);
            console.error('에러 스택:', err.stack);
            console.log('');

            setCode('');

            // 인증번호 오류
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
            setIsProcessing(false);
        }
    };

    return (
        <View style={s.container1}>
            <ScaledText fontSize={24} style={s.title}>인증번호를 입력해주세요</ScaledText>
            {phone && (
                <ScaledText fontSize={16} style={s.maintext}>{phone}로 전송된 인증번호</ScaledText>
            )}
            <TextInput
                style={s.input}
                keyboardType="number-pad"
                placeholder="123456"
                value={code}
                onChangeText={(text) => setCode(text.slice(0, 6))}
                maxLength={6}
                editable={!isProcessing}
            />
            
            <TouchableOpacity
                style={[s.smallButton, isProcessing && { backgroundColor: '#CED4DA' }]}
                onPress={handleNext}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <ScaledText fontSize={18} style={s.buttonText}>다음으로</ScaledText>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[s.smallButton, { backgroundColor: '#888', marginTop: 10 }]}
                onPress={handleResendCode}
                disabled={isResending || isProcessing}
            >
                <ScaledText fontSize={18} style={s.buttonText}>
                    {isResending ? '전송 중...' : '인증번호 재전송'}
                </ScaledText>
            </TouchableOpacity>
        </View>
    );
}