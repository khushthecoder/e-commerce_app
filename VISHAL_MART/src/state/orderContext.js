import React, { createContext, useState, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../constants/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState({}); 
    const [isLoading, setIsLoading] = useState(false);
    const getLocalOrders = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_orders_storage');
            return jsonValue != null ? JSON.parse(jsonValue) : {};
        } catch (e) {
            console.error('Failed to read local orders', e);
            return {};
        }
    };
    const saveLocalOrders = async (newOrdersMap) => {
        try {
            await AsyncStorage.setItem('user_orders_storage', JSON.stringify(newOrdersMap));
        } catch (e) {
            console.error('Failed to save local orders', e);
        }
    };

    const getOrdersForUser = useCallback(async (userId) => {
        if (!userId) return [];

        setIsLoading(true);
        try {
            const jsonValue = await AsyncStorage.getItem(`orders_${userId}`);
            const userOrders = jsonValue != null ? JSON.parse(jsonValue) : [];

            setOrders(prev => ({
                ...prev,
                [userId]: userOrders
            }));

            return userOrders;

        } catch (error) {
            console.log('Fetch failed', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addOrderForUser = useCallback(async (userId, orderData) => {
        if (!userId) return;

        setIsLoading(true);
        const newOrder = {
            ...orderData,
            id: orderData.id || `ORD-${Date.now()}`,
            userId,
            date: new Date().toISOString(),
            status: 'Processing'
        };

        try {
            const jsonValue = await AsyncStorage.getItem(`orders_${userId}`);
            const currentOrders = jsonValue != null ? JSON.parse(jsonValue) : [];
            const updatedOrders = [newOrder, ...currentOrders];
            await AsyncStorage.setItem(`orders_${userId}`, JSON.stringify(updatedOrders));
            setOrders(prev => ({
                ...prev,
                [userId]: updatedOrders
            }));
        } catch (error) {
            console.log('Order placement failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <OrderContext.Provider value={{ orders, isLoading, getOrdersForUser, addOrderForUser }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
