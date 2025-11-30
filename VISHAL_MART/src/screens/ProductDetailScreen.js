import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Share, Platform, Linking, TextInput } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import Container from '../components/layout/container';
import { useCart } from '../state/cartContext';
import { API_URL } from '../config';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [availableStock, setAvailableStock] = useState(product.stock);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < availableStock) {
      setQuantity(prev => prev + 1);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      if (__DEV__) {
        const mockReviews = [
          {
            id: 1,
            username: 'John Doe',
            rating: 5,
            comment: 'Great product! Works as expected.',
            date: new Date().toISOString()
          },
          {
            id: 2,
            username: 'Jane Smith',
            rating: 4,
            comment: 'Good quality, fast delivery.',
            date: new Date(Date.now() - 86400000).toISOString() // Yesterday
          }
        ];
        setReviews(mockReviews);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/reviews?productId=${product.id}`);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API did not return JSON');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
      
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    Alert.alert('Success', `${quantity} item(s) of ${product.name} added to cart!`);
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please enter your review');
      return;
    }

    try {
      if (__DEV__) {
        const newReview = {
          id: Date.now(),
          username: 'You',
          rating,
          comment: reviewText,
          date: new Date().toISOString()
        };
        
        setReviews(prev => [newReview, ...prev]);
        setRating(0);
        setReviewText('');
        Alert.alert('Success', 'Thank you for your review! (Demo Mode)');
        return;
      }
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          rating,
          comment: reviewText,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const data = await response.json();
      setRating(0);
      setReviewText('');
      fetchReviews();
      Alert.alert('Success', 'Thank you for your review!');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', error.message || 'Failed to submit review. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name={star <= rating ? 'star' : 'star-outline'}
        size={20}
        color={star <= rating ? '#FFD700' : '#ccc'}
        style={styles.starIcon}
      />
    ));
  };

  const handleShare = () => {
    const productUrl = `https://vishalmart.com/products/${product.id}`;
    const message = `Check out ${product.name} on Vishal Mart: ${productUrl}`;
    
    Alert.alert(
      'Share Product',
      'Choose a platform to share',
      [
        {
          text: 'WhatsApp',
          onPress: () => Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`),
        },
        {
          text: 'Twitter',
          onPress: () => Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`),
        },
        {
          text: 'Facebook',
          onPress: () => Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          style={styles.productImage}
          source={{ uri: product.image }}
        />

        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <FontAwesome name="share-alt" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.productPrice}>₹{product.price}</Text>
          <Text style={styles.stockInfo}>
            Available Stock: {availableStock - quantity + 1}
          </Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.productDescription}>
            {product.description}
          </Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decreaseQuantity}
              disabled={quantity === 0}
            >
              <MaterialIcons name="remove" size={24} color={quantity === 0 ? '#ccc' : '#333'} />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={increaseQuantity}
            >
              <MaterialIcons name="add" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          
          {!isLoading && reviews.length === 0 ? (
            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
              {__DEV__ && (
                <Text style={styles.devNote}>(Using demo data in development mode)</Text>
              )}
            </View>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUsername}>{review.username || 'Anonymous'}</Text>
                  <View style={styles.reviewRating}>
                    {renderStars(review.rating)}
                  </View>
                </View>
                <Text style={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString()}
                </Text>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </View>
            ))
          )}

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Write a Review</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Your Rating:</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= rating ? '#FFD700' : '#ccc'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInput
            style={styles.reviewInput}
            placeholder="Write your review here..."
            multiline
            numberOfLines={4}
            value={reviewText}
            onChangeText={setReviewText}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReview}
          >
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <MaterialIcons name="shopping-cart" size={24} color="#fff" />
          <Text style={styles.cartButtonText}>
            Add to Cart (₹{(product.price * quantity).toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  shareButton: {
    padding: 8,
    marginLeft: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 5,
  },
  stockInfo: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    marginBottom: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
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
  reviewItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewUsername: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noReviewsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  noReviewsText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  devNote: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  ratingContainer: {
    marginBottom: 15,
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 4,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
