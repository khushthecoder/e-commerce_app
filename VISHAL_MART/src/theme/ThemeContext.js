import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');



  const themeColors = {
    light: {
      background: '#ffffff',
      card: '#ffffff',
      text: '#000000',
      border: '#e0e0e0',
      primary: '#4a6fa5',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      subText: '#666666',
      inputBackground: '#f5f5f5',
      placeholder: '#888888'
    },
    dark: {
      background: '#000000',
      card: '#111111',
      text: '#FFFFFF',
      subText: '#C7C7C7',
      border: '#333333',
      primary: '#4DA3FF',
      secondary: '#90a4ae',
      success: '#3ED46A',
      danger: '#FF6B6B',
      warning: '#ffb74d',
      info: '#4dd0e1',
      light: '#2d2d2d',
      dark: '#0D0D0D',
      inputBackground: '#1C1C1E',
      placeholder: '#9A9A9A'
    }
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? themeColors.dark : themeColors.light,
  };
  const createStyles = (styleObject) => {
    const themedStyles = styleObject(theme.colors);
    return StyleSheet.create(themedStyles);
  };

  return (
    <ThemeContext.Provider value={{
      ...theme,
      styles: createStyles,
      createStyles: (styleObject) => styleObject(theme.colors)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
