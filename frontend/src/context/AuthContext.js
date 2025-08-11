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

  const login = async (email,password ,userType) => {
    try {
      let response;
      switch (userType) {
        case 'customer':
          response = await customerApi.loginCustomer(email, password);
          break;
        case 'brand':
          response = await brandApi.brandLogin(email, password);
          break;
        case 'admin':
          response = await adminApi.adminLogin(email, password);
          break;
        default:
          throw new Error('Invalid user type');
      }

      const { token, user } = response.data || response;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('currentUserId', user.id);

      setUserType(userType);
      setUser(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }


  const signup = async (data , userType)=>{
    try {
      let response;
      switch (userType) {
        case 'customer':
          response = await customerApi.signupCustomer(data);
          break;
        case 'brand':
          response = await brandApi.createBrand(data);
          break;
        default:
          throw new Error('Invalid user type');
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

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