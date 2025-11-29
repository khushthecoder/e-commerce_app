import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Container from '../components/layout/Container';
import { useAuth } from '../state/authContext';
import { useTheme } from '../theme/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, isLoading } = useAuth();
  const { colors, createStyles, isDark, toggleTheme } = useTheme();
  const styles = createStyles(stylesConfig);
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'Order History',
      icon: 'receipt-long',
      onPress: () => navigation.navigate('OrderHistory')
    },
    {
      id: 'address',
      title: 'Shipping Addresses',
      icon: 'location-on',
      onPress: () => navigation.navigate('ShippingAddress')
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      onPress: () => navigation.navigate('EditProfile')
    },
  ];

  const MenuItem = ({ title, icon, onPress, isSwitch, value, onValueChange }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={isSwitch}>
      <MaterialIcons name={icon} size={24} color={colors.primary} />
      <Text style={styles.menuItemText}>{title}</Text>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#767577", true: colors.primary }}
          thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
        />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color={colors.subText} />
      )}
    </TouchableOpacity>
  );

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile</Text>
      </View>

      <View style={styles.userInfoCard}>
        <MaterialIcons name="account-circle" size={60} color={colors.primary} />
        <View style={styles.userInfoDetails}>
          {isAuthenticated ? (
            <>
              <Text style={styles.userName}>
                {isLoading ? 'Loading...' : `Welcome ${user?.name || 'User'}`}
              </Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
            </>
          ) : (
            <Text style={styles.userName}>Welcome Guest</Text>
          )}
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            title={item.title}
            icon={item.icon}
            onPress={item.onPress}
          />
        ))}
        <MenuItem
          key="theme-toggle"
          title="Dark Mode"
          icon="brightness-6"
          isSwitch={true}
          value={isDark}
          onValueChange={toggleTheme}
        />
      </View>

      <View style={styles.logoutButtonContainer}>
        {isAuthenticated ? (
          <Button
            title="Log Out"
            onPress={handleLogout}
            color={colors.danger}
          />
        ) : (
          <Button
            title="Login / Signup"
            onPress={() => navigation.navigate('Login')}
            color={colors.primary}
          />
        )}
      </View>

    </Container>
  );
};

const stylesConfig = (colors) => ({
  header: {
    padding: 15,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  userInfoCard: {
    backgroundColor: colors.card,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userInfoDetails: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.subText,
    marginTop: 2,
  },
  userIdText: {
    fontSize: 12,
    color: colors.subText,
    marginTop: 5,
    fontFamily: 'monospace',
  },

  menuContainer: {
    marginHorizontal: 10,
    backgroundColor: colors.card,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 15,
    fontWeight: '500',
  },
  logoutButtonContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  }
});

export default ProfileScreen;
