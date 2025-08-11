import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApiService, mockCustomer, mockBrand } from '../services/mockData';
//import apiService from '../services/api';
import { brandApi } from '../api/brand';
import { adminApi } from '../api/admin';
import { customerApi } from '../api/customer';

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
          profile = await customerApi.getCustomerProfile();
          break;
        case 'brand':
          profile = await brandApi.getBrandProfile();
          break;
        case 'admin':
          profile = await adminApi.getAdminDashboard();
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


  const loginAdmin = async (username, password) => {
    try {
      const res = await adminApi.adminLogin(username, password);
      const { token, admin } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userType", "admin");

      setUserType("admin");
      setUser(admin);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const loginCustomer = async (email, password) => {
    try {
      const response = await customerApi.loginCustomer(email, password);
      const { token, customer } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userType', 'customer');
      localStorage.setItem('currentUserId', customer._id);
      
      setUserType('customer');
      setUser(customer);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginBrand = async (email, password) => {
    try {
      const response = await brandApi.brandLogin(email, password);
      const { token, brand } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userType', 'brand');
      localStorage.setItem('currentUserId', brand._id);
      
      setUserType('brand');
      setUser(brand);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

const createBrand = async (brandData) => {
    try {
      const response = await brandApi.createBrand(brandData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };


  const signupCustomer = async (email, password) => {
    try {
      const response = await customerApi.signupCustomer({email, password});
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('currentUserId');
    setUser(null);
    setUserType(null);
  };

  const value = {
    user,
    userType,
    loading,
    loginAdmin,
    loginCustomer,
    loginBrand,
    signupCustomer,
    createBrand,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 