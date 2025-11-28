import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../components/layout/container';
import { useCart } from '../state/cartContext';
import { useAuth } from '../state/authContext';
import api from '../constants/api';

const CheckoutScreen = ({ navigation, route }) => {
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Safe destructuring with defaults
  const { cartItems = [], shippingAddress = {} } = route.params || {};

  // Calculate total from passed items
  const cartTotal = (cartItems || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const ItemSummary = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.itemQty}>x{item.quantity}</Text>
      <Text style={styles.itemSubtotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  const AddressSelector = () => (
    <View style={styles.sectionCard}>
      <View style={styles.addressHeader}>
        <Text style={styles.sectionTitle}>1. Delivery Address</Text>
      </View>
      {shippingAddress && shippingAddress.name ? (
        <View style={styles.addressCard}>
          <Text style={styles.addressName}>{shippingAddress.name}</Text>
          <Text style={styles.addressDetailText}>{shippingAddress.address}</Text>
          <Text style={styles.addressDetailText}>{`${shippingAddress.pincode}`}</Text>
          <Text style={styles.addressDetailText}>{`Phone: ${shippingAddress.phone}`}</Text>
        </View>
      ) : (
        <Text style={styles.noAddressText}>No address provided.</Text>
      )}
    </View>
  );

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0 || !shippingAddress) {
      Alert.alert('Error', 'Your cart is empty or address is missing.');
      return;
    }

    setLoading(true);

    const orderData = {
      userId: user?.id,
      items: cartItems,
      totalAmount: cartTotal + 50.00,
      shippingAddress: shippingAddress,
      status: 'Pending',
      date: new Date().toISOString(),
    };

    try {
      // Try backend
      await api.post('/orders', orderData);
      Alert.alert('Success', 'Order placed successfully!');
    } catch (e) {
      console.log("Backend failed, saving locally", e);
      // Fallback to local storage
      try {
        const existingOrders = await AsyncStorage.getItem('local_orders');
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.push(orderData);
        await AsyncStorage.setItem('local_orders', JSON.stringify(orders));
        Alert.alert('Success', 'Order placed (saved locally)!');
      } catch (storageError) {
        console.error("Storage error", storageError);
        Alert.alert('Error', 'Failed to save order.');
        setLoading(false);
        return;
      }
    }

    clearCart();
    setLoading(false);
    navigation.navigate('Home');
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <AddressSelector />

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Order Summary</Text>
          <View style={styles.summaryList}>
            {(cartItems || []).map(item => <ItemSummary key={item.id} item={item} />)}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Payment Method</Text>
          <View style={styles.paymentBox}>
            <MaterialIcons name="local-shipping" size={24} color="#28A745" />
            <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
          </View>
          <Text style={styles.paymentNote}>Only COD is available for this order.</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Price Details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Items Subtotal:</Text>
            <Text style={styles.priceValue}>₹{cartTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Fee:</Text>
            <Text style={styles.priceValue}>₹50.00</Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable:</Text>
            <Text style={styles.totalValue}>₹{(cartTotal + 50.00).toFixed(2)}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, (!shippingAddress || loading) && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={!shippingAddress || loading || cartItems.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.placeOrderButtonText}>
              Place Order
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 10,
    paddingBottom: 100,
    backgroundColor: '#f5f5f5',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  addressCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 5,
  },
  addressDetailText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noAddressText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  summaryList: {
    maxHeight: 200,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
    alignItems: 'center',
  },
  itemName: {
    flex: 3,
    fontSize: 14,
    color: '#555',
  },
  itemQty: {
    flex: 0.5,
    fontSize: 14,
    textAlign: 'center',
  },
  itemSubtotal: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  paymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#28A745',
  },
  paymentNote: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  priceLabel: {
    fontSize: 15,
    color: '#666',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
  },
  placeOrderButton: {
    backgroundColor: '#FF9800',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
