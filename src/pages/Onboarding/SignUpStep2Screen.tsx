import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, LogBox } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';


function verify(name, poolData, code) { // 사용자 풀 문제 해결 후 수정 필요
    return new Promise((resolve, reject) => {
        const userPool = new CognitoUserPool(poolData);

        const cognitoUser = new CognitoUser({
          Username: name,
          Pool: userPool,
        });

        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
                console.error("에러", JSON.stringify(err, null, 2));
                return reject(false);
            }
            else {
                resolve(true);
            }
        });
    });
}

export default function SignUpStep2Screen({ route, navigation }: any) {
    // Step1에서 전달받은 데이터
    const { phone, name, poolData, tempPassword } = route.params || {};
    const [code, setCode] = useState('');

    const handleNext = async () => {
        // 유효성 검사
        if (!code || code.length !== 6) {
            Alert.alert('오류', '인증번호 6자리를 입력해주세요');
            return;
        }

        // TODO: 여기서 백엔드에 인증번호 검증 API 호출
        try {
            const state = await verify('+82' + phone.substring(1), poolData, code);
            if (!state) {
                Alert.alert('오류', '전화번호 인증에 실패했습니다');
                return;
            }
            else
                Alert.alert('성공', '전화번호 인증이 완료되었습니다');
        } catch (err) {
            console.log(err);
            Alert.alert('오류', '에러가 발생했습니다');
            return;
        }
        // 다음 화면으로 데이터 전달
        navigation.navigate(
            'AddChildInfo',
            {
                phone: phone,
                name: name,
                verificationCode: code,
                poolData: poolData,
                tempPassword: tempPassword
            }
        );
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