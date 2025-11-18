import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { login } from '../Utils/authService';
import InputField from '../components/common/inputfield';
import Container from '../components/layout/container';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter email and password.');
    }
    
    setLoading(true);
    try {
      const userData = { email, password };
      const result = await login(userData);
      
      Alert.alert('Success', `Welcome back, ${result.name}!`);
      navigation.navigate('Home');
      
    } catch (error) {
      console.error('Login Error:', error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Login failed. Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <View style={styles.content}>
        <Text style={styles.header}>Welcome Back</Text>

        <InputField 
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <InputField 
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title={loading ? 'Logging In...' : 'Log In'}
            onPress={onLogin}
            disabled={loading}
            color="#007AFF"
          />
        </View>

        <Text style={styles.signupText} onPress={() => navigation.navigate('Signup')}>
          Don't have an account? Sign Up.
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 25,
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoginScreen;
