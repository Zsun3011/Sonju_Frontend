import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUser, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js';

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

        // ✅ 이미 인증된 계정이면 성공으로 간주
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

export default function SignUpStep2Screen({ route, navigation }: any) {
    // Step1에서 전달받은 데이터
    const { phone, poolData, tempPassword } = route.params || {};
    const [code, setCode] = useState('');
    const [isResending, setIsResending] = useState(false);

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

    const handleNext = async () => {
        // 유효성 검사
        if (!code || code.length !== 6) {
            Alert.alert('오류', '인증번호 6자리를 입력해주세요');
            return;
        }

        try {
            // 1. 인증번호 확인
            const verified = await verify('+82' + phone.substring(1), poolData, code);
            if (!verified) {
                Alert.alert('오류', '전화번호 인증에 실패했습니다');
                return;
            }

            // 2. Cognito에서 사용자 정보 가져오기
            const userInfo = await getUserInfo('+82' + phone.substring(1), tempPassword, poolData);
            console.log(userInfo);
            const response = await fetch("http://ec2-15-165-129-83.ap-northeast-2.compute.amazonaws.com:8000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInfo)
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('백엔드 회원가입 실패:', error.detail);
                Alert.alert('회원가입 실패', '서버 오류가 발생했습니다');
                return;
            }

            console.log('회원가입 완료');

            // 4. 회원가입 완료 - 손주 정보 설정으로 이동
            Alert.alert('성공', '회원가입이 완료되었습니다!', [
                {
                    text: '확인',
                    onPress: () => navigation.navigate('SignUpSuccess')
                }
            ]);

        } catch (err: any) {
            console.error('회원가입 에러:', err);

            // 인증번호 오류일 경우 재전송 옵션 제공
            if (err.message && err.message.includes('인증번호')) {
                Alert.alert(
                    '인증 실패',
                    '인증번호가 일치하지 않습니다.\n인증번호를 재전송하시겠습니까?',
                    [
                        {
                            text: '취소',
                            style: 'cancel'
                        },
                        {
                            text: '재전송',
                            onPress: handleResendCode
                        }
                    ]
                );
            } else {
                Alert.alert('오류', err.message || '오류가 발생했습니다');
            }
            return;
        }
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

                <TouchableOpacity
                    style={[s.smallButton, { backgroundColor: '#888', marginTop: 10 }]}
                    onPress={handleResendCode}
                    disabled={isResending}
                >
                    <Text style={s.buttonText}>
                        {isResending ? '전송 중...' : '인증번호 재전송'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
}