import React, { createContext, useReducer, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
const initialCartState = {
  items: [], 
  totalAmount: 0,
  totalItems: 0,
};
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);

      let updatedItems;

      if (existingItemIndex > -1) {
        const existingItem = state.items[existingItemIndex];
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = updatedItem;
      } else {
        const newItem = { 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: 1 
        };
        updatedItems = state.items.concat(newItem);
      }
      const newTotalAmount = state.totalAmount + product.price;
      const newTotalItems = state.totalItems + 1;

      return {
        ...state,
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItems: newTotalItems,
      };
    }

    case 'REMOVE_ITEM': {
      const idToRemove = action.payload.id;
      const existingItemIndex = state.items.findIndex(item => item.id === idToRemove);
      const existingItem = state.items[existingItemIndex];

      if (!existingItem) return state; 

      const newTotalAmount = state.totalAmount - existingItem.price;
      const newTotalItems = state.totalItems - 1;

      let updatedItems;

      if (existingItem.quantity === 1) {
        updatedItems = state.items.filter(item => item.id !== idToRemove);
      } else {
        const updatedItem = { ...existingItem, quantity: existingItem.quantity - 1 };
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = updatedItem;
      }

      return {
        ...state,
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItems: newTotalItems,
      };
    }

    case 'CLEAR_CART':
      return initialCartState;

    case 'SET_CART':
        return action.payload;

    default:
      return state;
  }
};

export const CartContext = createContext({
  cartState: initialCartState,
  addItem: (product) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});
export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
  const addItemHandler = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: { product } });
  };

  const removeItemHandler = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const clearCartHandler = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  useEffect(() => {
    const storeCartData = async () => {
      try {
        await AsyncStorage.setItem('cartData', JSON.stringify(cartState));
      } catch (error) {
        console.error("Error storing cart:", error);
      }
    };
    storeCartData();
  }, [cartState]);
  useEffect(() => {
    const loadCartData = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cartData');
        if (storedCart) {
          dispatch({ type: 'SET_CART', payload: JSON.parse(storedCart) });
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCartData();
  }, []);

  const cartContext = {
    cartState: cartState,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    clearCart: clearCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  return useContext(CartContext);
};