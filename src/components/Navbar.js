// src/components/Navbar.js
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
          <Link to="/cart" className="text-gray-700 hover:text-pink-600 transition text-xl">
            <FaShoppingCart />
          </Link>
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
