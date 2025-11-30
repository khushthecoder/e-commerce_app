import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../components/layout/container';
import { useAuth } from '../state/authContext';
import { useOrder } from '../state/orderContext';
import { useTheme } from '../theme/ThemeContext';

const getStatusColor = (status, colors) => {
  switch (status) {
    case 'Delivered':
      return colors.success;
    case 'Shipped':
      return colors.primary;
    case 'Processing':
      return colors.warning;
    case 'Cancelled':
      return colors.danger;
    default:
      return colors.subText;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Delivered':
      return 'check-circle';
    case 'Shipped':
      return 'local-shipping';
    case 'Processing':
      return 'access-time';
    case 'Cancelled':
      return 'cancel';
    default:
      return 'info-outline';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

const OrderCard = ({ order, styles, colors }) => {
  const statusColor = getStatusColor(order.status, colors);
  const statusIcon = getStatusIcon(order.status);
  const badgeBackgroundColor = statusColor + '20'; 

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>ID: {order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: badgeBackgroundColor }]}>
          <MaterialIcons name={statusIcon} size={14} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
        </View>
      </View>
      <Text style={styles.dateText}>{formatDate(order.date)}</Text>
      <View style={styles.divider} />
      <View style={styles.itemsContainer}>
        <Text style={styles.sectionLabel}>Items:</Text>
        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name} <Text style={styles.itemQty}>x{item.quantity}</Text>
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.itemText}>{order.itemsCount} items</Text>
        )}
      </View>

      <View style={styles.divider} />
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalAmount}>₹{order.totalAmount?.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const OrderHistoryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { orders, getOrdersForUser, isLoading } = useOrder();
  const { colors, createStyles } = useTheme();
  const styles = createStyles(stylesConfig);

  useEffect(() => {
    if (user?.id) {
      getOrdersForUser(user.id);
    }
  }, [user, getOrdersForUser]);

  const userOrders = orders[user?.id] || [];

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.screenTitle}>Order History</Text>
        </View>

        {isLoading && userOrders.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : userOrders.length === 0 ? (
          <View style={styles.centerContainer}>
            <MaterialIcons name="receipt-long" size={64} color={colors.subText} />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>Start shopping to see your orders here.</Text>
          </View>
        ) : (
          <FlatList
            data={userOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <OrderCard
                order={item}
                styles={styles}
                colors={colors}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Container>
  );
};

const stylesConfig = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.subText,
    marginTop: 8,
    textAlign: 'center',
  },

  // Card Styles
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'System', 
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12, 
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 14,
    color: colors.subText,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  itemsContainer: {
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 12,
    color: colors.subText,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRow: {
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  itemQty: {
    color: colors.subText,
    fontWeight: 'normal',
  },
  itemText: {
    fontSize: 15,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default OrderHistoryScreen;
