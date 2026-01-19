'use client';

import { createContext, useContext, useReducer, useEffect, useState  } from 'react';

/**
 * CART STORAGE STRATEGY - LOCALSTORAGE ONLY
 * 
 * Current Implementation:
 * - Cart stored in browser localStorage only
 * - Persists across sessions (same browser)
 * - Shared between anonymous and logged-in users
 * - No server synchronization
 * 
 * SCALING CONSIDERATIONS:
 * If the business grows or requirements change, consider:
 * 
 * 1. SERVER SYNCHRONIZATION (Multi-device support)
 *    - Save cart to MongoDB per user
 *    - Merge localStorage + server cart on login
 *    - Enable cart recovery across devices
 *    - API: POST /api/cart/sync
 * 
 * 2. CART ANALYTICS (Abandoned cart tracking)
 *    - Track cart additions/removals
 *    - Email reminders for abandoned carts
 *    - Conversion funnel analysis
 * 
 * 3. EXPIRATION POLICY (Prevent stale data)
 *    - Add timestamp to cart items
 *    - Auto-clear carts older than 30 days
 *    - Re-check artwork availability on load
 * 
 * 4. PERFORMANCE (High traffic)
 *    - Consider Redis for cart caching
 *    - Implement cart item reservations
 *    - Add queue system for checkout
 * 
 * Current approach is optimal for:
 * - Art gallery with limited inventory
 * - Low to medium traffic
 * - Simple purchasing flow
 */

const CartContext = createContext();
const CART_STORAGE_KEY = 'cart'; // Change if migrating to user-specific carts
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Verificar si ya existe
      const existingIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingIndex > -1) {
        // Ya existe, no hacer nada (artworks son únicos)
        return state;
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
    setIsInitialized(true);
  }, []);


  // Save to localStorage on change
  useEffect(() => {
    if (isInitialized) { // ← Solo guardar después de cargar
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, isInitialized]);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const total = state.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount: state.items.length,
        total,
        addItem,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};