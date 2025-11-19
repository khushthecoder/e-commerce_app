import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../components/layout/container';
import { useCart } from '../state/cartContext';
import { useAuth } from '../state/authContext';
import { db } from '../config/firebase';
import { placeOrder } from '../Utils/orderService';

const mockAddress = {
  name: 'Vishal Kumar',
  phone: '+91 98765 43210',
  line1: 'Flat No. 404, Devraj Apartment',
  line2: 'Near SBI Bank, Koregaon Park',
  city: 'Pune',
  pincode: '411001',
  state: 'Maharashtra',
};

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(mockAddress);

  const ItemSummary = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.itemQty}>x{item.quantity}</Text>
      <Text style={styles.itemSubtotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || !selectedAddress) {
      Alert.alert('Error', 'Cart Khali hai ya Delivery Address Missing hai.');
      return;
    }

    setLoading(true);

    const orderData = {
      userId: authState.user?.uid || 'anonymous_user',
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      totalAmount: cartTotal + 50.00,
      shippingFee: 50.00,
      deliveryAddress: selectedAddress,
      paymentMethod: 'COD (Cash on Delivery)',
      status: 'Processing',
      orderDate: new Date().toISOString(),
    };

    try {
      const appId = 'VISHAL-MART-APP';
      const orderId = await placeOrder(orderData, db, appId, clearCart);
      
      setLoading(false);
      navigation.replace('OrderSuccess', { orderId });

    } catch (e) {
      console.error("Order Place Error:", e);
      setLoading(false);
      Alert.alert('Error', 'Order place karne mein dikkat aayi. Kripya dobara try karein.');
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Delivery Address (Pata)</Text>
          <View style={styles.addressBox}>
            <Text style={styles.addressName}>{selectedAddress.name} ({selectedAddress.phone})</Text>
            <Text style={styles.addressDetail}>{selectedAddress.line1}, {selectedAddress.line2}</Text>
            <Text style={styles.addressDetail}>{selectedAddress.city} - {selectedAddress.pincode}</Text>
            <Text style={styles.addressDetail}>{selectedAddress.state}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Order Summary (Sankshipt Vivaran)</Text>
          <View style={styles.summaryList}>
            {cartItems.map(item => <ItemSummary key={item.id} item={item} />)}
          </View>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Payment Method (Bhugtan Ka Tarika)</Text>
          <View style={styles.paymentBox}>
            <MaterialIcons name="local-shipping" size={24} color="#28A745" />
            <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
          </View>
          <Text style={styles.paymentNote}>Is order ke liye abhi sirf COD upalabdh hai.</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Price Details (Daam Ka Vivaran)</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Items Subtotal:</Text>
            <Text style={styles.priceValue}>₹{cartTotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Fee:</Text>
            <Text style={styles.priceValue}>₹50.00</Text>
          </View>
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable (Kul Bhugtan):</Text>
            <Text style={styles.totalValue}>₹{(cartTotal + 50.00).toFixed(2)}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.placeOrderButton} 
          onPress={handlePlaceOrder}
          disabled={loading || cartItems.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.placeOrderButtonText}>
              Order Place Karein
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
    paddingBottom: 80,
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  
  addressBox: {
    padding: 5,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 5,
  },
  addressDetail: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  summaryList: {
    maxHeight: 150,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
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
    color: '#888',
  },
  itemSubtotal: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    color: '#333',
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
    color: '#333',
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
    color: '#333',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
