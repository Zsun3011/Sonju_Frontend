import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../styles/Onboarding';
import { onboardingStyles } from '../../styles/Template';
import ScaledText from '../../components/ScaledText';

export default function SetSonjuNameStep1({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ScaledText fontSize={32} style={styles.title}>
        이제 내 손주를{'\n'}만들어봐요!
      </ScaledText>
      <Image
        source={require('../../../assets/images/sonjuorigin.png')}
        style={styles.sonju}
        resizeMode="contain"
      />

      <View style={styles.section}>
          <TouchableOpacity
            style={onboardingStyles.smallButton2}
            activeOpacity={0.8}
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
          >
            <ScaledText fontSize={16} style={onboardingStyles.buttonText2}>이전으로</ScaledText>
          </TouchableOpacity>

          <TouchableOpacity
                  style={onboardingStyles.smallButton}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  onPress={() => navigation.navigate('SetSonjuNameStep2')}
          >
            <ScaledText fontSize={16} style={onboardingStyles.buttonText}>시작하기</ScaledText>
          </TouchableOpacity>
      </View>
    </View>
  );
}