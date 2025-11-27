import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { register, login } from '../Utils/authService';

export default function DebugAuthScreen() {
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [output, setOutput] = useState('');

  const doRegister = async () => {
    setOutput('Sending register...');
    try {
      const res = await register({ name, email, password });
      setOutput(JSON.stringify(res, null, 2));
    } catch (err) {
      setOutput('Register error:\n' + JSON.stringify(err.response?.data || err.message || err, null, 2));
    }
  };

  const doLogin = async () => {
    setOutput('Sending login...');
    try {
      const res = await login({ email, password });
      setOutput(JSON.stringify(res, null, 2));
    } catch (err) {
      setOutput('Login error:\n' + JSON.stringify(err.response?.data || err.message || err, null, 2));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Debug Auth</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

      <View style={styles.buttonRow}>
        <Button title="Register (raw)" onPress={doRegister} />
        <View style={{ width: 12 }} />
        <Button title="Login (raw)" onPress={doLogin} />
      </View>

      <Text style={styles.outputHeader}>Response / Error</Text>
      <Text style={styles.output}>{output}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: '700', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 8, borderRadius: 6 },
  buttonRow: { flexDirection: 'row', marginTop: 12 },
  outputHeader: { marginTop: 20, fontWeight: '700' },
  output: { marginTop: 8, backgroundColor: '#f7f7f7', padding: 12, borderRadius: 6, fontFamily: 'monospace' }
});
