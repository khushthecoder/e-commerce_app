import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../state/authContext';
import InputField from '../components/common/inputfield';
import Container from '../components/layout/container';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useAuth();

  const onLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter email and password.');
    }

    try {
      await signIn(email, password);
      
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', error.message || 'Login failed. Invalid credentials or server error.');
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
            title={isLoading ? 'Logging In...' : 'Log In'}
            onPress={onLogin}
            disabled={isLoading}
            color="#007AFF"
          />
        </View>

        <Text style={styles.signupText} onPress={() => navigation.navigate('SignUp')}>
          Don't have an account? Sign Up.
        </Text>
      </View>

      {isLoading && (
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
