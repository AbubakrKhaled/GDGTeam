const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password, userType = 'customer') {
    const endpoint = userType === 'admin' ? '/admin/login' : `/${userType}/login`;
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData, userType = 'customer') {
    return this.request(`/${userType}`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Customer APIs
  async getCustomerProfile() {
    return this.request('/customer/profile');
  }

  async updateCustomerProfile(profileData) {
    return this.request('/customer/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getCustomerWishlist() {
    return this.request('/customer/wishlist');
  }

  async addToWishlist(productId) {
    return this.request('/customer/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/customer/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  async getCustomerCart() {
    return this.request('/customer/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/customer/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request(`/customer/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.request(`/customer/cart/${productId}`, {
      method: 'DELETE',
    });
  }

  async createOrder(orderData) {
    return this.request('/customer/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getCustomerOrders() {
    return this.request('/customer/orders');
  }

  async getOrderById(orderId) {
    return this.request(`/customer/orders/${orderId}`);
  }

  // Product APIs
  async getAllProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/products${queryParams ? `?${queryParams}` : ''}`);
  }

  async getProductById(productId) {
    return this.request(`/products/${productId}`);
  }

  async searchProducts(query) {
    return this.request(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // Brand APIs
  async getBrandProfile() {
    return this.request('/brand/profile');
  }

  async updateBrandProfile(profileData) {
    return this.request('/brand/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getBrandProducts() {
    return this.request('/brand/products');
  }

  async createProduct(productData) {
    return this.request('/brand/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId, productData) {
    return this.request(`/brand/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId) {
    return this.request(`/brand/products/${productId}`, {
      method: 'DELETE',
    });
  }

  async getBrandOrders() {
    return this.request('/brand/orders');
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/brand/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Admin APIs
  async getAllBrands() {
    return this.request('/admin/brands');
  }

  async approveBrand(brandId, isApproved) {
    return this.request(`/admin/brands/${brandId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ isApproved }),
    });
  }

  async getAllCustomers() {
    return this.request('/admin/customers');
  }

  async getAllOrders() {
    return this.request('/admin/orders');
  }
}

// Create an instance of ApiService
const apiService = new ApiService();

// Export the instance as default
export default apiService;