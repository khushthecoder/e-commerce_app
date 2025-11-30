import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Share, Platform, StatusBar } from 'react-native';
import { useCart } from '../state/cartContext';
import { API_URL } from '../config';
import { useTheme } from '../theme/ThemeContext';
import Container from '../components/layout/container';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const { addItem } = useCart();
  const { colors, createStyles: createThemedStyles } = useTheme();
  const themedStyles = createThemedStyles(createStyles);
  const [quantity, setQuantity] = useState(0);
  const [availableStock, setAvailableStock] = useState(product.stock);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const decreaseQuantity = () => {
    if (quantity > 0) {
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
            userName: 'John Doe',
            rating: 5,
            comment: 'Great product! Works as expected.',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            userName: 'Jane Smith',
            rating: 4,
            comment: 'Good quality, fast delivery.',
            createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
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
          userName: 'You',
          rating,
          comment: reviewText,
          createdAt: new Date().toISOString()
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
          createdAt: new Date().toISOString(),
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
    <View style={themedStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView style={themedStyles.scrollView}>
        <Image source={{ uri: product.image }} style={themedStyles.image} />
        <View style={themedStyles.detailsContainer}>
          <View style={themedStyles.headerRow}>
            <Text style={themedStyles.productName}>{product.name}</Text>
            <TouchableOpacity style={themedStyles.shareButton} onPress={handleShare}>
              <Text style={themedStyles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
          <Text style={themedStyles.price}>₹{product.price.toFixed(2)}</Text>
          <Text style={themedStyles.stock}>
            In Stock: <Text style={{ color: colors.primary }}>{availableStock}</Text>
          </Text>
          <Text style={themedStyles.description}>{product.description}</Text>
          
          <View style={themedStyles.quantityContainer}>
            <Text style={themedStyles.quantityLabel}>Quantity:</Text>
            <View style={themedStyles.quantityControls}>
              <TouchableOpacity 
                style={[
                  themedStyles.quantityButton, 
                  quantity === 0 && themedStyles.disabledButton
                ]} 
                onPress={decreaseQuantity}
                disabled={quantity === 0}
              >
                <Text style={themedStyles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={themedStyles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={[
                  themedStyles.quantityButton, 
                  quantity >= availableStock && themedStyles.disabledButton
                ]} 
                onPress={increaseQuantity}
                disabled={quantity >= availableStock}
              >
                <Text style={themedStyles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[
              themedStyles.addToCartButton, 
              quantity === 0 && themedStyles.disabledAddToCart
            ]} 
            onPress={handleAddToCart}
            disabled={quantity === 0}
          >
            <Text style={themedStyles.addToCartButtonText}>
              {quantity === 0 ? 'Select Quantity' : `Add to Cart (${quantity})`}
            </Text>
          </TouchableOpacity>

          <View style={themedStyles.reviewsSection}>
            <Text style={themedStyles.sectionTitle}>Product Reviews</Text>
            
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} style={themedStyles.loadingIndicator} />
            ) : reviews.length > 0 ? (
              <>
                {reviews.map((review, index) => (
                  <View key={index} style={themedStyles.reviewItem}>
                    <View style={themedStyles.reviewHeader}>
                      <Text style={themedStyles.reviewAuthor}>{review.userName || 'Anonymous'}</Text>
                      <Text style={themedStyles.reviewRating}>★ {review.rating}/5</Text>
                    </View>
                    <Text style={themedStyles.reviewText}>{review.comment}</Text>
                    <Text style={themedStyles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={themedStyles.noReviewsText}>No reviews yet. Be the first to review!</Text>
            )}

            <Text style={themedStyles.sectionTitle}>Write a Review</Text>
            <View style={themedStyles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={[
                    themedStyles.star, 
                    { color: star <= rating ? colors.primary : colors.text + '80' }
                  ]}>
                    {star <= rating ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={themedStyles.reviewInput}
              placeholder="Write your review here..."
              placeholderTextColor={colors.text + '80'}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <TouchableOpacity 
              style={[
                themedStyles.submitButton, 
                (!reviewText || rating === 0) && themedStyles.disabledButton
              ]}
              onPress={handleSubmitReview}
              disabled={!reviewText || rating === 0}
            >
              <Text style={themedStyles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    backgroundColor: colors.card,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    color: colors.text,
  },
  shareButton: {
    padding: 8,
    backgroundColor: colors.card,
    borderRadius: 20,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  stock: {
    fontSize: 14,
    color: colors.text + 'CC',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text + 'E6',
    marginBottom: 28,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 16,
    color: colors.text + 'CC',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  quantityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.card,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  quantityText: {
    paddingHorizontal: 16,
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
    color: colors.text,
    backgroundColor: colors.background,
    paddingVertical: 8,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 28,
    elevation: 2,
    shadowColor: colors.primary + '80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledAddToCart: {
    backgroundColor: colors.primary + '80',
  },
  reviewsSection: {
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: colors.text,
  },
  reviewItem: {
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontWeight: '600',
    color: colors.text,
  },
  reviewRating: {
    color: colors.primary,
    fontWeight: '600',
  },
  reviewText: {
    marginBottom: 12,
    lineHeight: 22,
    color: colors.text + 'E6',
  },
  reviewDate: {
    fontSize: 12,
    color: colors.text + '99',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    fontSize: 28,
    marginRight: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    marginBottom: 20,
    textAlignVertical: 'top',
    color: colors.text,
    backgroundColor: colors.card,
    fontSize: 16,
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.primary + '80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingIndicator: {
    marginVertical: 32,
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
