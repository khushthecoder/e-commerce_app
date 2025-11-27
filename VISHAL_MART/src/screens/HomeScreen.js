
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, Alert, TextInput } from 'react-native';
import api from '../constants/api';
import { useAuth } from '../state/authContext';
import ProductCard from '../components/product/Productcard';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const { logout } = useAuth();

  const loadProducts = async (searchTerm = '') => {
    try {
      setLoading(true); // Set loading to true when starting a new search
      setError(null); // Clear previous errors
      const response = await api.get(`/api/products?search=${searchTerm}`);
      setProducts(response.data);
    } catch (err) {
      console.error("Product fetch error:", err);
      setError('Unable to load products. Please check the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();

    } catch (e) {
      Alert.alert('Error', 'There was an issue logging out.');
      console.error('Logout Error:', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Logout" onPress={handleLogout} color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vishal Mart Products</Text>
        <Button title="Logout" onPress={handleLogout} color="#FF6347" />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={(text) => { setSearch(text); loadProducts(text); }}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  list: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  }
});

export default HomeScreen;
