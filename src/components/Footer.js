import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10 py-6 text-sm text-gray-600">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} BrandHub. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-gray-900 transition">About</Link>
          <Link to="/contact" className="hover:text-gray-900 transition">Contact</Link>
          <Link to="/privacy" className="hover:text-gray-900 transition">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
