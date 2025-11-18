import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { register } from '../Utils/authService'; 
import InputField from '../components/common/inputfield'; 
import Container from '../components/layout/container';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert('Error', 'Please fill all fields.');
    }
    
    setLoading(true);
    try {
      const userData = { name, email, password };
      const result = await register(userData);
      
      Alert.alert('Success', `Welcome, ${result.name}! You are registered and logged in.`);
      navigation.navigate('Home'); 
      
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Text style={styles.header}>Create Account</Text>
      
      <InputField 
        placeholder="Full Name" 
        value={name} 
        onChangeText={setName} 
      />
      <InputField 
        placeholder="Email" 
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
          title={loading ? 'Registering...' : 'Sign Up'} 
          onPress={onRegister} 
          disabled={loading} 
        />
      </View>

      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log In
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  loginText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007AFF', 
  }
});

export default SignupScreen;