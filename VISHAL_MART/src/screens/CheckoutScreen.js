
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Pressable, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../components/layout/container';
import { useCart } from '../state/cartContext';
import { useAuth } from '../state/authContext';
import { placeOrder } from '../Utils/orderService';
import { addressService } from '../Utils/addressService';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(false);
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = addressService.subscribeToAddresses(user.uid, (addresses) => {
        setSavedAddresses(addresses);
        
        if (!selectedAddress && addresses.length > 0) {
          setSelectedAddress(addresses.find(a => a.isDefault) || addresses[0]);
        }
      });
      return () => unsubscribe();
    }
  }, [user, selectedAddress]); 

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
        <Button title="Manage Addresses" onPress={() => navigation.navigate('ShippingAddress')} />
      </View>
      {savedAddresses.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.addressList}>
          {savedAddresses.map(address => (
            <Pressable key={address.id} style={[styles.addressCard, selectedAddress?.id === address.id && styles.selectedAddressCard]} onPress={() => setSelectedAddress(address)}>
              <Text style={styles.addressName}>{address.name}</Text>
              <Text style={styles.addressDetailText}>{`${address.houseNo}, ${address.street}`}</Text>
              <Text style={styles.addressDetailText}>{`${address.city}, ${address.state} - ${address.pincode}`}</Text>
              <Text style={styles.addressDetailText}>{`Phone: ${address.phone}`}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noAddressContainer}>
          <Text style={styles.noAddressText}>No saved addresses found.</Text>
          <Button title="Add an Address" onPress={() => navigation.navigate('ShippingAddress')} />
        </View>
      )}
    </View>
  );


  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || !selectedAddress) {
      Alert.alert('Error', 'Your cart is empty or you have not selected a delivery address.');
      return;
    }

    setLoading(true);

    const orderData = {
      userId: user?.uid,
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
      
      
      await placeOrder(orderData);
      
      clearCart(); 
      setLoading(false);
      navigation.replace('OrderSuccess', { orderId: 'some-generated-id' }); 

    } catch (e) {
      console.error("Order Place Error:", e);
      setLoading(false);
      Alert.alert('Error', 'There was an issue placing your order. Please try again.');
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <AddressSelector />

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Order Summary</Text>
          <View style={styles.summaryList}>
            {cartItems.map(item => <ItemSummary key={item.id} item={item} />)}
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
          style={[styles.placeOrderButton, (!selectedAddress || loading) && styles.disabledButton]} 
          onPress={handlePlaceOrder}
          disabled={!selectedAddress || loading || cartItems.length === 0}
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
    addressList: {
        paddingVertical: 10,
    },
    addressCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginRight: 10,
        width: 250,
        backgroundColor: '#fff',
    },
    selectedAddressCard: {
        borderColor: '#007AFF',
        borderWidth: 2,
        backgroundColor: '#f0f8ff',
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
    noAddressContainer: {
        alignItems: 'center',
        padding: 20,
    },
    noAddressText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 15,
    },
    summaryList: {
        maxHeight: 150,
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

