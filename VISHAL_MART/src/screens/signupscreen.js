import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../state/authContext';
import { useTheme } from '../theme/ThemeContext';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuth();
  const { colors, createStyles } = useTheme();
  const styles = createStyles(stylesConfig);

  const handleSignup = async () => {
    try {
      await register(name, email, password);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={colors.placeholder}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Button title="Sign Up" onPress={handleSignup} color={colors.primary} />
      )}
      <View style={styles.loginContainer}>
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('Login')}
          color={colors.secondary}
        />
      </View>
    </View>
  );
};

const stylesConfig = (colors) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: colors.inputBackground,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
    color: colors.subText,
  },
  link: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default SignupScreen;