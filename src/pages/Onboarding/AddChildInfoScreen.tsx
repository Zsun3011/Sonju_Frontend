import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, } from 'amazon-cognito-identity-js'

function setNewPassword(name, presentPassword, newPassword, poolData) {
    return new Promise((resolve, reject) => {
        const userPool = new CognitoUserPool(poolData);

            const authDetails = new AuthenticationDetails({
                Username: name,
                Password: presentPassword,
            });

            const cognitoUser = new CognitoUser({
                Username: name,
                Pool: userPool,
            });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: (result) => {
                    // 로그인 성공 후 세션을 가져와서 비밀번호 변경
                    cognitoUser.getSession((err, session) => {
                        if (err) return reject('sessionFailed');
                        if (!session.isValid()) return reject('sessionInvalid');

                        cognitoUser.changePassword(presentPassword, newPassword, (err, result) => {
                            if (err) return reject('changePasswordError');
                            resolve('passwordSet');
                        });
                    });
                  },
                onFailure: (err) => reject('authenticateFailed'),
            });
        });
}


export default function AddChildInfoScreen({ route, navigation }: any) {

    // 이전 화면에서 전달받은 데이터
    const { phone, name, verificationCode, poolData, tempPassword } = route.params || {};
  
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const handleSignUp = async () => {
        console.log("테스트용");
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

        /*
        // 4. 최종 회원가입 데이터
        const signUpData = {
          name: name,
          phone: phone,
          verificationCode: verificationCode,
          password: password
        };

        console.log('회원가입 데이터:', signUpData);
        */

        // TODO: 백엔드 API 호출
        try {
            const state = await setNewPassword('+82' + phone.substring(1), tempPassword, password, poolData);
            console.log('결과', state);

            switch (state) {
                case 'authenticateFailed':
                    Alert.alert('오류', '비밀번호를 설정할 수 없습니다');
                    return;
                case 'sessionFailed':
                    Alert.alert('오류', '비밀번호를 설정할 수 없습니다');
                    return;
                case 'sessionInvalid':
                    Alert.alert('오류', '비밀번호를 설정할 수 없습니다');
                    return;
                case 'changePasswordError':
                    Alert.alert('오류', '비밀번호를 설정할 수 없습니다');
                    return;
                case 'passwordSet':
                    break;
                default:
                    Alert.alert('오류', '비밀번호를 설정할 수 없습니다');
                    return;
            }
        } catch (err) {
            Alert.alert('오류', '오류가 발생했습니다');
            console.log(err);
            return;
        }


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
