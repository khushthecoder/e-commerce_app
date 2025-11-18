import React, { createContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../constants/api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error('Restoring token failed', e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (email, password) => {
        setIsLoading(true);
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token } = response.data;
          
          await AsyncStorage.setItem('userToken', token);
          setUserToken(token);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error('Sign in error:', error.response?.data?.error || 'Login failed');
          throw new Error(error.response?.data?.error || 'Login failed');
        }
      },
      signOut: async () => {
        setIsLoading(true);
        try {
          await AsyncStorage.removeItem('userToken');
          setUserToken(null);
          setIsLoading(false);
        } catch (e) {
          console.error('Sign out error', e);
          setIsLoading(false);
        }
      },
      signUp: async (name, email, password) => {
        setIsLoading(true);
        try {
          await api.post('/auth/signup', { name, email, password });
          await authContext.signIn(email, password);
        } catch (error) {
          setIsLoading(false);
          console.error('Sign up error:', error.response?.data?.error || 'Signup failed');
          throw new Error(error.response?.data?.error || 'Signup failed');
        }
      },
      userToken,
      isLoading,
    }),
    [userToken, isLoading]
  );

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};