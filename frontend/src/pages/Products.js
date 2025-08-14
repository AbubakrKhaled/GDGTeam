import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaShoppingCart, FaSearch, FaStar } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { productApi } from '../api/product';
import { cartApi } from '../api/cart';

function Products() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    loadProducts();
    if (isAuthenticated) {
      loadWishlist();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedPriceRange]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAllProducts();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await cartApi.getWishlist();
      console.log("fdf",response)
      setWishlistIds((response.data.data || []).map(item => item._id));
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const handleAddToCart = async (product) => { 
    try {
      await cartApi.addToCart(product._id)
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    try {
      await cartApi.addToWishlist(product._id);
      setWishlistIds(prev => [...prev, product._id]);
      toast.success('Product added to wishlist!');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast.error('Failed to add product to wishlist');
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.productname.localeCompare(b.productname);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const categories = ['Clothes', 'Food', 'Skincare', 'Technology'];
  const priceRanges = [
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: 'Over $200' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Discover amazing products from our trusted brands</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Prices</option>
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <FaSearch className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                {/* Product Image */}
                <div className="relative">
                  <div 
                    className="cursor-pointer"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <img
                      src={product.imageURL || 'https://via.placeholder.com/300x300?text=Product'}
                      alt={product.productname}
                      className="w-full h-64 object-cover"
                    />
                    {product.quantity === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product);
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center transition-colors ${
                      wishlistIds.includes(product._id)
                        ? 'text-pink-600'
                        : 'text-gray-400 hover:text-pink-600'
                    }`}
                  >
                    <FaHeart />
                  </button>
                </div>

                {/* Product Info - Flex container that grows */}
                <div className="p-4 flex flex-col flex-1">
                  <div 
                    className="cursor-pointer flex-1"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
                      {product.productname || 'Product Name'}
                    </h3>
                    
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Brand Info */}
                    {product.brand && (
                      <p className="text-sm text-gray-500 mb-2">
                        By {product.brand.name}
                      </p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (product.reviews?.rating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.reviews?.count || 0} reviews)
                      </span>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-pink-600">
                        ${product.price || 0}
                      </span>
                      <span className={`text-sm ${
                        product.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - Always at bottom */}
                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={product.quantity === 0}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FaShoppingCart />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {sortedProducts.length > 0 && sortedProducts.length < products.length && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Products;