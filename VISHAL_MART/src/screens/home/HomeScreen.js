import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import ProductCard from '../../components/product/productcard';
import { products } from '../../constants/dummyData';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  list: {
    paddingHorizontal: 8,
  },
});

export default HomeScreen;