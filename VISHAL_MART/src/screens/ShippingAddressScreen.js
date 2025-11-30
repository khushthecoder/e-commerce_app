import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import Container from '../components/layout/container';
import InputField from '../components/common/inputfield';
import { addressService } from '../utils/addressService';
import { useAuth } from '../state/authContext';

const ShippingAddressScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    id: null,
    name: '',
    phone: '',
    houseNo: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (user?.id) {
      const unsubscribe = addressService.subscribeToAddresses(user.id, setAddresses);
      return () => unsubscribe();
    }
  }, [user]);

  const handleProceed = () => {
    if (!selectedAddress) {
      return Alert.alert('Error', 'Please select a shipping address.');
    }
    console.log('Proceeding with address:', selectedAddress);
    navigation.navigate('PaymentMethod', { shippingAddress: selectedAddress });
  };

  const openForm = (address = null) => {
    if (address) {
      setCurrentAddress(address);
      setIsEditing(true);
    } else {
      setCurrentAddress({ id: null, name: '', phone: '', houseNo: '', street: '', city: '', state: '', pincode: '' });
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!currentAddress.name || !currentAddress.phone || !currentAddress.houseNo || !currentAddress.city || !currentAddress.state || !currentAddress.pincode) {
      return Alert.alert('Error', 'Please fill all fields.');
    }
    try {
      if (isEditing) {
        await addressService.updateAddress(user.id, currentAddress.id, currentAddress);
        Alert.alert('Success', 'Address updated successfully!');
      } else {
        await addressService.addAddress(user.id, currentAddress);
        Alert.alert('Success', 'Address added successfully!');
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving address: ", error);
      Alert.alert('Error', 'Failed to save address.');
    }
  };

  const handleDelete = async (addressId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await addressService.deleteAddress(user.id, addressId);
              Alert.alert('Success', 'Address deleted successfully!');
              if (selectedAddress && selectedAddress.id === addressId) {
                setSelectedAddress(null);
              }
            } catch (error) {
              console.error("Error deleting address: ", error);
              Alert.alert('Error', 'Failed to delete address.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderAddress = (address) => (
    <Pressable key={address.id} onPress={() => setSelectedAddress(address)} style={[styles.card, selectedAddress?.id === address.id && styles.selectedCard]}>
      <Text style={styles.cardTextName}>{address.name}</Text>
      <Text style={styles.cardText}>{`${address.houseNo}, ${address.street}`}</Text>
      <Text style={styles.cardText}>{`${address.city}, ${address.state} - ${address.pincode}`}</Text>
      <Text style={styles.cardText}>{`Phone: ${address.phone}`}</Text>
      <View style={styles.cardActions}>
        <Button title="Edit" onPress={() => openForm(address)} color="#007AFF" />
        <Button title="Delete" onPress={() => handleDelete(address.id)} color="#FF3B30" />
      </View>
    </Pressable>
  );

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>Shipping Address</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {addresses.length > 0 ? (
          addresses.map(renderAddress)
        ) : (
          <Text style={styles.emptyText}>No saved addresses. Please add one.</Text>
        )}
        <View style={styles.buttonContainer}>
          <Button
            title="Add New Address"
            onPress={() => openForm()}
            color="#007AFF"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue to Payment"
          onPress={handleProceed}
          disabled={!selectedAddress}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Address' : 'Add New Address'}</Text>
            <InputField placeholder="Full Name" value={currentAddress.name} onChangeText={text => setCurrentAddress({ ...currentAddress, name: text })} />
            <InputField placeholder="Phone Number" value={currentAddress.phone} onChangeText={text => setCurrentAddress({ ...currentAddress, phone: text })} keyboardType="phone-pad" />
            <InputField placeholder="House No, Building" value={currentAddress.houseNo} onChangeText={text => setCurrentAddress({ ...currentAddress, houseNo: text })} />
            <InputField placeholder="Street, Area" value={currentAddress.street} onChangeText={text => setCurrentAddress({ ...currentAddress, street: text })} />
            <InputField placeholder="City" value={currentAddress.city} onChangeText={text => setCurrentAddress({ ...currentAddress, city: text })} />
            <InputField placeholder="State" value={currentAddress.state} onChangeText={text => setCurrentAddress({ ...currentAddress, state: text })} />
            <InputField placeholder="Pincode" value={currentAddress.pincode} onChangeText={text => setCurrentAddress({ ...currentAddress, pincode: text })} keyboardType="numeric" />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF3B30" />
              <Button title="Save" onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 10,
    paddingBottom: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  cardTextName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  }
});

export default ShippingAddressScreen;

