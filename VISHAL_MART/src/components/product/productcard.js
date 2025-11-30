import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

const ProductCard = ({ product, onPress }) => {
  const { colors, styles } = useTheme();
  const themedStyles = styles(createStyles);
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return null;
  }

  return (
    <TouchableOpacity style={themedStyles.card} onPress={onPress}>
      <View style={themedStyles.imageContainer}>
        <Image
          source={{ uri: imageError ? 'https://placehold.co/600x400/png' : product.image }}
          style={themedStyles.image}
          onError={() => setImageError(true)}
        />
      </View>
      <View style={themedStyles.details}>
        <Text style={themedStyles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={themedStyles.price}>₹{product.price.toFixed(2)}</Text>
        <Text style={themedStyles.description} numberOfLines={2}>
          {product.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors) => ({
  card: {
    width: cardWidth,
    backgroundColor: colors.card,
    borderRadius: 10,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    backgroundColor: colors.background,
  },
  details: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.8,
    lineHeight: 16,
  },
});

export default ProductCard;
