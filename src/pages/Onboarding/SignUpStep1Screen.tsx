import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'ap-northeast-1_Frx61b697',
    ClientId: '4mse47h6vme901667vuqb185vo',
};

function userPoolSignUp(name, phone, password, pool) {
    return new Promise((resolve, reject) => {
        const userPool = new CognitoUserPool(pool);
        userPool.signUp(
            phone, // username
            password, // password, 임시값이라 지정 필요
            [
                // attributes
                {Name: 'phone_number', Value: phone},
                {Name: 'name', Value: name},
                {Name: 'gender', Value: 'male'}, // 임시값이라 지정 필요
                {Name: 'birthdate', Value: '1970-01-01'}], //임시값이라 지정 필요
            null, // validationData
            (err, result) => { // callback
                if (err) {
                    console.log(err);
                    return reject(false);
                }
                else {
                    resolve(true);
                }
            }
        );
    });
}

export default function SignUpStep1Screen({ navigation }: any) {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');

    const tempPassword = '1234abcdABCD@#'; // 비밀번호는 대소문자와 특수기호를 포함해야 함.
    // 전화번호 포맷팅 함수 (숫자만 추출)
    const formatPhone = (text: string) => {
        // 숫자만 남기기
        const numbers = text.replace(/[^0-9]/g, '');
        // 11자리 제한
        return numbers.slice(0,11);
    };

    const handlePhoneChange = (text: string) => {
        const formatted = formatPhone(text);
        setPhone(formatted);
    };

    const handleNext = async () => {
        // 유효성 검사
        if (!name.trim()) {
            Alert.alert('오류', '이름을 입력해주세요');
            return;
        }
    
        if (phone.length !== 11 || !phone.startsWith('010')) {
            Alert.alert('오류', '올바른 전화번호를 입력해주세요\n(010으로 시작하는 11자리)');
            return;
        }

        try {
            const signed = await userPoolSignUp(name, '+82' + phone.substring(1), tempPassword, poolData); // E.164 포맷으로 변경 ex. +821012345678
            if (!signed) {
                Alert.alert('오류', '이미 등록된 전화번호입니다');
                return;
            }
        } catch (err) {
            Alert.alert('오류', '오류가 발생했습니다');
            return;
        }



        // 다음 화면으로 데이터 전달 (중요!)
        navigation.navigate('SignUpStep2', {
            phone: phone,
            name: name.trim(),
            poolData: poolData,
            tempPassword: tempPassword
        });
    };

    return (
        <View style={s.container1}>
            <Text style={s.title}>이름과 전화번호를 {'\n'} 입력해주세요</Text>
      
            <TextInput
                style={s.input}
                placeholder="이름을 입력하세요"
                value={name}
                onChangeText={setName}
                maxLength={20}  // 이름 최대 길이 제한
            />
      
            <TextInput
                style={s.input}
                keyboardType="number-pad"  // phone-pad → number-pad (숫자만)
                placeholder="01012345678"
                value={phone}
                onChangeText={handlePhoneChange}
                maxLength={11}  // 11자리 제한
            />
      
            <TouchableOpacity style={s.smallButton} onPress={handleNext}>
                <Text style={s.buttonText}>인증번호 받기</Text>
            </TouchableOpacity>
        </View>
    );
}