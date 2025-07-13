import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
//import apiService from '../services/api';
import { mockApiService, mockCart } from '../services/mockData';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, userType } = useAuth();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userType === 'customer') {
      loadCart();
    }
  }, [isAuthenticated, userType]);

  const loadCart = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const response = await mockApiService.getCustomerCart();
        setCart(response.data || []);
      } else {
        // Load from localStorage for non-authenticated users
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(localCart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        await mockApiService.addToCart(product._id, quantity);
        await loadCart(); // Reload cart from backend
      } else {
        // Handle local cart for non-authenticated users
        setCart(prevCart => {
          const existingItem = prevCart.find(item => item.product._id === product._id);
          if (existingItem) {
            return prevCart.map(item =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            return [...prevCart, { product, quantity }];
          }
        });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (isAuthenticated) {
        //await apiService.updateCartItem(productId, quantity);
        await mockApiService.updateCartItem(productId, quantity);
        await loadCart();
      } else {
        setCart(prevCart =>
          prevCart.map(item =>
            item.product._id === productId
              ? { ...item, quantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated) {
        //     await apiService.removeFromCart(productId);
        await mockApiService.removeFromCart(productId);
        await loadCart();
      } else {
        setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 