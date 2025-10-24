import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { onboardingStyles as s } from '../../style/Template';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={s.container1}>
      <Text style={s.title}>할머니, 할아버지{'\n'}안녕하세요!</Text>

      <Image 
        source={require('../../../assets/images/손주전신1.png')}
        style={s.welcomeImage}
        resizeMode="contain"
      />

      <View style={s.container2}>
        <TouchableOpacity style={s.smallButton} onPress={() => navigation.navigate('Login')}>
          <Text style={s.buttonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.smallButton} onPress={() => navigation.navigate('SignUpStep1')}>
          <Text style={s.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}