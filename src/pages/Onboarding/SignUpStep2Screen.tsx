import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function SignUpStep2Screen({ navigation }: any) {
  const [code, setCode] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>인증번호를 입력해주세요.</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="123456"
        value={code}
        onChangeText={setCode}
      />
      <Button title="다음으로" onPress={() => navigation.navigate('AddChildInfo')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 18, marginBottom: 16 },
  input: { width: '80%', borderWidth: 1, borderColor: '#aaa', padding: 10, marginBottom: 16, borderRadius: 8 },
});
