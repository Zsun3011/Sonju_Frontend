import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TodoPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>할 일 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
  },
});