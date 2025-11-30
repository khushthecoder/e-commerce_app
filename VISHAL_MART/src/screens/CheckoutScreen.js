import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from '../components/layout/container';
import { useCart } from '../state/cartContext';
import { useAuth } from '../state/authContext';
import { useOrder } from '../state/orderContext';
import api from '../constants/api';
import { useTheme } from '../theme/ThemeContext';

const CheckoutScreen = ({ navigation, route }) => {
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { addOrderForUser } = useOrder();
  const { colors, createStyles } = useTheme();
  const styles = createStyles(stylesConfig);
  const [loading, setLoading] = useState(false);
  const { cartItems = [], shippingAddress = {} } = route.params || {};

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
      await addOrderForUser(user.id, orderData);
      await clearCart();

      Alert.alert(
        'Success',
        'Order placed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (e) {
      console.error("Order placement failed", e);
      Alert.alert('Error', 'Failed to place order.');
    } finally {
      setLoading(false);
    }
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
            <MaterialIcons name="local-shipping" size={24} color={colors.success} />
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

const stylesConfig = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.subText,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
  },
  paymentSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: colors.text,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  paymentText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  payButton: {
    backgroundColor: colors.success,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
    marginTop: 20,
    marginBottom: 10,
  },
  orderIdText: {
    fontSize: 16,
    color: colors.subText,
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentNote: {
    fontSize: 12,
    color: colors.subText,
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 100,
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 5,
  },
  addressCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    width: '100%',
    backgroundColor: colors.inputBackground,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 5,
  },
  addressDetailText: {
    fontSize: 14,
    color: colors.subText,
    lineHeight: 20,
  },
  noAddressText: {
    fontSize: 16,
    color: colors.subText,
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
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  itemName: {
    flex: 3,
    fontSize: 14,
    color: colors.text,
  },
  itemQty: {
    flex: 0.5,
    fontSize: 14,
    textAlign: 'center',
    color: colors.text,
  },
  itemSubtotal: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    color: colors.text,
  },
  paymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  priceLabel: {
    fontSize: 15,
    color: colors.subText,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.danger,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
  },
  placeOrderButton: {
    backgroundColor: colors.warning,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.subText,
    opacity: 0.5,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
