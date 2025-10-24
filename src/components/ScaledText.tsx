import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useFontSize } from '../contexts/FontSizeContext';

interface ScaledTextProps extends TextProps {
  fontSize?: number;
}

export default function ScaledText({
  fontSize = 16,
  style,
  ...props
}: ScaledTextProps) {
  const { fontScale } = useFontSize();

  // style에서 fontSize를 제거하고 나머지만 추출
  const flattenedStyle = StyleSheet.flatten(style);
  const { fontSize: _, ...styleWithoutFontSize } = flattenedStyle || {};

  return (
    <Text
      {...props}
      style={[
        styleWithoutFontSize,  // fontSize 제외한 스타일
        { fontSize: fontSize * fontScale }  // 계산된 fontSize를 마지막에 적용
      ]}
    />
  );
}