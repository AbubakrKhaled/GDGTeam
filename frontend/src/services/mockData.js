// Dynamic mock data service with localStorage persistence - matches backend schema
class MockDataService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize localStorage if empty
    if (!localStorage.getItem('mockCategories')) {
      localStorage.setItem('mockCategories', JSON.stringify(this.getInitialCategories()));
    }
    if (!localStorage.getItem('mockColors')) {
      localStorage.setItem('mockColors', JSON.stringify(this.getInitialColors()));
    }
    if (!localStorage.getItem('mockSizes')) {
      localStorage.setItem('mockSizes', JSON.stringify(this.getInitialSizes()));
    }
    if (!localStorage.getItem('mockDiscounts')) {
      localStorage.setItem('mockDiscounts', JSON.stringify(this.getInitialDiscounts()));
    }
    if (!localStorage.getItem('mockUsers')) {
      localStorage.setItem('mockUsers', JSON.stringify(this.getInitialUsers()));
    }
    if (!localStorage.getItem('mockProducts')) {
      localStorage.setItem('mockProducts', JSON.stringify(this.getInitialProducts()));
    }
    if (!localStorage.getItem('mockOrders')) {
      localStorage.setItem('mockOrders', JSON.stringify(this.getInitialOrders()));
    }
    if (!localStorage.getItem('mockReviews')) {
      localStorage.setItem('mockReviews', JSON.stringify(this.getInitialReviews()));
    }
  }

  // Categories
  getInitialCategories() {
    return [
      { _id: 'cat1', category: 'Clothes' },
      { _id: 'cat2', category: 'Technology' },
      { _id: 'cat3', category: 'Skincare' },
      { _id: 'cat4', category: 'Food' },
      { _id: 'cat5', category: 'Accessories' }
    ];
  }

  // Colors
  getInitialColors() {
    return [
      { _id: 'col1', color: 'Black' },
      { _id: 'col2', color: 'White' },
      { _id: 'col3', color: 'Blue' },
      { _id: 'col4', color: 'Red' },
      { _id: 'col5', color: 'Green' },
      { _id: 'col6', color: 'Gray' }
    ];
  }

  // Sizes
  getInitialSizes() {
    return [
      { _id: 'size1', size: 'XS' },
      { _id: 'size2', size: 'S' },
      { _id: 'size3', size: 'M' },
      { _id: 'size4', size: 'L' },
      { _id: 'size5', size: 'XL' },
      { _id: 'size6', size: 'XXL' }
    ];
  }

  // Discounts
  getInitialDiscounts() {
    return [
      {
        _id: 'disc1',
        type: 'percentage',
        value: 10,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        targets: []
      }
    ];
  }

  // Users (Base User Schema)
  getInitialUsers() {
    return [
      {
        _id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        phonenumber: 1234567890,
        role: 'customer',
        gender: 'Male',
        addresses: [
          {
            label: 'Home',
            line1: '123 Main Street',
            city: 'New York',
            governorate: 'NY',
            zip: '10001',
            isDefault: true
          }
        ],
        wishlist: ['prod1', 'prod3'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        _id: 'user2',
        name: 'Fashion Forward',
        email: 'contact@fashionforward.com',
        password: 'password',
        phonenumber: 9876543210,
        role: 'brand',
        categories: ['Clothes', 'Accessories'],
        page: ['@fashionforward', 'fashionforward.com'],
        brandlocation: ['New York', 'Los Angeles'],
        logoURL: 'https://images.unsplash.com/photo-1560472354-b33ff0c43?w=200',
        deliveryTime: '3-5 business days',
        description: 'Leading fashion brand offering trendy and affordable clothing',
        isApproved: true,
        reviews: 'rev1',
        products: ['prod1', 'prod5'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        _id: 'user3',
        name: 'TechPro',
        email: 'info@techpro.com',
        password: 'password',
        phonenumber: 5551234567,
        role: 'brand',
        categories: ['Technology'],
        page: ['@techpro', 'techpro.com'],
        brandlocation: ['San Francisco'],
        logoURL: 'https://images.unsplash.com/photo-1560472354-b33ff0c43?w=200',
        deliveryTime: '2-4 business days',
        description: 'Innovative technology solutions',
        isApproved: false,
        reviews: 'rev2',
        products: ['prod2', 'prod6'],
        isActive: true,
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        _id: 'user4',
        name: 'Admin User',
        email: 'admin@brandhub.com',
        password: 'admin123',
        phonenumber: 1112223333,
        role: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];
  }

  // Products
  getInitialProducts() {
    return [
      {
        _id: 'prod1',
        brand: 'user2', // Fashion Forward
        productname: 'Premium Cotton T-Shirt',
        price: 29.99,
        quantity: 50,
        imageURL: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        description: 'High-quality cotton t-shirt with modern fit',
        category: 'cat1', // Clothes
        color: 'col1', // Black
        size: 'size3', // M
        discount: null,
        reviews: 'rev3',
        isActive: true,
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        _id: 'prod2',
        brand: 'user3', // TechPro
        productname: 'Wireless Bluetooth Headphones',
        price: 89.99,
        quantity: 25,
        imageURL: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        description: 'Premium wireless headphones with noise cancellation',
        category: 'cat2', // Technology
        color: 'col6', // Gray
        size: null, // No size for electronics
        discount: null,
        reviews: 'rev4',
        isActive: true,
        createdAt: '2024-01-10T00:00:00.000Z',
        updatedAt: '2024-01-10T00:00:00.000Z'
      },
      {
        _id: 'prod3',
        brand: 'user2', // Fashion Forward
        productname: 'Organic Face Cream',
        price: 45.99,
        quantity: 30,
        imageURL: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        description: 'Natural face cream with anti-aging properties',
        category: 'cat3', // Skincare
        color: null, // No color for skincare
        size: null, // No size for skincare
        discount: null,
        reviews: 'rev5',
        isActive: true,
        createdAt: '2024-01-20T00:00:00.000Z',
        updatedAt: '2024-01-20T00:00:00.000Z'
      },
      {
        _id: 'prod4',
        brand: 'user2', // Fashion Forward
        productname: 'Gourmet Coffee Beans',
        price: 24.99,
        quantity: 100,
        imageURL: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
        description: 'Premium arabica coffee beans from Colombia',
        category: 'cat4', // Food
        color: null, // No color for food
        size: null, // No size for food
        discount: null,
        reviews: 'rev6',
        isActive: true,
        createdAt: '2024-01-05T00:00:00.000Z',
        updatedAt: '2024-01-05T00:00:00.000Z'
      },
      {
        _id: 'prod5',
        brand: 'user2', // Fashion Forward
        productname: 'Designer Jeans',
        price: 129.99,
        quantity: 15,
        imageURL: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        description: 'Premium designer jeans with perfect fit',
        category: 'cat1', // Clothes
        color: 'col3', // Blue
        size: 'size4', // L
        discount: null,
        reviews: 'rev7',
        isActive: true,
        createdAt: '2024-01-12T00:00:00.000Z',
        updatedAt: '2024-01-12T00:00:00.000Z'
      },
      {
        _id: 'prod6',
        brand: 'user3', // TechPro
        productname: 'Smart Watch',
        price: 199.99,
        quantity: 20,
        imageURL: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        description: 'Advanced smartwatch with health tracking',
        category: 'cat2', // Technology
        color: 'col1', // Black
        size: null, // No size for electronics
        discount: null,
        reviews: 'rev8',
        isActive: true,
        createdAt: '2024-01-08T00:00:00.000Z',
        updatedAt: '2024-01-08T00:00:00.000Z'
      }
    ];
  }

  // Orders
  getInitialOrders() {
    return [
      {
        _id: 'order1',
        customer: 'user1', // John Doe
        products: [
          {
            product: 'prod1',
            quantity: 2
          },
          {
            product: 'prod4',
            quantity: 1
          }
        ],
        brand: 'user2', // Fashion Forward
        totalPrice: 84.97,
        deliveryAddress: '123 Main Street, New York, NY 10001',
        status: 'Delivered',
        isActive: true,
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        _id: 'order2',
        customer: 'user1', // John Doe
        products: [
          {
            product: 'prod2',
            quantity: 1
          }
        ],
        brand: 'user3', // TechPro
        totalPrice: 89.99,
        deliveryAddress: '123 Main Street, New York, NY 10001',
        status: 'Shipped',
        isActive: true,
        createdAt: '2024-01-20T00:00:00.000Z',
        updatedAt: '2024-01-20T00:00:00.000Z'
      }
    ];
  }

  // Reviews
  getInitialReviews() {
    return [
      {
        _id: 'rev1',
        customerId: 'user1',
        refType: 'Brand',
        refId: 'user2',
        quality: 4,
        comfort: 5,
        fit: 4,
        total: 4.3,
        comment: 'Great brand with quality products!',
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        _id: 'rev2',
        customerId: 'user1',
        refType: 'Brand',
        refId: 'user3',
        quality: 5,
        comfort: 4,
        fit: 5,
        total: 4.7,
        comment: 'Excellent technology products!',
        createdAt: '2024-01-10T00:00:00.000Z',
        updatedAt: '2024-01-10T00:00:00.000Z'
      },
      {
        _id: 'rev3',
        customerId: 'user1',
        refType: 'Product',
        refId: 'prod1',
        quality: 4,
        comfort: 5,
        fit: 4,
        total: 4.3,
        comment: 'Very comfortable t-shirt!',
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z'
      },
      {
        _id: 'rev4',
        customerId: 'user1',
        refType: 'Product',
        refId: 'prod2',
        quality: 5,
        comfort: 4,
        fit: 5,
        total: 4.7,
        comment: 'Amazing sound quality!',
        createdAt: '2024-01-10T00:00:00.000Z',
        updatedAt: '2024-01-10T00:00:00.000Z'
      }
    ];
  }

  // Helper methods
  getData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Helper to get populated data
  getPopulatedProduct(productId) {
    const products = this.getData('mockProducts');
    const product = products.find(p => p._id === productId);
    if (!product) return null;

    const brands = this.getData('mockUsers');
    const categories = this.getData('mockCategories');
    const colors = this.getData('mockColors');
    const sizes = this.getData('mockSizes');
    const reviews = this.getData('mockReviews');

    const brand = brands.find(b => b._id === product.brand);
    const category = categories.find(c => c._id === product.category);
    const color = colors.find(c => c._id === product.color);
    const size = sizes.find(s => s._id === product.size);
    const review = reviews.find(r => r._id === product.reviews);

    return {
      ...product,
      brand: brand ? { _id: brand._id, name: brand.name } : null,
      category: category ? category.category : null,
      color: color ? color.color : null,
      size: size ? size.size : null,
      reviews: review ? { rating: review.total, count: 1 } : { rating: 0, count: 0 }
    };
  }

  // Authentication
  async login(email, password, userType) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = this.getData('mockUsers');
    let user = null;
    
    if (userType === 'admin') {
      user = users.find(u => u.email === email && u.password === password && u.role === 'admin');
    } else if (userType === 'customer') {
      user = users.find(u => u.email === email && u.password === password && u.role === 'customer');
    } else if (userType === 'brand') {
      user = users.find(u => u.email === email && u.password === password && u.role === 'brand');
    }
    
    if (user) {
      return { success: true, token: 'mock-jwt-token-' + user._id, user };
    }
    throw new Error('Invalid credentials');
  }

  async signup(userData, userType) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      _id: this.generateId(),
      ...userData,
      role: userType,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (userType === 'customer') {
      newUser.wishlist = [];
      newUser.addresses = [];
      newUser.gender = userData.gender || 'Male';
    } else if (userType === 'brand') {
      newUser.isApproved = false;
      newUser.products = [];
      newUser.categories = userData.categories || [];
      newUser.page = userData.page || [];
      newUser.brandlocation = userData.brandlocation || [];
      newUser.logoURL = userData.logoURL || '';
      newUser.deliveryTime = userData.deliveryTime || '';
      newUser.description = userData.description || '';
    }
    
    const users = this.getData('mockUsers');
    users.push(newUser);
    this.setData('mockUsers', users);
    
    return { success: true, data: newUser };
  }

  // Customer APIs
  async getCustomerProfile() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const currentUserId = localStorage.getItem('currentUserId');
    
    if (!currentUserId) throw new Error('No user ID found');
    
    const customer = users.find(c => c._id === currentUserId && c.role === 'customer');
    
    if (!customer) throw new Error('Customer not found');
    
    // Get wishlist products
    const products = this.getData('mockProducts');
    const wishlistProducts = customer.wishlist ? customer.wishlist.map(id => this.getPopulatedProduct(id)).filter(Boolean) : [];
    
    // Get customer orders
    const orders = this.getData('mockOrders');
    const customerOrders = orders.filter(o => o.customer === customer._id);
    
    return {
      data: {
        ...customer,
        wishlist: wishlistProducts,
        orders: customerOrders
      }
    };
  }

  async updateCustomerProfile(profileData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const index = users.findIndex(c => c._id === localStorage.getItem('currentUserId'));
    
    if (index !== -1) {
      users[index] = { ...users[index], ...profileData, updatedAt: new Date().toISOString() };
      this.setData('mockUsers', users);
    }
    
    return { success: true };
  }

  async getCustomerWishlist() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const customer = users.find(c => c._id === localStorage.getItem('currentUserId'));
    const products = this.getData('mockProducts');
    
    const wishlistProducts = customer.wishlist ? customer.wishlist.map(id => this.getPopulatedProduct(id)).filter(Boolean) : [];
    return { data: wishlistProducts };
  }

  async addToWishlist(productId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const index = users.findIndex(c => c._id === localStorage.getItem('currentUserId'));
    
    if (index !== -1 && !users[index].wishlist.includes(productId)) {
      users[index].wishlist.push(productId);
      users[index].updatedAt = new Date().toISOString();
      this.setData('mockUsers', users);
    }
    
    return { success: true };
  }

  async removeFromWishlist(productId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const index = users.findIndex(c => c._id === localStorage.getItem('currentUserId'));
    
    if (index !== -1) {
      users[index].wishlist = users[index].wishlist.filter(id => id !== productId);
      users[index].updatedAt = new Date().toISOString();
      this.setData('mockUsers', users);
    }
    
    return { success: true };
  }

  async getCustomerCart() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return { data: cart };
  }

  async addToCart(productId, quantity) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const product = this.getPopulatedProduct(productId);
    
    const existingItem = cart.find(item => item.product._id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return { success: true };
  }

  async updateCartItem(productId, quantity) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(item => item.product._id === productId);
    
    if (item) {
      if (quantity <= 0) {
        cart.splice(cart.indexOf(item), 1);
      } else {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return { success: true };
  }

  async removeFromCart(productId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const filteredCart = cart.filter(item => item.product._id !== productId);
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    return { success: true };
  }

  async createOrder(orderData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const orders = this.getData('mockOrders');
    const newOrder = {
      _id: this.generateId(),
      customer: localStorage.getItem('currentUserId'),
      products: orderData.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      brand: orderData.items[0]?.product.brand._id,
      totalPrice: orderData.total,
      deliveryAddress: orderData.shippingAddress,
      status: 'Pending',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    this.setData('mockOrders', orders);
    
    // Clear cart
    localStorage.removeItem('cart');
    
    return { success: true, orderId: newOrder._id };
  }

  async getCustomerOrders() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = this.getData('mockOrders');
    const customerOrders = orders.filter(o => o.customer === localStorage.getItem('currentUserId'));
    return { data: customerOrders };
  }

  // Product APIs
  async getAllProducts() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const products = this.getData('mockProducts');
    const populatedProducts = products.map(p => this.getPopulatedProduct(p._id)).filter(Boolean);
    return { data: populatedProducts };
  }

  async getProductById(productId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const product = this.getPopulatedProduct(productId);
    return { data: product };
  }

  async searchProducts(query) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const products = this.getData('mockProducts');
    const populatedProducts = products.map(p => this.getPopulatedProduct(p._id)).filter(Boolean);
    const filtered = populatedProducts.filter(p => 
      (p.productname && p.productname.toLowerCase().includes(query.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );
    return { data: filtered };
  }

  // Brand APIs
  async getBrandProfile() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const currentUserId = localStorage.getItem('currentUserId');
    
    if (!currentUserId) throw new Error('No user ID found');
    
    const brand = users.find(b => b._id === currentUserId && b.role === 'brand');
    
    if (!brand) throw new Error('Brand not found');
    
    // Get brand products
    const products = this.getData('mockProducts');
    const brandProducts = products.filter(p => p.brand === brand._id).map(p => this.getPopulatedProduct(p._id));
    
    // Get brand orders
    const orders = this.getData('mockOrders');
    const brandOrders = orders.filter(o => o.brand === brand._id);
    
    return {
      data: {
        ...brand,
        products: brandProducts,
        orders: brandOrders
      }
    };
  }

  async updateBrandProfile(profileData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const index = users.findIndex(b => b._id === localStorage.getItem('currentUserId'));
    
    if (index !== -1) {
      users[index] = { ...users[index], ...profileData, updatedAt: new Date().toISOString() };
      this.setData('mockUsers', users);
    }
    
    return { success: true };
  }

  async getBrandProducts() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const brand = users.find(b => b._id === localStorage.getItem('currentUserId'));
    const products = this.getData('mockProducts');
    const brandProducts = products.filter(p => p.brand === brand._id).map(p => this.getPopulatedProduct(p._id));
    return { data: brandProducts };
  }

  async createProduct(productData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const products = this.getData('mockProducts');
    const users = this.getData('mockUsers');
    const brand = users.find(b => b._id === localStorage.getItem('currentUserId'));
    
    const newProduct = {
      _id: this.generateId(),
      brand: brand._id,
      productname: productData.productname,
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity),
      imageURL: productData.imageURL || '',
      description: productData.description || '',
      category: productData.category || 'cat1',
      color: productData.color || null,
      size: productData.size || null,
      discount: null,
      reviews: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    this.setData('mockProducts', products);
    
    // Add product to brand's products array
    const brandIndex = users.findIndex(b => b._id === brand._id);
    if (brandIndex !== -1) {
      users[brandIndex].products.push(newProduct._id);
      users[brandIndex].updatedAt = new Date().toISOString();
      this.setData('mockUsers', users);
    }
    
    return { success: true, productId: newProduct._id };
  }

  async updateProduct(productId, productData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const products = this.getData('mockProducts');
    const index = products.findIndex(p => p._id === productId);
    
    if (index !== -1) {
      products[index] = { 
        ...products[index], 
        ...productData,
        updatedAt: new Date().toISOString()
      };
      this.setData('mockProducts', products);
    }
    
    return { success: true };
  }

  async deleteProduct(productId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const products = this.getData('mockProducts');
    const filteredProducts = products.filter(p => p._id !== productId);
    this.setData('mockProducts', filteredProducts);
    return { success: true };
  }

  async getBrandOrders() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const brand = users.find(b => b._id === localStorage.getItem('currentUserId'));
    const orders = this.getData('mockOrders');
    const brandOrders = orders.filter(o => o.brand === brand._id);
    return { data: brandOrders };
  }

  async updateOrderStatus(orderId, status) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = this.getData('mockOrders');
    const index = orders.findIndex(o => o._id === orderId);
    
    if (index !== -1) {
      orders[index].status = status;
      orders[index].updatedAt = new Date().toISOString();
      this.setData('mockOrders', orders);
    }
    
    return { success: true };
  }

  // Admin APIs
  async getAdminDashboard() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const products = this.getData('mockProducts');
    const orders = this.getData('mockOrders');
    
    const customers = users.filter(u => u.role === 'customer');
    const brands = users.filter(u => u.role === 'brand');
    
    return {
      data: {
        totalCustomers: customers.length,
        totalBrands: brands.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingBrands: brands.filter(b => !b.isApproved),
        recentOrders: orders.slice(-5),
        revenue: orders.reduce((sum, order) => sum + order.totalPrice, 0)
      }
    };
  }

  async approveBrand(brandId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const index = users.findIndex(b => b._id === brandId);
    
    if (index !== -1) {
      users[index].isApproved = true;
      users[index].updatedAt = new Date().toISOString();
      this.setData('mockUsers', users);
    }
    
    return { success: true };
  }

  async rejectBrand(brandId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const filteredUsers = users.filter(b => b._id !== brandId);
    this.setData('mockUsers', filteredUsers);
    return { success: true };
  }

  async getAllBrands() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = this.getData('mockUsers');
    const brands = users.filter(u => u.role === 'brand');
    return { data: brands };
  }

  async getAllOrders() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = this.getData('mockOrders');
    return { data: orders };
  }
}

// Create singleton instance
const mockApiService = new MockDataService();

// Export static data for initial state
export const mockProducts = mockApiService.getInitialProducts().map(p => mockApiService.getPopulatedProduct(p._id));
export const mockCustomer = mockApiService.getInitialUsers().find(u => u.role === 'customer');
export const mockBrand = mockApiService.getInitialUsers().find(u => u.role === 'brand');
export const mockCart = [];

export { mockApiService }; 