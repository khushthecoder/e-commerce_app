import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

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
    },
    dark: {
      background: '#121212',
      card: '#1e1e1e',
      text: '#ffffff',
      border: '#333333',
      primary: '#64b5f6',
      secondary: '#90a4ae',
      success: '#4caf50',
      danger: '#f44336',
      warning: '#ffb74d',
      info: '#4dd0e1',
      light: '#2d2d2d',
      dark: '#1a1a1a',
    }
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? themeColors.dark : themeColors.light,
  };

  // Create a styles function that applies the current theme colors
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
