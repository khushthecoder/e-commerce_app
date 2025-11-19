
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrderSuccessScreen = ({ route }) => {
  const navigation = useNavigation();
  const { orderId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thank You!</Text>
      <Text style={styles.subtitle}>Your order has been placed successfully.</Text>
      <Text style={styles.orderId}>Order ID: {orderId}</Text>
      <Button title="Continue Shopping" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  orderId: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 30,
  },
});

export default OrderSuccessScreen;
