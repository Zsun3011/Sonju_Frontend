import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function SignUpStep1Screen({ navigation }: any) {
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>전화번호를 입력해주세요.</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="010-0000-0000"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="인증번호 받기" onPress={() => navigation.navigate('SignUpStep2')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 18, marginBottom: 16 },
  input: { width: '80%', borderWidth: 1, borderColor: '#aaa', padding: 10, marginBottom: 16, borderRadius: 8 },
});
