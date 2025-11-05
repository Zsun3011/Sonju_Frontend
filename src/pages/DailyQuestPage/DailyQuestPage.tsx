import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScaledText from '../../components/ScaledText';

export default function DailyQuestPage() {
  return (
    <View style={styles.container}>
      <ScaledText fontSize={24} style={styles.text}>
        할 일 페이지
      </ScaledText>
      <ScaledText fontSize={16} style={styles.subtext}>
        개발 예정입니다
      </ScaledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B8E9F5',
  },
  text: {
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginBottom: 10,
  },
  subtext: {
    fontFamily: 'Pretendard-Regular',
    color: '#777',
  },
});