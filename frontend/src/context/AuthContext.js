//import apiService from '../services/api';
import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
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

  // Logout function memoized so it doesn't change every render
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('currentUserId');
    setUser(null);
    setUserType(null);
    setLoading(false);
  }, []);

  // Fetch profile memoized with stable logout
  const fetchUserProfile = useCallback(
    async (type, userId) => {
      try {
        let profile;
        switch (type) {
          case 'customer':
            profile = await customerApi.getCustomerProfile();
            break;
          case 'brand':
            profile = await brandApi.getBrandProfile(userId);
            break;
          case 'admin':
            profile = await adminApi.getAdminDashboard();
            break;
          default:
            throw new Error('Invalid user type');
        }
        setUser(profile.data.data.brand || profile.data.data || profile);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);

        // Only logout if it's an authentication error (401 or 403)
        // Don't logout for network errors or server issues
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log('Authentication error - logging out');
          logout();
        } else {
          // For other errors (network, server issues), try to maintain session
          // Set user from localStorage if available, or keep existing state
          const storedUserType = localStorage.getItem('userType');
          const currentUserId = localStorage.getItem('currentUserId');

          if (storedUserType && currentUserId) {
            // Create a minimal user object to maintain session
            setUser({ id: currentUserId, userType: storedUserType });
            console.log('Network error, maintaining session with stored data');
          }
          setLoading(false);
        }
      }
    },
    [logout]
  );

  // On mount, check if logged in and fetch profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('currentUserId');
    const storedUserType = localStorage.getItem('userType');
    if (token && storedUserType && currentUserId) {
      setUserType(storedUserType);
      fetchUserProfile(storedUserType, currentUserId);
    } else {
      setUser(null); //added
      setUserType(null); //added
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Login method
  const login = async (email, password, type) => {
    try {
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

      const { token, user } = response.data || response;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', type);
      localStorage.setItem('currentUserId', user.id);

      setUserType(type);
      //setUser(user);
      // Only setUser once, and if you want full profile, fetch it after login
      if (type === 'brand' && user.id) {
        try {
          const profileRes = await brandApi.getBrandProfile(user.id);
          setUser(profileRes.data.data.brand || profileRes.data.data || user);
        } catch (err) {
          setUser(user); // fallback to minimal user if profile fetch fails
        }
      } else {
        setUser(user);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Signup method
  const signup = async (data, type) => {
    try {
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
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userType,
    loading,
    login,
    signup,
    logout,
    fetchUserProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
