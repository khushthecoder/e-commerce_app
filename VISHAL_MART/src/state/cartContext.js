import React, { createContext, useReducer, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@cart';

const initialCartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isLoading: true
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);

      let updatedItems;

      if (existingItemIndex > -1) {
        const existingItem = state.items[existingItemIndex];
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + quantity
        };
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = updatedItem;
      } else {
        updatedItems = [...state.items, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity
        }];
      }

      return {
        ...state,
        items: updatedItems,
        totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }

    case 'REMOVE_ITEM': {
      const { id, removeAll = false } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === id);

      if (existingItemIndex === -1) return state;

      const existingItem = state.items[existingItemIndex];
      let updatedItems;

      if (removeAll || existingItem.quantity === 1) {
        updatedItems = state.items.filter(item => item.id !== id);
      } else {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity - 1
        };
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = updatedItem;
      }

      return {
        ...state,
        items: updatedItems,
        totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }

    case 'CLEAR_CART':
      return { ...initialCartState, isLoading: false };

    case 'SET_CART':
      return {
        ...action.payload,
        isLoading: false
      };

    default:
      return state;
  }
};

export const CartContext = createContext({
  cartState: initialCartState,
  cartItems: [],
  cartTotal: 0,
  addItem: (product, quantity) => { },
  removeItem: (id, removeAll) => { },
  clearCart: () => { },
});

import { useAuth } from './authContext';

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        dispatch({ type: 'SET_CART', payload: initialCartState });
        return;
      }

      try {
        const storedCart = await AsyncStorage.getItem(`cart_${userId}`);
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          dispatch({ type: 'SET_CART', payload: parsedCart });
        } else {
          dispatch({ type: 'SET_CART', payload: initialCartState });
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
        dispatch({ type: 'SET_CART', payload: initialCartState });
      }
    };

    loadCart();
  }, [userId]);

  useEffect(() => {
    if (!cartState.isLoading && userId) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem(
            `cart_${userId}`,
            JSON.stringify({
              items: cartState.items,
              totalAmount: cartState.totalAmount,
              totalItems: cartState.totalItems
            })
          );
        } catch (error) {
          console.error('Failed to save cart:', error);
        }
      };

      saveCart();
    }
  }, [cartState, userId]);

  const addItem = (product, quantity = 1) => {
    if (!product || !product.id) return;
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity }
    });
  };

  const removeItem = (id, removeAll = false) => {
    if (!id) return;
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id, removeAll }
    });
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (userId) {
      try {
        await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(initialCartState));
      } catch (e) {
        console.error("Failed to clear cart storage", e);
      }
    }
  };

  const value = {
    cartState,
    cartItems: cartState.items || [],
    cartTotal: cartState.totalAmount || 0,
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);