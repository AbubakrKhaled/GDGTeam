import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
//import apiService from '../services/api'; 
import{updateCustomer} from '../api/customer'
import{updateBrand} from '../api/brand'
import {getWishlist, deleteWishlistProduct} from '../api/cart'
import { FaHeart, FaShoppingBag, FaUser, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { getOrders } from '../api/order';

function Profile() {
  const { user, userType } = useAuth();
  const { getCartCount } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phonenumber: '',
    gender: '',
    addresses: []
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phonenumber: user.phonenumber || '',
        gender: user.gender || '',
        addresses: user.addresses || []
      });
    }
  }, [user]);

  useEffect(() => {
    if (userType === 'customer') {
      loadWishlist();
      loadOrders();
    }
  }, [userType]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
        const response = await getWishlist();
      setWishlist(response.data || []);

    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
        //await apiService.removeFromWishlist(productId);
        await deleteWishlistProduct(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateCustomer(e);
      await updateBrand(e)
      setEditMode(false);
      // Reload user data
      window.location.reload();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = () => {
    setProfileData(prev => ({
      ...prev,
      addresses: [...prev.addresses, {
        label: '',
        line1: '',
        city: '',
        governorate: '',
        zip: '',
        isDefault: false
      }]
    }));
  };

  const updateAddress = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) =>
        i === index ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const removeAddress = (index) => {
    setProfileData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaUser className="text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-pink-100">{user.email}</p>
              <div className="flex space-x-4 mt-2 text-sm">
                <span className="flex items-center">
                  <FaHeart className="mr-1" />
                  {wishlist.length} Wishlist items
                </span>
                <span className="flex items-center">
                  <FaShoppingBag className="mr-1" />
                  {getCartCount()} Cart items
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profile', label: 'Profile', icon: FaUser },
              { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
              { id: 'orders', label: 'Orders', icon: FaShoppingBag },
              { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  <FaEdit />
                  <span>{editMode ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              <form onSubmit={updateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phonenumber}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phonenumber: e.target.value }))}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {editMode && (
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="text-center py-8">
                  <FaHeart className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={item.imageURL || 'https://via.placeholder.com/200x200?text=Product'}
                        alt={item.productname}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <h3 className="font-semibold text-lg mb-2">{item.productname}</h3>
                      <p className="text-pink-600 font-bold mb-2">${item.price}</p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                        <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Order History</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <FaShoppingBag className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
                          <p className="text-gray-600 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{item.product?.productname || 'Product'}</span>
                            <span className="text-gray-600">{item.price} $ x {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-lg">{order.totalPrice} $</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Addresses</h2>
                <button
                  onClick={addAddress}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                >
                  Add Address
                </button>
              </div>

              <div className="space-y-4">
                {profileData.addresses.map((address, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Label (e.g., Home, Work)
                        </label>
                        <input
                          type="text"
                          value={address.label}
                          onChange={(e) => updateAddress(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          value={address.line1}
                          onChange={(e) => updateAddress(index, 'line1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => updateAddress(index, 'city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Governorate
                        </label>
                        <input
                          type="text"
                          value={address.governorate}
                          onChange={(e) => updateAddress(index, 'governorate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={address.zip}
                          onChange={(e) => updateAddress(index, 'zip', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={address.isDefault}
                            onChange={(e) => updateAddress(index, 'isDefault', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm">Default Address</span>
                        </label>
                        <button
                          onClick={() => removeAddress(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {profileData.addresses.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Addresses'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
