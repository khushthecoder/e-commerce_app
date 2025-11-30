import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../components/layout/container';

const mockOrders = [
  {
    id: 'ORD-1001',
    date: '10 Nov 2025',
    totalAmount: 1250.00,
    status: 'Delivered',
    itemsCount: 3,
    deliveryDate: '15 Nov 2025',
  },
  {
    id: 'ORD-1002',
    date: '15 Nov 2025',
    totalAmount: 599.50,
    status: 'Shipped',
    itemsCount: 2,
    deliveryDate: '20 Nov 2025',
  },
  {
    id: 'ORD-1003',
    date: '17 Nov 2025',
    totalAmount: 3200.00,
    status: 'Processing',
    itemsCount: 5,
    deliveryDate: '24 Nov 2025',
  },
];

const getStatusStyle = (status) => {
    switch (status) {
        case 'Delivered':
            return { color: '#4CAF50', icon: 'check-circle' };
        case 'Shipped':
            return { color: '#007AFF', icon: 'local-shipping' };
        case 'Processing':
            return { color: '#FF9800', icon: 'access-time' };
        case 'Cancelled':
            return { color: '#FF6347', icon: 'cancel' };
        default:
            return { color: '#888', icon: 'info-outline' };
    }
};

const OrderCard = ({ order, navigation }) => {
    const statusInfo = getStatusStyle(order.status);
    
    const handlePress = () => {
        console.log(`Navigating to details for Order ID: ${order.id}`);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.headerRow}>
                <Text style={styles.orderIdText}>ID: {order.id}</Text>
                <View style={styles.statusPill}>
                    <MaterialIcons 
                        name={statusInfo.icon} 
                        size={14} 
                        color={statusInfo.color} 
                        style={styles.statusIcon} 
                    />
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>
                        {order.status}
                    </Text>
                </View>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Date:</Text>
                <Text style={styles.detailValue}>{order.date}</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Items:</Text>
                <Text style={styles.detailValue}>{order.itemsCount}</Text>
            </View>
            
            <View style={[styles.detailRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmountText}>₹{order.totalAmount.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const OrderHistoryScreen = ({ navigation }) => {
  const orders = mockOrders; 

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>Your Previous Orders</Text>
      </View>
      
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="receipt-long" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Abhi Koi Order Nahi Mila.</Text>
          <Text style={styles.emptySubText}>Shopping shuru karne ke liye Home par jaayein.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderCard order={item} navigation={navigation} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#FF9800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusIcon: {
      marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#555',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  }
});

export default OrderHistoryScreen;
