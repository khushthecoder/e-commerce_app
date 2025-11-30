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
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import { AuthProvider, useAuth } from './src/state/authContext';
import { CartProvider } from './src/state/cartContext';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import ShippingAddressScreen from './src/screens/ShippingAddressScreen';

const Tab = createBottomTabNavigator();
const AuthStackScreen = createStackNavigator();

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
    </HomeStack.Navigator>
  );
};

const CartStack = createStackNavigator();

const CartStackNavigator = () => {
  return (
    <CartStack.Navigator>
      <CartStack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }} />
      <CartStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
    </CartStack.Navigator>
  );
};

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Order History' }} />
      <ProfileStack.Screen name="ShippingAddress" component={ShippingAddressScreen} options={{ title: 'Shipping Addresses' }} />
    </ProfileStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Cart" component={CartStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  return (
    <AuthStackScreen.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackScreen.Screen name="Login" component={LoginScreen} />
      <AuthStackScreen.Screen name="Register" component={SignUpScreen} />
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