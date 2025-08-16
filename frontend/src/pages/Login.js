import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaStore, FaShieldAlt } from 'react-icons/fa';

function Login() {
  const { login, userType, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectBasedOnUserType = useCallback(() => {
    switch (userType) {
      case 'brand':
        navigate('/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  }, [userType, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      redirectBasedOnUserType();
    }
  }, [isAuthenticated, userType, redirectBasedOnUserType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, formData.userType);
      
      if (result.success) {
        redirectBasedOnUserType();
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const userTypes = [
    { value: 'customer', label: 'Customer', icon: FaUser, description: 'Shop and browse products' },
    { value: 'brand', label: 'Brand', icon: FaStore, description: 'Sell your products' },
    { value: 'admin', label: 'Admin', icon: FaShieldAlt, description: 'Platform management' }
  ];

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setFormData(prev => ({
        ...prev,
        email: 'admin@example.com',
        password: 'supersecurepassword',
        userType: 'admin'
      }));
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-1 gap-3">
              {userTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.userType === type.value
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type.value}
                    checked={formData.userType === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <type.icon className={`text-xl ${
                      formData.userType === type.value ? 'text-pink-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <div className={`font-medium ${
                        formData.userType === type.value ? 'text-pink-900' : 'text-gray-900'
                      }`}>
                        {type.label}
                      </div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </div>
                  {formData.userType === type.value && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-pink-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to our platform?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="font-medium text-pink-600 hover:text-pink-500"
              >
                Create your account
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-pink-600 hover:text-pink-500">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-pink-600 hover:text-pink-500">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;