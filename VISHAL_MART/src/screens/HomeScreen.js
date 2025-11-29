import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../state/authContext';
import ProductCard from '../components/product/Productcard';

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

    products.push({
      id: i,
      name: `${adj} ${noun}`,
      description: `Experience the best with our ${adj.toLowerCase()} ${noun.toLowerCase()}. Top quality ${category} item for your daily needs.`,
      price: Math.floor(Math.random() * 5000) + 499,
      stock: Math.floor(Math.random() * 195) + 5,
      image: `https://source.unsplash.com/random/500x500/?product,item,${i}`,
      category: category
    });
  }
  return products;
};

const HomeScreen = ({ navigation }) => {
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
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Vishal Mart</Text>
        <Button title="Logout" onPress={handleLogout} color="#FF6347" />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, selectedCategory === cat && styles.selectedCategoryButton]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.selectedCategoryText]}>
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
        contentContainerStyle={styles.list}
        numColumns={2}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </SafeAreaView>
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
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
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
});

export default HomeScreen;
