import React, { useState } from 'react';
import { View, TouchableOpacity, Image,  TextInput, Alert} from 'react-native';
import { styles } from '../../styles/Onboarding';
import { onboardingStyles } from '../../styles/Template';
import ScaledText from '../../components/ScaledText';

export default function SetSonjuNameStep2({ navigation }: any) {
     const [sonjuName, setSonjuName] = useState('');

      const handleSave = async () => {
        if (sonjuName.trim() === '') {
          // 이름이 비어있을 때 처리 (옵션)
          Alert.alert('오류','손주의 이름을 입력해주세요');
          return;
        }

        try {
          console.log('저장된 손주 이름:', sonjuName);

          // 다음 화면으로 이동
          navigation.navigate('CharacterSetting', { sonjuName });
        } catch (error) {
          console.error('이름 저장 실패:', error);
        }
      };

  return (
    <View style={styles.container}>
          <ScaledText fontSize={32} style={styles.title}>
            이제 내 손주를{'\n'}만들어봐요!
          </ScaledText>
          <Image
            source={require('../../../assets/images/sonjusmile.png')}
            style={styles.sonju}
            resizeMode="contain"
          />

          <View style={styles.section}>
            <ScaledText fontSize={16} style={[onboardingStyles.buttonText2, { lineHeight: 50 }]}>
              이름
            </ScaledText>
            <TextInput
              style={[onboardingStyles.input, { width: '60%' }]}
              placeholder="손주의 이름을 지어주세요"
              value={sonjuName}
              onChangeText={setSonjuName}
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>

          <TouchableOpacity
            style={onboardingStyles.smallButton}
            onPress={handleSave}
          >
            <ScaledText fontSize={18} style={onboardingStyles.buttonText}>
              저장
            </ScaledText>
          </TouchableOpacity>

        </View>
  );
}