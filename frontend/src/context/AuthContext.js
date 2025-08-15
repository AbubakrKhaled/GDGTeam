import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState(null);

  const logout = useCallback(async () => {
    try {
      // Call appropriate logout API based on user type
      if (userType === 'admin') {
        await adminApi.adminLogout();
      } else if (userType === 'brand') {
        await brandApi.brandLogout();
      } else if (userType === 'customer') {
        await customerApi.customerLogout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('currentUserId');
      setUser(null);
      setUserType(null);
      setLoading(false);
    }
  }, [userType]);

  const fetchUserProfile = useCallback(async (type) => {
    try {
      setLoading(true);
      let response;
      switch (type) {
        case 'customer':
          response = await customerApi.getCustomerProfile();
          break;
        case 'brand':
          response = await brandApi.getBrandProfile();
          break;
        case 'admin':
          response = await adminApi.getAdminDashboard();
          break;
        default:
          throw new Error('Invalid user type');
      }
      
      setUser(response.data?.data || response.data || response);
      setUserType(type);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
      setError(error.response?.data?.message || 'Session expired');
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    if (token && storedUserType) {
      fetchUserProfile(storedUserType);
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  const login = async (email, password, type) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (type) {
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

      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', type);
      localStorage.setItem('currentUserId', userData.id);

      setUser(userData);
      setUserType(type);
      
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data, type) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (type) {
        case 'customer':
          response = await customerApi.signupCustomer(data);
          break;
        case 'brand':
          response = await brandApi.createBrand(data);
          break;
        default:
          throw new Error('Invalid user type');
      }

      // Auto-login after signup
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', type);
        localStorage.setItem('currentUserId', response.data.user.id);
        setUser(response.data.user);
        setUserType(type);
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userType,
    loading,
    error,
    login,
    signup,
    logout,
    fetchUserProfile,
    isAuthenticated: !!user && !!userType
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};