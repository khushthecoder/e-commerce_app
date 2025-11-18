import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import Container from '../components/layout/container';
import InputField from '../components/common/inputfield';

const ShippingAddressScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleProceed = () => {
    if (!fullName || !phone || !addressLine1 || !city || !postalCode) {
      return Alert.alert('Error', 'Please fill all required fields. (* fields are required)');
    }
    const shippingAddress = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      postalCode,
    };

    console.log('Shipping Address Saved:', shippingAddress);
    navigation.navigate('PaymentMethod', { shippingAddress });
  };

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>1. Shipping Address</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <InputField 
          placeholder="Full Name *" 
          value={fullName} 
          onChangeText={setFullName} 
        />
        <InputField 
          placeholder="Phone Number *" 
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad"
        />
        <InputField 
          placeholder="House No, Street, Area *" 
          value={addressLine1} 
          onChangeText={setAddressLine1} 
        />
        <InputField 
          placeholder="Landmark (Optional)" 
          value={addressLine2} 
          onChangeText={setAddressLine2} 
        />
        <InputField 
          placeholder="City *" 
          value={city} 
          onChangeText={setCity} 
        />
        <InputField 
          placeholder="Pin Code (Postal Code) *" 
          value={postalCode} 
          onChangeText={setPostalCode} 
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Continue: Payment Method"
            onPress={handleProceed}
            color="#007AFF"
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
  buttonContainer: {
    marginTop: 30,
  }
});

export default ShippingAddressScreen;
