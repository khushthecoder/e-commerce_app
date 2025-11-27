import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../components/layout/container';
import { useAuth } from '../state/authContext'; 

const ProfileScreen = ({ navigation }) => {
  const { userToken, logout } = useAuth();
  const isAuthenticated = !!userToken;

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
            } catch (e) {
              Alert.alert('Error', 'There was a problem logging out.');
              console.error('Logout Error:', e);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
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
      onPress: () => Alert.alert('WIP', 'This feature is under development.') 
    },
    { 
      id: 'settings', 
      title: 'Settings', 
      icon: 'settings', 
      onPress: () => Alert.alert('WIP', 'This feature is under development.') 
    },
  ];

  const MenuItem = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color="#007AFF" />
      <Text style={styles.menuItemText}>{title}</Text>
      <MaterialIcons name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile</Text>
      </View>

      <View style={styles.userInfoCard}>
        <MaterialIcons name="account-circle" size={60} color="#007AFF" />
        <View style={styles.userInfoDetails}>
          {isAuthenticated ? (
            <>
              <Text style={styles.userName}>Welcome User</Text>
              <Text style={styles.userIdText}>You are logged in</Text>
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
      </View>

      <View style={styles.logoutButtonContainer}>
        {isAuthenticated ? (
          <Button
            title="Log Out"
            onPress={handleLogout}
            color="#FF6347" 
          />
        ) : (
          <Button
            title="Login / Signup"
            onPress={() => navigation.navigate('Login')} 
            color="#007AFF"
          />
        )}
      </View>

    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoCard: {
    backgroundColor: '#fff',
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
  },
  userInfoDetails: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  userIdText: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    fontFamily: 'monospace', 
  },

  menuContainer: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
  logoutButtonContainer: {
      marginTop: 30,
      marginHorizontal: 20,
  }
});

export default ProfileScreen;
