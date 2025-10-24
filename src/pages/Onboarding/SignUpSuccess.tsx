import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {styles} from '../../styles/Onboarding';
import {onboardingStyles} from '../../styles/Template';

export default function SignUpSuccess({ navigation }: any) {
      return (
        <View style={styles.container}>
            <Text style={styles.title}>이제부터{'\n'}손주와 함께{'\n'}즐거운 AI 공부를{'\n'}해봐요!</Text>
             <Image
                      source={require('../../../assets/images/sonjusmile.png')}
                      style={styles.sonju}
                      resizeMode="contain"
                    />
            <TouchableOpacity
                    style={onboardingStyles.smallButton}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    onPress={() => navigation.navigate('FontSizeSelector')}
            >
                    <Text style={onboardingStyles.buttonText}>다음으로</Text>
          </TouchableOpacity>
        </View>
      );
}

