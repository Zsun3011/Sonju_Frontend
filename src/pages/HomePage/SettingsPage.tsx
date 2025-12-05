// src/pages/HomePage/SettingsPage.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScaledText from '../../components/ScaledText';

export default function SettingsPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ScaledText fontSize={24} style={styles.backText}>← 설정</ScaledText>
      </TouchableOpacity>
      <ScaledText fontSize={32} style={styles.title}>추후 개발</ScaledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  backText: {
      fontFamily: 'Pretendard-Medium',
      color: '#000000',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 100,
  },
});