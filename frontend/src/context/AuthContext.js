import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApiService, mockCustomer, mockBrand } from '../services/mockData';
//import apiService from '../services/api';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'customer', 'brand', 'admin'

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    
    if (token && storedUserType) {
      setUserType(storedUserType);
      // Fetch user profile
      fetchUserProfile(storedUserType);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (type) => {
    try {
      let profile;
      switch (type) {
        case 'customer':
          //profile = await apiService.getCustomerProfile();
          profile = await mockApiService.getCustomerProfile();
          break;
        case 'brand':
          //profile = await apiService.getBrandProfile();
          profile = await mockApiService.getBrandProfile();
          break;
        case 'admin':
          // Admin profile might be different
          profile = { data: { role: 'admin', name: 'Admin User' } };
          break;
        default:
          throw new Error('Invalid user type');
      }
      setUser(profile.data || profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, type = 'customer') => {
    try {
      //      const response = await apiService.login(email, password, type);
      const response = await mockApiService.login(email, password, type);
      const { token, user } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userType', type);
      localStorage.setItem('currentUserId', user._id);
      
      setUserType(type);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData, type = 'customer') => {
    try {
      //const response = await apiService.signup(userData, type);
      const response = await mockApiService.signup(userData, type);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
  };

  const value = {
    user,
    userType,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 