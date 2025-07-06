// File: src/pages/NotFound.js

import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-white to-red-100">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
      >
        Go back Home
      </Link>
    </div>
  );
}

export default NotFound;
