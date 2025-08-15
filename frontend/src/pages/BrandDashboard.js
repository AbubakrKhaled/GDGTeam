import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaBox, 
  FaShoppingBag, 
  FaUser, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTruck
} from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { brandApi } from '../api/brand';

function BrandDashboard() {
  const { user, userType } = useAuth();
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    productname: '',
    price: '',
    quantity: '',
    description: '',
    imageURL: '',
    category: '',
    color: '#000000',
    size: '',
    discountAmount: '',
    isDiscountValid: '',
    reviews: ''
  });

  useEffect(() => {
    if (!showAddProduct && !showEditProduct) return;

    const fetchData = async () => {
      try {
        setLoadingCategories(true);
        setLoadingSizes(true);
        
        console.log('Fetching categories and sizes...');
        
        const [categoriesRes, sizesRes] = await Promise.all([
          brandApi.productcategories(),
          brandApi.productsizes()
        ]);
        
        console.log('Categories response:', categoriesRes);
        console.log('Sizes response:', sizesRes);
        
        // Extract the data array from the response
        const categoriesData = categoriesRes.data?.data || categoriesRes.data || [];
        const sizesData = sizesRes.data?.data || sizesRes.data || [];
        
        setCategories(categoriesData);
        setSizes(sizesData);
        
        console.log('Categories set:', categoriesData);
        console.log('Sizes set:', sizesData);
      } catch (err) {
        console.error('Error fetching categories/sizes:', err);
        toast.error('Failed to load categories and sizes');
      } finally {
        setLoadingCategories(false);
        setLoadingSizes(false);
      }
    };
    fetchData();
  }, [showAddProduct, showEditProduct]);

  useEffect(() => {
    if (userType !== 'brand') {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [userType, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        brandApi.getAllProducts(), // Fetch products from backend
        brandApi.getAllOrders()     // Fetch orders from backend
      ]);
      console.log('Products response:', productsRes);
      console.log('Orders response:', ordersRes);
      
      const productsData = productsRes.data?.data || productsRes.data || [];
      const ordersData = ordersRes.data || [];
      
      console.log('Products data to set:', productsData);
      console.log('Orders data to set:', ordersData);
      
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await brandApi.createProduct(productForm);
      console.log('Product created successfully:', response);
      
      toast.success('Product added successfully!');
      
      // Reset form
      setProductForm({
        productname: '',
        price: '',
        quantity: '',
        description: '',
        imageURL: '',
        category: '',
        color: '#000000',
        size: '',
        discountAmount: '',
        isDiscountValid: '',
        reviews: ''
      });
      
      // Close modal
      setShowAddProduct(false);
      
      // Refresh data
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!showEditProduct || !showEditProduct._id) return;
    
    try {
      setLoading(true);
      await brandApi.updateProduct(showEditProduct._id, productForm); // Update product in backend
      setShowEditProduct(null);
      setProductForm({
        productname: '',
        price: '',
        quantity: '',
        description: '',
        imageURL: '',
        category: '',
        color: '#000000',
        size: '',
        discountAmount: '',
        isDiscountValid: '',
        reviews: ''
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await brandApi.updateOrderStatus(orderId, status); // Update order status in backend
      await loadDashboardData();
      toast.success(`Order status updated to ${status}!`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };
  
const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        //await apiService.deleteProduct(productId);
        //await mockApiService.deleteProduct(productId);
        await brandApi.deactivateProduct(productId);
        await loadDashboardData();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const openEditProduct = (product) => {
    setShowEditProduct(product);
    setProductForm({
      productname: product.productname,
      price: product.price,
      quantity: product.quantity,
      description: product.description || '',
      imageURL: product.imageURL || '',
      category: product.category || '',
      color: product.color || '',
      size: product.size || '',
      discountAmount: product.discountAmount || '',
      isDiscountValid: product.isDiscountValid || '',
    });
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'confirmed': return <FaCheckCircle className="text-blue-500" />;
      case 'shipped': return <FaTruck className="text-purple-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
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

  if (!user || userType !== 'brand') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-purple-100">{user.email}</p>
                <div className="flex space-x-6 mt-4 text-sm">
                  <span className="flex items-center">
                    <FaBox className="mr-2" />
                    {products.length} Products
                  </span>
                  <span className="flex items-center">
                    <FaShoppingBag className="mr-2" />
                    {orders.length} Orders
                  </span>
                  <span className="flex items-center">
                    <FaChartLine className="mr-2" />
                    {/*{console.log("res",user)}*/}
                    {user.isApproved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</div>
                <div className="text-purple-100">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FaChartLine },
                { id: 'products', label: 'Products', icon: FaBox },
                { id: 'orders', label: 'Orders', icon: FaShoppingBag },
                { id: 'profile', label: 'Profile', icon: FaUser }
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Products</p>
                      <p className="text-3xl font-bold">{products.length}</p>
                    </div>
                    <FaBox className="text-4xl opacity-50" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Orders</p>
                      <p className="text-3xl font-bold">{orders.length}</p>
                    </div>
                    <FaShoppingBag className="text-4xl opacity-50" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Revenue</p>
                      <p className="text-3xl font-bold">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
                    </div>
                    <FaChartLine className="text-4xl opacity-50" />
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="md:col-span-3">
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          {getOrderStatusIcon(order.status)}
                          <div>
                            <p className="font-medium">Order #{order._id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.total}</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Product Management</h2>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                  >
                    <FaPlus />
                    <span>Add Product</span>
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBox className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No products yet</p>
                    <button
                      onClick={() => setShowAddProduct(true)}
                      className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                    >
                      Add Your First Product
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                        <img
                          src={product.imageURL || 'https://via.placeholder.com/300x200?text=Product'}
                          alt={product.productname}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h3 className="font-semibold text-lg mb-2">{product.productname}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        
                        {/* Product Details */}
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <span className="text-pink-600 font-bold">${product.price}</span>
                            <span className="text-gray-500">Qty: {product.quantity}</span>
                          </div>
                          
                          {/* Category and Size */}
                          <div className="flex flex-wrap gap-2">
                            {product.category && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {product.category}
                              </span>
                            )}
                            {product.size && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                {product.size}
                              </span>
                            )}
                          </div>
                          
                          {/* Color Display */}
                          {product.color && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-600">Color:</span>
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: product.color }}
                                title={product.color}
                              ></div>
                              <span className="text-xs text-gray-500">{product.color}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditProduct(product)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            <FaEdit className="inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                          >
                            <FaTrash />
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
                <h2 className="text-xl font-semibold mb-6">Order Management</h2>
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
                            <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                            <p className="text-gray-600 text-sm">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 text-sm">Customer: {order.customer?.name || 'Unknown'}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <p className="font-bold text-lg mt-2">${order.total}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span>{item.product?.productname || 'Product'}</span>
                              <span className="text-gray-600">${item.price} x {item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center">
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                <strong>Shipping Address:</strong> {order.shippingAddress}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Payment Method:</strong> {order.paymentMethod}
                              </p>
                              {order.notes && (
                                <p className="text-sm text-gray-600">
                                  <strong>Notes:</strong> {order.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {order.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order._id, 'confirmed')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {order.status === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order._id, 'shipped')}
                                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                                >
                                  Mark Shipped
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                >
                                  Mark Delivered
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Brand Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                      <input
                        type="text"
                        value={user.name || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={user.phonenumber || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {user.categories?.map((category, index) => (
                          <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isApproved ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                      }`}>
                        {user.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <p className="text-gray-600">{user.description || 'No description provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={productForm.productname}
                    onChange={(e) => setProductForm(prev => ({ ...prev, productname: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                
                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select a category</option>
                    {loadingCategories ? (
                      <option value="">Loading categories...</option>
                    ) : (!Array.isArray(categories) || categories.length === 0) ? (
                      <option value="">No categories available</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category._id} value={category.category}>
                          {category.category}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Size Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={productForm.size}
                    onChange={(e) => setProductForm(prev => ({ ...prev, size: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select a size</option>
                    {loadingSizes ? (
                      <option value="">Loading sizes...</option>
                    ) : (!Array.isArray(sizes) || sizes.length === 0) ? (
                      <option value="">No sizes available</option>
                    ) : (
                      sizes.map((size) => (
                        <option key={size._id} value={size.size}>
                          {size.size}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={productForm.color}
                      onChange={(e) => setProductForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={productForm.color}
                      onChange={(e) => setProductForm(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageURL}
                    onChange={(e) => setProductForm(prev => ({ ...prev, imageURL: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
              <form onSubmit={handleEditProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={productForm.productname}
                    onChange={(e) => setProductForm(prev => ({ ...prev, productname: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                
                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select a category</option>
                    {loadingCategories ? (
                      <option value="">Loading categories...</option>
                    ) : (!Array.isArray(categories) || categories.length === 0) ? (
                      <option value="">No categories available</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category._id} value={category.category}>
                          {category.category}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Size Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={productForm.size}
                    onChange={(e) => setProductForm(prev => ({ ...prev, size: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select a size</option>
                    {loadingSizes ? (
                      <option value="">Loading sizes...</option>
                    ) : (!Array.isArray(sizes) || sizes.length === 0) ? (
                      <option value="">No sizes available</option>
                    ) : (
                      sizes.map((size) => (
                        <option key={size._id} value={size.size}>
                          {size.size}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={productForm.color}
                      onChange={(e) => setProductForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={productForm.color}
                      onChange={(e) => setProductForm(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageURL}
                    onChange={(e) => setProductForm(prev => ({ ...prev, imageURL: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEditProduct(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// export default BrandDashboard;
//     </div>
//   );
// }

export default BrandDashboard;
