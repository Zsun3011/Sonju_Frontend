import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, LogBox } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUser, CognitoUserPool, AuthenticationDetails, } from 'amazon-cognito-identity-js';


function verify(name, poolData, code) {
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
            resolve(true);

        });
    });
}

function getUserInfo(name, password, poolData) {
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
                        console.error(attrErr);
                        return reject(attrErr);
                    }
                    const attrMap: any = {};
                    attributes.forEach(a => { attrMap[a.getName()] = a.getValue(); });

                    return resolve({
                        cognito_id: attrMap.sub,
                        name: attrMap.name,
                        gender:attrMap.gender,
                        birthdate: attrMap.birthdate,
                        phone_number: attrMap.phone_number
                    });
                });
            },
            onFailure: (err) => reject(err)
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
            const userInfo = await getUserInfo('+82' + phone.substring(1), tempPassword, poolData);
            console.log(userInfo);
            const response = await fetch("http://ec2-13-125-2-245.ap-northeast-2.compute.amazonaws.com:8000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInfo)
            });
            console.log(response);
            if (!response.ok) {
                const error = await response.json();
                console.error(error.detail);
                Alert.alert('회원가입 실패');
                return;
            }
        } catch (err) {
            console.error(err);
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