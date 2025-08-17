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

        // // Only logout if it's an authentication error (401 or 403)
        // // Don't logout for network errors or server issues
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
        }
      
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