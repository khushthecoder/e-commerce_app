import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../components/layout/container';
import { useCart } from '../state/cartContext';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert('Success', `${quantity} item(s) of ${product.name} Cart mein add ho chuka hai!`);
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          style={styles.productImage} 
          source={{ uri: product.imageUrl || 'https://placehold.co/600x400/007AFF/ffffff?text=Image+Nahi+Mili' }} 
        />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₹{product.price.toFixed(2)}</Text>
          
          <View style={styles.separator} />
          
          <Text style={styles.sectionTitle}>Product Ka Vivaran (Description)</Text>
          <Text style={styles.productDescription}>
            {product.description || 'Is product ka koi vivaran (description) available nahi hai. Yeh ek high-quality item hai jo aapki zarooraton ko poora karega!'}
          </Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Quantity (Maatra)</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={decreaseQuantity}
              disabled={quantity === 1}
            >
              <MaterialIcons name="remove" size={24} color={quantity === 1 ? '#ccc' : '#333'} />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={increaseQuantity}
            >
              <MaterialIcons name="add" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <MaterialIcons name="shopping-cart" size={24} color="#fff" />
          <Text style={styles.cartButtonText}>
            Cart Mein Add Karein (₹{(product.price * quantity).toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  cartButton: {
    backgroundColor: '#28A745',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProductDetailScreen;
