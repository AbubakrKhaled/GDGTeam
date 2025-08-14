import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaStore, FaPlus, FaMinus } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: 'customer',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
    gender: '',
    address: '',
    // Brand specific fields
    categories: [],
    page: [],
    brandlocation: [],
    logoURL: '',
    deliveryTime: '',
    description: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPage, setNewPage] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phonenumber: formData.phonenumber,
        ...(formData.userType === 'customer' && { gender: formData.gender , address : formData.address }),
        ...(formData.userType === 'brand' && {
          categories: formData.categories,
          page: formData.page,
          brandlocation: formData.brandlocation,
          logoURL: formData.logoURL,
          deliveryTime: formData.deliveryTime,
          description: formData.description
        })
      };

      const result = await signup(signupData, formData.userType);
      
      if (result.success) {
        toast.success('Account created successfully! Please wait for approval if you registered as a brand.');
        navigate('/login');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
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

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const addPage = () => {
    if (newPage.trim() && !formData.page.includes(newPage.trim())) {
      setFormData(prev => ({
        ...prev,
        page: [...prev.page, newPage.trim()]
      }));
      setNewPage('');
    }
  };

  const removePage = (page) => {
    setFormData(prev => ({
      ...prev,
      page: prev.page.filter(p => p !== page)
    }));
  };

  const addLocation = () => {
    if (newLocation.trim() && !formData.brandlocation.includes(newLocation.trim())) {
      setFormData(prev => ({
        ...prev,
        brandlocation: [...prev.brandlocation, newLocation.trim()]
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      brandlocation: prev.brandlocation.filter(l => l !== location)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join BrandHub and start your journey
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to register as:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.userType === 'customer'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={formData.userType === 'customer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <FaUser className={`text-xl ${
                    formData.userType === 'customer' ? 'text-pink-600' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className={`font-medium ${
                      formData.userType === 'customer' ? 'text-pink-900' : 'text-gray-900'
                    }`}>
                      Customer
                    </div>
                    <div className="text-sm text-gray-500">Shop and browse products</div>
                  </div>
                </div>
                {formData.userType === 'customer' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-pink-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </label>

              <label
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.userType === 'brand'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value="brand"
                  checked={formData.userType === 'brand'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <FaStore className={`text-xl ${
                    formData.userType === 'brand' ? 'text-pink-600' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className={`font-medium ${
                      formData.userType === 'brand' ? 'text-pink-900' : 'text-gray-900'
                    }`}>
                      Brand
                    </div>
                    <div className="text-sm text-gray-500">Sell your products</div>
                  </div>
                </div>
                {formData.userType === 'brand' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-pink-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.userType === 'brand' ? 'Brand Name' : 'Full Name'}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={formData.userType === 'brand' ? 'Enter brand name' : 'Enter your full name'}
                />
              </div>

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
                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phonenumber"
                  name="phonenumber"
                  type="tel"
                  required
                  value={formData.phonenumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              {formData.userType === 'customer' && (
                  <>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                          id="gender"
                          name="gender"
                          required
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                          id="address"
                          name="address"
                          rows={2}
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter your address"
                      />
                    </div>
                  </>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Enter password"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Brand Specific Fields */}
            {formData.userType === 'brand' && (
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900">Brand Information</h3>
                
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Categories
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="ml-2 text-pink-600 hover:text-pink-800"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add category"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Social Media Pages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Pages
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.page.map((page, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {page}
                        <button
                          type="button"
                          onClick={() => removePage(page)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newPage}
                      onChange={(e) => setNewPage(e.target.value)}
                      placeholder="Add social media page"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      type="button"
                      onClick={addPage}
                      className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Brand Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Locations
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.brandlocation.map((location, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {location}
                        <button
                          type="button"
                          onClick={() => removeLocation(location)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Add location"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      type="button"
                      onClick={addLocation}
                      className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="logoURL" className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      id="logoURL"
                      name="logoURL"
                      type="url"
                      value={formData.logoURL}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter logo URL"
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time
                    </label>
                    <input
                      id="deliveryTime"
                      name="deliveryTime"
                      type="text"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="e.g., 3-5 business days"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Tell us about your brand..."
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-pink-600 hover:text-pink-500">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-pink-600 hover:text-pink-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
