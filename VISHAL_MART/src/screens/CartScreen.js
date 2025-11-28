import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../components/layout/container';
import { useCart } from '../state/cartContext';

const CartItem = ({ item, onAddItem, onRemoveItem }) => {
  return (
    <View style={styles.cartItemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={() => onRemoveItem(item.id)}
          style={[styles.qtyButton, styles.removeButton]}
        >
          <MaterialIcons name="remove" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.itemQuantity}>{item.quantity}</Text>

        <TouchableOpacity
          onPress={() => onAddItem(item)}
          style={[styles.qtyButton, styles.addButton]}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const { cartState, addItem, removeItem, clearCart } = useCart();
  const { items, totalAmount } = cartState;

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    pincode: '',
    phone: ''
  });

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart is empty', 'Please add items to your cart before checkout');
      return;
    }

    const { name, address, pincode, phone } = shippingAddress;
    if (!name || !address || !pincode || !phone) {
      Alert.alert('Missing Information', 'Please fill in all address fields');
      return;
    }

    if (phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    navigation.navigate('Checkout', {
      cartItems: items,
      shippingAddress
    });
  };

  const renderItem = ({ item }) => (
    <CartItem
      item={item}
      onAddItem={addItem}
      onRemoveItem={removeItem}
    />
  );

  if (items.length === 0) {
    return (
      <Container>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
        </View>
        <View style={styles.emptyCart}>
          <MaterialIcons name="shopping-cart" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Your Cart is Empty!</Text>
          <Text style={styles.emptySubText}>Add some products from the Home screen.</Text>
          <Button
            title="Browse Products"
            onPress={() => navigation.navigate('HomeStack')}
            color="#007AFF"
          />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart ({items.length} items)</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Grand Total:</Text>
          <Text style={styles.totalPrice}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={shippingAddress.name}
            onChangeText={(text) => setShippingAddress(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Full Address"
            value={shippingAddress.address}
            onChangeText={(text) => setShippingAddress(prev => ({ ...prev, address: text }))}
            multiline
            numberOfLines={3}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Pincode"
              value={shippingAddress.pincode}
              onChangeText={(text) => setShippingAddress(prev => ({ ...prev, pincode: text }))}
              keyboardType="numeric"
              maxLength={6}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Phone Number"
              value={shippingAddress.phone}
              onChangeText={(text) => setShippingAddress(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          color="#4CAF50"
          disabled={items.length === 0}
        />

        <TouchableOpacity
          onPress={clearCart}
          style={[styles.clearButton, items.length === 0 && styles.disabledButton]}
          disabled={items.length === 0}
        >
          <Text style={styles.clearButtonText}>Empty Cart</Text>
        </TouchableOpacity>
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
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemDetails: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 2,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FF6347',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  itemQuantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },

  summaryContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  addressContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  clearButtonText: {
    color: '#FF6347',
    fontSize: 14,
    fontWeight: '500',
  },

  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#555',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  }
});

export default CartScreen;
