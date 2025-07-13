# 🛍️ BrandHub - Complete E-commerce Frontend

A fully functional e-commerce platform built with React, featuring dynamic mock data, multi-role authentication, and comprehensive shopping features.

## ✨ Features

### 🎯 **Core E-commerce Features**
- **Product Catalog** - Browse, search, filter, and sort products
- **Shopping Cart** - Add/remove items, update quantities, checkout
- **Wishlist** - Save favorite products for later
- **Order Management** - Track order history and status
- **Product Details** - Detailed product pages with images and reviews
- **Responsive Design** - Works perfectly on all devices

### 👥 **Multi-Role Authentication**
- **Customer** - Shop, manage profile, track orders
- **Brand** - Manage products, handle orders, view analytics
- **Admin** - Approve/reject brands, manage platform

### 🏪 **Customer Features**
- Browse and search products
- Add items to cart and wishlist
- Complete checkout process
- Manage personal profile and addresses
- View order history and tracking
- Filter products by category, price, and rating

### 🏢 **Brand Dashboard**
- Product management (add, edit, delete)
- Order management and status updates
- Sales analytics and insights
- Brand profile management
- Inventory tracking

### 🔧 **Admin Panel**
- Brand approval/rejection system
- Platform analytics and statistics
- Order monitoring
- User management overview

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open at `http://localhost:3000`

## 🔐 Login Credentials

### Customer Account
- **Email:** `john@example.com`
- **Password:** `password`
- **Features:** Shopping, wishlist, order management

### Brand Account
- **Email:** `contact@fashionforward.com`
- **Password:** `password`
- **Features:** Product management, order handling

### Admin Account
- **Email:** `admin@brandhub.com`
- **Password:** `admin123`
- **Features:** Brand approval, platform management

## 🧪 Testing Guide

### 1. **Customer Experience**
1. Login as customer (`john@example.com` / `password`)
2. Browse products on the home page
3. Use search and filters to find specific items
4. Add products to cart and wishlist
5. Complete checkout process
6. View order history in profile

### 2. **Brand Management**
1. Login as brand (`contact@fashionforward.com` / `password`)
2. Access brand dashboard
3. Add new products with images and details
4. Edit existing products
5. Manage incoming orders
6. Update order statuses

### 3. **Admin Functions**
1. Login as admin (`admin@brandhub.com` / `admin123`)
2. Access admin panel at `/admin`
3. View platform statistics
4. Approve or reject pending brands
5. Monitor all orders and users

### 4. **Dynamic Features to Test**
- **Account Creation:** Sign up as new customer or brand
- **Cart Persistence:** Items stay in cart across sessions
- **Wishlist Management:** Add/remove items dynamically
- **Order Creation:** Each order gets unique ID and status
- **Brand Approval:** Admin can approve/reject brands
- **Product Management:** Add/edit/delete products
- **Search & Filtering:** Real-time product filtering

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.js       # Navigation with user menu
│   │   ├── Footer.js       # Site footer
│   │   └── SearchBar.js    # Product search component
│   ├── context/            # React context providers
│   │   ├── AuthContext.js  # Authentication state
│   │   └── CartContext.js  # Shopping cart state
│   ├── pages/              # Main application pages
│   │   ├── Home.js         # Landing page
│   │   ├── Products.js     # Product catalog
│   │   ├── ProductDetails.js # Individual product page
│   │   ├── Cart.js         # Shopping cart
│   │   ├── Wishlist.js     # Saved products
│   │   ├── Profile.js      # Customer profile
│   │   ├── BrandDashboard.js # Brand management
│   │   ├── AdminDashboard.js # Admin panel
│   │   ├── Login.js        # Authentication
│   │   └── Signup.js       # Account creation
│   ├── services/           # Data and API services
│   │   └── mockData.js     # Dynamic mock data service
│   └── App.js              # Main application component
```

## 🔧 Technical Features

### **Dynamic Mock Data System**
- LocalStorage persistence for realistic data management
- Simulated API delays for authentic user experience
- Real-time state updates across all components
- Unique ID generation for new entities

### **State Management**
- React Context for global state (auth, cart)
- Local component state for UI interactions
- Persistent storage for user data and preferences

### **User Experience**
- Loading states and error handling
- Responsive design with Tailwind CSS
- Smooth animations and transitions
- Intuitive navigation and user flows

### **Security Features**
- Role-based access control
- Protected routes for different user types
- Session management with localStorage
- Input validation and error handling

## 🎨 UI/UX Features

### **Design System**
- Modern, clean interface with pink/purple theme
- Consistent spacing and typography
- Professional e-commerce aesthetics
- Mobile-first responsive design

### **Interactive Elements**
- Hover effects and transitions
- Loading spinners and progress indicators
- Toast notifications for user feedback
- Modal dialogs for confirmations

### **Accessibility**
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

## 🔄 Data Persistence

The application uses localStorage to simulate a real database:
- **Products:** Stored in `mockProducts`
- **Users:** Stored in `mockCustomers`, `mockBrands`, `mockUsers`
- **Orders:** Stored in `mockOrders`
- **Cart:** Stored in `cart` (for non-authenticated users)

All data persists across browser sessions and updates in real-time.

## 🎯 Key Improvements Made

1. **Dynamic Data Management** - All data now updates in real-time
2. **Proper Authentication** - User sessions work correctly
3. **Cart Functionality** - Items persist and update properly
4. **Order Management** - New orders are created with unique IDs
5. **Brand Approval System** - Admin can approve/reject brands
6. **Price Filtering** - Fixed filtering logic
7. **Admin Dashboard** - Complete admin panel with analytics
8. **Wishlist Management** - Dynamic add/remove functionality

## 🐛 Troubleshooting

### Common Issues
1. **Login not working:** Clear localStorage and try again
2. **Cart not updating:** Refresh page to reload state
3. **Data not persisting:** Check browser localStorage support
4. **Admin access denied:** Ensure correct admin credentials

### Reset Data
To reset all mock data to initial state:
```javascript
localStorage.clear();
location.reload();
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Happy Shopping! 🛍️✨**
