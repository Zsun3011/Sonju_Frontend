import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function AddChildInfoScreen({ navigation }: any) {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이름을 입력해주세요.</Text>
      <TextInput
        style={styles.input}
        placeholder="예: 홍길동"
        value={name}
        onChangeText={setName}
      />
      <Button title="회원가입 완료" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 18, marginBottom: 16 },
  input: { width: '80%', borderWidth: 1, borderColor: '#aaa', padding: 10, marginBottom: 16, borderRadius: 8 },
});


