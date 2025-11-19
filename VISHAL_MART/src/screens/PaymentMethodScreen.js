import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Container from '../components/layout/container';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../components/common/button';

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery (COD)', icon: 'payments' },
  { id: 'upi', name: 'UPI / Google Pay / PhonePe', icon: 'payment' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
];

const PaymentMethodScreen = ({ navigation, route }) => {
  const { shippingAddress } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleProceed = () => {
    if (!selectedMethod) {
      return Alert.alert('Error', 'Kripya Payment Method chunein.');
    }

    const orderDetails = {
      shippingAddress: shippingAddress,
      paymentMethod: selectedMethod,
    };

    console.log('Final Order Details (incomplete):', orderDetails);
    navigation.navigate('OrderSuccess');
  };

  const PaymentOption = ({ method }) => (
    <TouchableOpacity
      style={[
        styles.optionContainer,
        selectedMethod === method.id && styles.selectedOption,
      ]}
      onPress={() => setSelectedMethod(method.id)}
    >
      <MaterialIcons name={method.icon} size={24} color={selectedMethod === method.id ? '#007AFF' : '#555'} />
      <Text style={styles.optionText}>{method.name}</Text>
      {selectedMethod === method.id && (
        <MaterialIcons name="check-circle" size={24} color="#4CAF50" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>2. Payment Method (भुगतान विधि)</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <Text style={styles.sectionTitle}>Apna Preferred Payment Method Chunein:</Text>

        {paymentMethods.map((method) => (
          <PaymentOption key={method.id} method={method} />
        ))}

        {shippingAddress && (
            <View style={styles.addressSummary}>
                <Text style={styles.summaryTitle}>Delivery Address:</Text>
                <Text>{shippingAddress.fullName} ({shippingAddress.phone})</Text>
                <Text>{shippingAddress.addressLine1}, {shippingAddress.addressLine2}</Text>
                <Text>{shippingAddress.city} - {shippingAddress.postalCode}</Text>
            </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Aage Badhein: Place Order"
            onPress={handleProceed}
            color="#4CAF50"
            disabled={!selectedMethod}
          />
        </View>
        
      </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F0FF',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    color: '#333',
  },
  checkIcon: {
    marginLeft: 10,
  },
  addressSummary: {
      marginTop: 30,
      padding: 15,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#FF9800',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
  }
});

export default PaymentMethodScreen;
