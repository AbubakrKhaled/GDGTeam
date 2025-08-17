import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaStore, FaBox, FaCheck, FaTimes, FaDollarSign, FaPlus } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { adminApi } from '../api/admin';

function AdminDashboard() {
  const { user, userType, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // New state for category and size management
  const [newCategory, setNewCategory] = useState('');
  const [newSize, setNewSize] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSizes, setLoadingSizes] = useState(false);

  useEffect(() => {
    // Only redirect if user is truly unauthenticated (no token or userType)
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (!token || !userType) {
      navigate('/login');
      return;
    }
    if (!user) {
      // Show loading spinner or nothing, but don't redirect
      return;
    }
    loadDashboardData();
  }, [userType, user, navigate]);

  // Fetch categories and sizes when Product Management tab is active
  useEffect(() => {
    if (activeTab === 'productManagement') {
      loadCategories();
      loadSizes();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, brandsRes, customersRes, ordersRes] = await Promise.all([
        adminApi.getAdminDashboard(), // Fetch admin dashboard data
        adminApi.getAllBrands(),       // Fetch all brands
        adminApi.getAllCustomers(),    // Fetch all customers
        adminApi.getAllOrders(),       // Fetch all orders
      ]);
      console.log("res",dashboardRes.data)
      setDashboardData(dashboardRes.data);
      console.log("res",brandsRes.data.data)
      setBrands(brandsRes.data.data);
      setCustomers(customersRes.data.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBrand = async (brandId) => {
    try {
      await adminApi.brandApprove(brandId); // Approve brand
      await loadDashboardData(); // Reload dashboard data
      toast.success('Brand approved successfully!');
    } catch (error) {
      console.error('Failed to approve brand:', error);
      toast.error('Failed to approve brand');
    }
  };

  const handleRejectBrand = async (brandId) => {
    if (window.confirm('Are you sure you want to reject this brand? This action cannot be undone.')) {
      try {
        await adminApi.brandDisapprove(brandId); // Reject brand
        await loadDashboardData(); // Reload dashboard data
        toast.success('Brand rejected successfully!');
      } catch (error) {
        console.error('Failed to reject brand:', error);
        toast.error('Failed to reject brand');
      }
    }
  };

  const handleDeactivateBrand = async (brandId) => {
    if (window.confirm('Are you sure you want to reject this brand? This action cannot be undone.')) {
      try {
        //await adminApi.brandDisapprove(brandId); // Reject brand
        await adminApi.deactivateBrand(brandId);
        await loadDashboardData(); // Reload dashboard data
        toast.success('Brand deleted successfully!');
      } catch (error) {
        console.error('Failed to delete brand:', error);
        toast.error('Failed to delete brand');
      }
    }
  };

  // New functions for category and size management
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    try {
      console.log('Adding category:', newCategory.trim());
      const response = await adminApi.addCategory(newCategory.trim());
      console.log('Category response:', response);
      setNewCategory('');
      setShowCategoryModal(false);
      toast.success('Category added successfully!');
      // Reload categories after adding
      loadCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(`Failed to add category: ${error.response.data.message || 'Unknown error'}`);
      } else {
        toast.error('Failed to add category');
      }
    }
  };

  const handleAddSize = async () => {
    if (!newSize.trim()) {
      toast.error('Please enter a size name');
      return;
    }
    
    try {
      console.log('Adding size:', newSize.trim());
      const response = await adminApi.addSize(newSize.trim());
      console.log('Size response:', response);
      setNewSize('');
      setShowSizeModal(false);
      toast.success('Size added successfully!');
      // Reload sizes after adding
      loadSizes();
    } catch (error) {
      console.error('Failed to add size:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(`Failed to add size: ${error.response.data.message || 'Unknown error'}`);
      } else {
        toast.error('Failed to add size');
      }
    }
  };

  // Load categories from database
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await adminApi.getAllCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load sizes from database
  const loadSizes = async () => {
    try {
      setLoadingSizes(true);
      const response = await adminApi.getAllSizes();
      setSizes(response.data.data || []);
    } catch (error) {
      console.error('Failed to load sizes:', error);
      toast.error('Failed to load sizes');
    } finally {
      setLoadingSizes(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'admin') {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('brands')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'brands'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Brand Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('productManagement')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'productManagement'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Product Management
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FaUsers className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.totalCustomers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaStore className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Brands</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.totalBrands}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FaBox className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-pink-100 text-pink-600">
                    <FaDollarSign className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${dashboardData.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Brands */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Pending Brand Approvals</h3>
              {dashboardData.pendingBrands.length === 0 ? (
                <p className="text-gray-500">No pending brand approvals</p>
              ) : (
                <div className="space-y-4">
                  {dashboardData.pendingBrands.map((brand) => (
                    <div key={brand._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{brand.name}</h4>
                        <p className="text-sm text-gray-600">{brand.email}</p>
                        <p className="text-sm text-gray-500">{brand.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveBrand(brand._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                          <FaCheck className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectBrand(brand._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                        >
                          <FaTimes className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentOrders.map((order) => {
                      const customerObj = customers.find(c => c._id === order.customer);
                      const brandObj = brands.find(b => b._id === order.brand);
                      return (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customerObj ? customerObj.name : order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {brandObj ? brandObj.name : order.brand}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.products.length} items
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.totalPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">All Brands</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {
                    // console.log("in",brands)
                    brands?.map((brand) => (
                    <tr key={brand._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={brand.logoURL}
                            alt={brand.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                            <div className="text-sm text-gray-500">{brand.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{brand.email}</div>
                        <div className="text-sm text-gray-500">{brand.phonenumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {brand.categories.map((category) => (
                            <span
                              key={category}
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(brand.isApproved ? 'approved' : 'pending')}`}>
                          {brand.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!brand.isApproved ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveBrand(brand._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeactivateBrand(brand._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeactivateBrand(brand._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">All Orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                    const customerObj = customers.find(c => c._id === order.customer);
                    const brandObj = brands.find(b => b._id === order.brand);
                    return (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customerObj ? customerObj.name : order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brandObj ? brandObj.name : order.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.products.length} items</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Management Tab */}
        {activeTab === 'productManagement' && (
          <div className="space-y-6">
            {/* Category Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Category Management</h3>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center space-x-2"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Add new product categories that brands can use when creating products.
              </p>
              {loadingCategories ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading categories...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                                         <tbody className="bg-white divide-y divide-gray-200">
                       {categories.length === 0 ? (
                         <tr>
                           <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                             No categories found
                           </td>
                         </tr>
                       ) : (
                         categories.map((category) => (
                           <tr key={category._id}>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.category}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                               <button
                                 onClick={() => {
                                   // Implement delete category logic here
                                   toast.error('Delete category functionality not yet implemented.');
                                 }}
                                 className="text-red-600 hover:text-red-900"
                               >
                                 <FaTimes className="w-4 h-4" />
                               </button>
                             </td>
                           </tr>
                         ))
                       )}
                     </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Size Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Size Management</h3>
                <button
                  onClick={() => setShowSizeModal(true)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center space-x-2"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Size</span>
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Add new product sizes that brands can use when creating products.
              </p>
              {loadingSizes ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading sizes...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                                         <tbody className="bg-white divide-y divide-gray-200">
                       {sizes.length === 0 ? (
                         <tr>
                           <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                             No sizes found
                           </td>
                         </tr>
                       ) : (
                         sizes.map((size) => (
                           <tr key={size._id}>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{size.size}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                               <button
                                 onClick={() => {
                                   // Implement delete size logic here
                                   toast.error('Delete size functionality not yet implemented.');
                                 }}
                                 className="text-red-600 hover:text-red-900"
                               >
                                 <FaTimes className="w-4 h-4" />
                               </button>
                             </td>
                           </tr>
                         ))
                       )}
                     </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Add Category
                </button>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategory('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Size Modal */}
        {showSizeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Size</h3>
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Enter size name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSize()}
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleAddSize}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Add Size
                </button>
                <button
                  onClick={() => {
                    setShowSizeModal(false);
                    setNewSize('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;