// src/pages/HealthPage/PrescriptionOCR.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScaledText from '../../components/ScaledText';
import { healthStyles } from '../../styles/Health';

type OCRStep = 'camera' | 'processing' | 'result';

export default function PrescriptionOCR() {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState<OCRStep>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = () => {
    setCapturedImage('mock-image');
    setCurrentStep('processing');

    setTimeout(() => {
      setCurrentStep('result');
    }, 2000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCurrentStep('camera');
  };

  const handleConfirm = () => {
    // OCR 결과 데이터 (실제로는 OCR API 응답)
    const ocrResults = [
      { id: '1', name: '타이레놀', frequency: '3', days: '7', startDate: '2025/11/09' },
      { id: '2', name: '아스피린', frequency: '2', days: '10', startDate: '2025/11/09' },
      { id: '3', name: '비타민C', frequency: '1', days: '30', startDate: '2025/11/09' }
    ];

    navigation.navigate('MedicationResultConfirm', { ocrResults });
  };

  return (
    <View style={healthStyles.container}>
      <View style={healthStyles.header}>
        <TouchableOpacity
          style={healthStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../assets/images/왼쪽화살표.png')}
            style={healthStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={healthStyles.headerTitle}>
          복약 알림 설정
        </ScaledText>
      </View>

      <View style={healthStyles.ocrContainer}>
        {currentStep === 'camera' && (
          <View style={healthStyles.cameraView}>
            <ScaledText fontSize={26} style={healthStyles.instructionText}>
              버튼을 눌러 인식할 처방전을{'\n'}촬영해주세요.
            </ScaledText>
            <TouchableOpacity
              style={healthStyles.cameraButton}
              onPress={handleCapture}
            >
              <Image
                source={require('../../../assets/images/카메라아이콘.png')}
                style={healthStyles.cameraIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 'processing' && (
          <View style={healthStyles.processingView}>
            <ScaledText fontSize={24} style={healthStyles.instructionText}>
              처방전을 인식하는 중...
            </ScaledText>
            <ActivityIndicator size="large" color="#02BFDC" style={{ marginTop: 40 }} />
          </View>
        )}

        {currentStep === 'result' && (
          <View style={healthStyles.resultView}>
            <ScaledText fontSize={24} style={healthStyles.instructionText}>
              처방전을 다시 인식해주세요.
            </ScaledText>
            <TouchableOpacity
              style={healthStyles.cameraButton}
              onPress={handleRetake}
            >
              <Image
                source={require('../../../assets/images/카메라아이콘.png')}
                style={healthStyles.cameraIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={healthStyles.confirmButton}
              onPress={handleConfirm}
            >
              <ScaledText fontSize={24} style={healthStyles.confirmButtonText}>
                확인
              </ScaledText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}