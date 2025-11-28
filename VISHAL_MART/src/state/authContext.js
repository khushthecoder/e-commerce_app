// src/state/authContext.js
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../constants/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userToken: null,
    user: null,
    isLoading: true
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/users/me');
      return {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email
      };
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await api.post('/users/register', {
        name,
        email,
        password
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Registration failed: Invalid response from server');
      }

      await AsyncStorage.setItem('userToken', token);

      setAuthState({
        userToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        isLoading: false
      });

      return user;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await api.post('/users/login', {
        email,
        password
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Login failed: Invalid credentials');
      }

      await AsyncStorage.setItem('userToken', token);

      setAuthState({
        userToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        isLoading: false
      });

      return user;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setAuthState({
        userToken: null,
        user: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to log out');
    }
  }, []);

  // Restore token on mount
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');

        if (userToken) {
          const user = await fetchUser();
          setAuthState({
            userToken,
            user,
            isLoading: false
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (e) {
        console.error('Failed to restore token', e);
        setAuthState({
          userToken: null,
          user: null,
          isLoading: false
        });
      }
    };

    bootstrapAsync();
  }, [fetchUser]);

  const value = useMemo(() => ({
    ...authState,
    register,
    login,
    logout
  }), [authState, register, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};