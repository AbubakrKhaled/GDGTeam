//import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaStar, 
  FaArrowLeft, 
  FaShare, 
  FaTruck, 
  FaShieldAlt,
  FaUndo
} from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { productApi } from '../api/product';
import { cartApi } from '../api/cart';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const loadRelatedProducts = useCallback(async (category) => {
    try {
      const response = await productApi.getAllProducts({ category });
      // Filter out current product and limit to 4
      const filtered = response.data.data
        .filter(p => p._id !== id)
        .slice(0, 4);
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Failed to load related products:', error);
    }
  }, [id]);

  const checkWishlistStatus = useCallback(async () => {
    try {
      const response = await cartApi.getWishlist();
      console.log(response)
      const wishlistIds = response.data.wishlist.map(item => item._id);
      setIsInWishlist(wishlistIds.includes(id));
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  }, [id]);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productApi.getProductById(id);
      setProduct(response.data.data);
      if (response.data.data.category) {
        await loadRelatedProducts(response.data.data.category);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id, loadRelatedProducts]);

  useEffect(() => {
    loadProduct();
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [id, isAuthenticated, loadProduct, checkWishlistStatus]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      console.log('Adding to cart:', product);
      await cartApi.addToCart(product._id)
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    
    try {
      //await apiService.addToWishlist(product._id);
      await cartApi.addToWishlist(product._id);
      setIsInWishlist(true);
      toast.success('Product added to wishlist!');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast.error('Failed to add product to wishlist');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.productname,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Normalize imageURL to an array
  const primaryImages = Array.isArray(product?.imageURL)
    ? product.imageURL
    : (product?.imageURL ? [product.imageURL] : []);

  const productImages = [
    ...primaryImages
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-600 hover:text-pink-600"
          >
            <FaArrowLeft className="mr-2" />
            Back to Products
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={productImages[activeImage]}
                alt={product.productname}
                className="w-full h-96 object-cover rounded-lg"
              />
              <button
                onClick={handleAddToWishlist}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${
                  isInWishlist ? 'bg-pink-600 text-white' : 'bg-white text-gray-400 hover:text-pink-600'
                } transition-colors`}
              >
                <FaHeart />
              </button>
              <button
                onClick={handleShare}
                className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-pink-600 transition-colors"
              >
                <FaShare />
              </button>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    activeImage === index ? 'border-pink-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.productname} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.productname}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                By {product.brand?.name}
              </p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (product.reviews?.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">
                  {product.reviews?.rating || 0} ({product.reviews?.count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-pink-600 mb-4">
                ${product.price}
              </div>

              {/* Stock Status */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.quantity > 0 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-red-600 bg-red-100'
              }`}>
                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(Math.min(product.quantity, selectedQuantity + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Size (if applicable) */}
              {product.category === 'Clothes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <div className="flex space-x-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md ${
                          selectedSize === size
                            ? 'border-pink-600 bg-pink-50 text-pink-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color (if applicable) */}
              {product.category === 'Clothes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex space-x-2">
                    {['Black', 'White', 'Blue', 'Red', 'Green'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-md ${
                          selectedColor === color
                            ? 'border-pink-600 bg-pink-50 text-pink-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={handleAddToWishlist}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
              >
                <FaHeart />
                <span>{isInWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <FaTruck className="text-pink-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="text-pink-600" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUndo className="text-pink-600" />
                  <span className="text-sm text-gray-600">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/products/${relatedProduct._id}`)}
              >
                <img
                  src={relatedProduct.imageURL}
                  alt={relatedProduct.productname}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {relatedProduct.productname}
                  </h3>
                  <p className="text-pink-600 font-bold">${relatedProduct.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;