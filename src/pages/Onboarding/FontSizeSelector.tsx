import React, { useState,  useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native';
import { styles } from '../../styles/Onboarding';
import { onboardingStyles } from '../../styles/Template';
import { useFontSize } from '../../contexts/FontSizeContext';
import ScaledText from '../../components/ScaledText';

const { width } = Dimensions.get('window');

interface FontSize {
  label: string;
  scale: number;
}

export default function FontSizeSelector({ navigation }: any) {
    const {  fontScale, updateFontScale } = useFontSize(); // Context에서 함수 가져오기
    const [selectedSize, setSelectedSize] = useState<number>(1); // 0: 작게, 1: 보통, 2: 크게

    const fontSizes: FontSize[] = [
      { label: '가', scale: 0.9 },  // 작게
      { label: '가', scale: 1.0 },  // 보통
      { label: '가', scale: 1.1 }   // 크게
    ];

    // 초기 로드 시 현재 fontScale에 맞는 index 찾기
    useEffect(() => {
      const currentIndex = fontSizes.findIndex(size => size.scale === fontScale);
      if (currentIndex !== 1) {
        setSelectedSize(currentIndex);
      }
    }, []);

    const handleSelect = async (index: number): Promise<void> => {
          setSelectedSize(index);
          // 선택 즉시 fontScale 업데이트 (실시간 미리보기)
          await updateFontScale(fontSizes[index].scale);
    };

    const handleConfirm = (): void => {
          navigation.navigate('SetSonjuNameStep1');
    };

    return (
      <View style={styles.container}>
          {/* ScaledText 사용 */}
          <ScaledText fontSize={28} style={styles.title}>
            가장 보기 편한{'\n'}글자 크기를 골라 주세요!
          </ScaledText>

          <View style={styles.selectorContainer}>
            {/* 라벨들 */}
            <View style={styles.labelsRow}>
              {fontSizes.map((size, index) => (
                <View
                  key={`label-${index}`}
                  style={[
                    styles.labelWrapper,
                    index === 0 && { left: 0 },
                    index === 1 && { left: '50%', marginLeft: -20 },
                    index === 2 && { right: 0 }
                  ]}
                >
                   {/* 미리보기는 일반 Text로 직접 크기 지정 */}
                    <Text
                      style={[
                        styles.label,
                        { fontSize: 28 * size.scale } // 직접 크기 계산
                      ]}
                    >
                    {size.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* 라인과 동그라미 */}
            <View style={styles.circlesRow}>
              <View style={styles.line} />
              {fontSizes.map((size, index) => (
                <TouchableOpacity
                  key={`circle-${index}`}
                  style={[
                    styles.circleWrapper,
                    index === 0 && { left: 0 },
                    index === 1 && { left: '50%', marginLeft: -20 },
                    index === 2 && { right: 0 }
                  ]}
                  onPress={() => handleSelect(index)}
                  activeOpacity={1}
                >
                  <View
                    style={[
                      styles.circle,
                      selectedSize === index && styles.circleSelected
                    ]}
                  >
                    {selectedSize === index && <View style={styles.innerCircle} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
              style={onboardingStyles.smallButton}
              activeOpacity={0.8}
              accessibilityRole="button"
              onPress={handleConfirm}
          >
              <ScaledText fontSize={16} style={onboardingStyles.buttonText}>
                선택하기
              </ScaledText>
          </TouchableOpacity>
      </View>
    );
}