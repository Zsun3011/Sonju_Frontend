import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container1}>
      <Text style={styles.title}>할머니, 할아버지 </Text>
      <Text style={styles.title}> 안녕하세요! </Text>
      <View style={styles.container2}>
        <Button title="로그인" onPress={() => navigation.navigate('Login')} />
        <Button title="회원가입" onPress={() => navigation.navigate('SignUpStep1')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container2: {
    flexDirection: 'row',           // 가로 방향으로 배치
    alignItems: 'center',           // 세로 중앙 정렬
    justifyContent: 'space-between',// 요소 간 균등 간격 (또는 'center')
    paddingVertical: 200,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    color: '#333',
  },
  subtitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 24,
    color: '#777',
    marginTop: 10,
  },
});
