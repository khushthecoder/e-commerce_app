import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '../state/authContext';
import ProductCard from '../components/product/ProductCard';
import { useTheme } from '../theme/ThemeContext';

import { PRODUCT_IMAGES } from '../constants/productImages';



const generateDummyProducts = () => {
  const products = [];
  const categories = ['Shoes', 'Electronics', 'Watches', 'Bags', 'Clothing', 'Accessories'];
  const adjectives = ['Premium', 'Stylish', 'Durable', 'Compact', 'Luxury', 'Modern', 'Classic', 'Sporty', 'Elegant'];
  const nouns = {
    'Shoes': ['Running Shoes', 'Sneakers', 'Boots', 'Sandals', 'Loafers'],
    'Electronics': ['Headphones', 'Speaker', 'Power Bank', 'Charger', 'Earbuds'],
    'Watches': ['Smart Watch', 'Analog Watch', 'Digital Watch', 'Strap'],
    'Bags': ['Backpack', 'Handbag', 'Laptop Bag', 'Tote Bag', 'Wallet'],
    'Clothing': ['T-Shirt', 'Jeans', 'Jacket', 'Hoodie', 'Shirt'],
    'Accessories': ['Sunglasses', 'Belt', 'Cap', 'Scarf', 'Gloves']
  };

  for (let i = 1; i <= 1000; i++) {
    const category = categories[i % categories.length];
    const nounList = nouns[category];
    const noun = nounList[i % nounList.length];
    const adj = adjectives[i % adjectives.length];
    const nounImages = PRODUCT_IMAGES[noun] || [];
    const image = nounImages.length > 0
      ? nounImages[i % nounImages.length]
      : `https://loremflickr.com/600/600/${noun.replace(' ', ',')}?lock=${i}`;

    products.push({
      id: i,
      name: `${adj} ${noun}`,
      description: `Experience the best with our ${adj.toLowerCase()} ${noun.toLowerCase()}. Top quality ${category} item for your daily needs.`,
      price: Math.floor(Math.random() * 5000) + 499,
      stock: Math.floor(Math.random() * 195) + 5,
      image: image,
      category: category
    });
  }
  return products;
};

const HomeScreen = ({ navigation }) => {
  const { colors, styles } = useTheme();
  const themedStyles = styles(stylesConfig);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { logout } = useAuth();

  const categories = ['All', 'Shoes', 'Electronics', 'Watches', 'Bags', 'Clothing', 'Accessories'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    const generated = generateDummyProducts();
    setAllProducts(generated);
    setProducts(generated);
    setLoading(false);
  };

  useEffect(() => {
    filterProducts();
  }, [search, selectedCategory, allProducts]);

  const filterProducts = () => {
    let filtered = allProducts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setProducts(filtered);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout Error:', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
      </View>
    );
  }

  return (
    <SafeAreaView style={themedStyles.container} edges={['top']}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.sectionTitle}>Vishal Mart</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={themedStyles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={themedStyles.searchContainer}>
        <TextInput
          placeholder="Search products..."
          placeholderTextColor={colors.text}
          value={search}
          onChangeText={setSearch}
          style={themedStyles.searchInput}
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
        />
      </View>

      <View style={themedStyles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                themedStyles.categoryButton,
                selectedCategory === cat && themedStyles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  themedStyles.categoryText,
                  selectedCategory === cat && themedStyles.categoryTextActive
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
        contentContainerStyle={themedStyles.productList}
        numColumns={2}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </SafeAreaView>
  );
};

const stylesConfig = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 15,
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.card,
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginHorizontal: 5,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.text,
    fontWeight: '500',
    opacity: 0.9,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    opacity: 1,
  },
  selectedCat: {
    color: colors.text,
    fontWeight: 'bold',
  },
  productList: {
    paddingHorizontal: 10,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: 20,
  },
  logoutButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default HomeScreen;
