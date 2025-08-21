// src/components/Navbar.js
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaStore, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, userType, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <nav className="bg-white border-b shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-pink-600">
          BrandHub
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          ☰
        </button>

        {/* Nav Links */}
        <div className={`md:flex space-x-6 items-center ${isOpen ? 'block' : 'hidden'} md:block`}>
          <Link to="/" className="text-gray-700 hover:text-pink-600 transition">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-pink-600 transition">
            Products
          </Link>
          
          {/* Cart Icon with Badge - Only show for customers */}
          {userType === 'customer' && (
            <Link to="/cart" className="text-gray-700 hover:text-pink-600 transition text-xl relative">
              <FaShoppingCart />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition"
              >
                <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center">
                  {userType === 'brand' ? <FaStore /> : <FaUser />}
                </div>
                <span className="hidden md:block">{user?.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to={userType === 'brand' ? '/dashboard' : userType === 'admin' ? '/admin' : '/profile'}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {userType === 'brand' ? 'Dashboard' : userType === 'admin' ? 'Admin Panel' : 'Profile'}
                  </Link>
                  {userType === 'customer' && (
                    <>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Wishlist
                      </Link>
                    </>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-4 py-2 border rounded-md border-pink-600 text-pink-600 hover:bg-pink-50 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm px-4 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
