// src/pages/Home.js
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="relative bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-white to-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-lg">
            Discover Your Next Favorite Brand
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-xl mx-auto">
            Shop clothing from rising brands and startups. One marketplace, endless style.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/products"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg text-sm hover:bg-pink-700 transition shadow-md"
            >
              Browse Clothing
            </Link>
            <Link
              to="/signup"
              className="border border-pink-600 text-pink-600 px-6 py-3 rounded-lg text-sm hover:bg-pink-50 transition shadow-md"
            >
              Join BrandHub
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center blur-sm"></div>
      </div>

      {/* Feature Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3281/3281300.png"
              alt="Brands"
              className="h-20 mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">Unique Brands</h3>
            <p className="text-sm text-gray-600">
              Discover handpicked startups and fresh fashion designers.
            </p>
          </div>
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3523/3523881.png"
              alt="Support"
              className="h-20 mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">Secure Checkout</h3>
            <p className="text-sm text-gray-600">
              Smooth and safe payment processing across all devices.
            </p>
          </div>
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="Shipping"
              className="h-20 mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Brands ship directly to you, hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
