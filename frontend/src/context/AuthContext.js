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
          //profile = await apiService.getCustomerProfile();
          //profile = await mockApiService.getCustomerProfile();
          profile = await customerApi.getCustomerProfile();
          break;
        case 'brand':
          //profile = await apiService.getBrandProfile();
          //profile = await mockApiService.getBrandProfile(); 
          profile = await brandApi.getBrandProfile();
          break;
        case 'admin':
          //profile = { data: { role: 'admin', name: 'Admin User' } };
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

      localStorage.setItem("accessToken", token);
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
      // const response = await apiService.login(email, password, type);
      //const response = await mockApiService.login(email, password, type);
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

  const signupCustomer = async (userData) => {
    try {
      //const response = await apiService.signup(userData, type);
      //const response = await mockApiService.signup(userData, type);
      const response = await customerApi.signupCustomer(userData)
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
    signupCustomer,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 