import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/loginscreen';
import SignUpScreen from './src/screens/signupscreen';
import DebugAuthScreen from './src/screens/DebugAuthScreen';
import { AuthProvider, useAuth } from './src/state/authContext';
import { CartProvider } from './src/state/cartContext';

const Tab = createBottomTabNavigator();
const AuthStackScreen = createStackNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  return (
    <AuthStackScreen.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackScreen.Screen name="Login" component={LoginScreen} />
      <AuthStackScreen.Screen name="SignUp" component={SignUpScreen} />
      <AuthStackScreen.Screen name="DebugAuth" component={DebugAuthScreen} />
    </AuthStackScreen.Navigator>
  );
};

const AppNavigation = () => {
  const { userToken, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return userToken ? <MainTabNavigator /> : <AuthStack />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});